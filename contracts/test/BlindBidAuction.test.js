const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("BlindBidAuction Unit Tests", function () {
  let BlindBidAuction;
  let auction;
  let MockNFT;
  let nft;
  let owner; // Deployer / Operator
  let seller;
  let bidder1;
  let bidder2;
  const BID_INCREMENT = ethers.parseEther("0.1");

  beforeEach(async function () {
    // Get signers
    [owner, seller, bidder1, bidder2] = await ethers.getSigners();

    // Deploy MockNFT
    MockNFT = await ethers.getContractFactory("MockNFT");
    nft = await MockNFT.deploy();
    await nft.waitForDeployment();

    // Deploy BlindBidAuction
    BlindBidAuction = await ethers.getContractFactory("BlindBidAuction");
    auction = await BlindBidAuction.deploy();
    await auction.waitForDeployment();
  });

  describe("Constructor & Initialization", function () {
    it("Should set the correct operator on deployment", async function () {
      expect(await auction.operator()).to.equal(owner.address);
    });

    it("Should allow the operator to change the operator", async function () {
      await auction.setOperator(seller.address);
      expect(await auction.operator()).to.equal(seller.address);
    });

    it("Should reject non-operator from changing the operator", async function () {
      await expect(
        auction.connect(seller).setOperator(seller.address)
      ).to.be.revertedWith("Only operator can set operator");
    });
  });

  describe("Vault Creation", function () {
    it("Should create a vault and hold NFTs in escrow", async function () {
      // Mint 2 NFTs to seller
      await nft.mint(seller.address);
      await nft.mint(seller.address);

      // Approve contract to transfer NFTs
      const nftAddress = await nft.getAddress();
      await nft.connect(seller).approve(await auction.getAddress(), 0);
      await nft.connect(seller).approve(await auction.getAddress(), 1);

      // Create vault
      await expect(
        auction.connect(seller).createVault(
          [nftAddress, nftAddress],
          [0, 1],
          "Collection Theme A",
          "A mystery package of collectibles"
        )
      )
        .to.emit(auction, "VaultCreated")
        .withArgs(0, seller.address);

      // Check NFT escrow
      expect(await nft.ownerOf(0)).to.equal(await auction.getAddress());
      expect(await nft.ownerOf(1)).to.equal(await auction.getAddress());

      // Check vault parameters
      expect(await auction.vaultCount()).to.equal(1);
    });
  });

  describe("Auction Lifecycle & Bidding", function () {
    let nftAddress;

    beforeEach(async function () {
      nftAddress = await nft.getAddress();

      // Mint and approve NFTs
      await nft.mint(seller.address);
      await nft.mint(seller.address);
      await nft.connect(seller).approve(await auction.getAddress(), 0);
      await nft.connect(seller).approve(await auction.getAddress(), 1);

      // Create Vault
      await auction.connect(seller).createVault(
        [nftAddress, nftAddress],
        [0, 1],
        "Mystery Theme",
        "Top secrets"
      );
    });

    it("Should create and immediately start/activate the auction", async function () {
      const reservePrice = ethers.parseEther("0.5");
      const duration = 300; // 5 minutes

      // Create auction (emits AuctionCreated and AuctionStarted)
      await expect(
        auction.connect(seller).createAuction(
          0, // vaultId
          reservePrice,
          duration,
          ethers.parseEther("1.0"), // estimatedValue
          90, // confidenceScore
          "2 Rares" // raritySummary
        )
      )
        .to.emit(auction, "AuctionCreated")
        .withArgs(0, reservePrice);

      const act = await auction.getAuction(0);
      expect(act.active).to.be.true;
      expect(act.ended).to.be.false;
      expect(act.reservePrice).to.equal(reservePrice);
      expect(act.currentBid).to.equal(reservePrice);
    });

    it("Should handle valid and invalid bids correctly", async function () {
      const reservePrice = ethers.parseEther("0.5");
      await auction.connect(seller).createAuction(
        0,
        reservePrice,
        300,
        ethers.parseEther("1.0"),
        90,
        "2 Rares"
      );

      // First bid must be reservePrice + BID_INCREMENT (0.5 + 0.1 = 0.6 MON)
      const firstBidAmount = reservePrice + BID_INCREMENT;

      // Reject bid with wrong increment
      await expect(
        auction.connect(bidder1).bid(0, { value: ethers.parseEther("0.55") })
      ).to.be.revertedWith("Bid must be +0.1 MON");

      // Place valid bid
      await expect(
        auction.connect(bidder1).bid(0, { value: firstBidAmount })
      )
        .to.emit(auction, "BidPlaced")
        .withArgs(0, bidder1.address, firstBidAmount);

      let act = await auction.getAuction(0);
      expect(act.currentBid).to.equal(firstBidAmount);
      expect(act.highestBidder).to.equal(bidder1.address);

      // Second bid must be currentBid + BID_INCREMENT (0.6 + 0.1 = 0.7 MON)
      const secondBidAmount = firstBidAmount + BID_INCREMENT;

      // Place second bid and verify refund to bidder1
      const initialBalanceBidder1 = await ethers.provider.getBalance(bidder1.address);
      
      await auction.connect(bidder2).bid(0, { value: secondBidAmount });

      const finalBalanceBidder1 = await ethers.provider.getBalance(bidder1.address);
      
      // Bidder1 should have received their 0.6 MON refund
      expect(finalBalanceBidder1 - initialBalanceBidder1).to.equal(firstBidAmount);

      act = await auction.getAuction(0);
      expect(act.currentBid).to.equal(secondBidAmount);
      expect(act.highestBidder).to.equal(bidder2.address);
    });

    it("Should settle and transfer assets correctly on endAuction", async function () {
      const reservePrice = ethers.parseEther("0.5");
      await auction.connect(seller).createAuction(
        0,
        reservePrice,
        300,
        ethers.parseEther("1.0"),
        90,
        "2 Rares"
      );

      // Place a bid
      const bidAmount = reservePrice + BID_INCREMENT;
      await auction.connect(bidder1).bid(0, { value: bidAmount });

      // Increase time so duration expires
      await ethers.provider.send("evm_increaseTime", [301]);
      await ethers.provider.send("evm_mine");

      // Settle auction and check funds transfer to seller and NFTs to bidder1
      const initialSellerBalance = await ethers.provider.getBalance(seller.address);
      
      await expect(auction.connect(bidder1).endAuction(0))
        .to.emit(auction, "AuctionEnded")
        .withArgs(0, bidder1.address, bidAmount);

      const finalSellerBalance = await ethers.provider.getBalance(seller.address);

      // Seller should receive the bidAmount
      expect(finalSellerBalance - initialSellerBalance).to.equal(bidAmount);

      // Bidder1 should now own the NFTs
      expect(await nft.ownerOf(0)).to.equal(bidder1.address);
      expect(await nft.ownerOf(1)).to.equal(bidder1.address);

      const act = await auction.getAuction(0);
      expect(act.active).to.be.false;
      expect(act.ended).to.be.true;
    });
  });

  describe("Access Control & Getters", function () {
    let nftAddress;

    beforeEach(async function () {
      nftAddress = await nft.getAddress();
      await nft.mint(seller.address);
      await nft.connect(seller).approve(await auction.getAddress(), 0);
      await auction.connect(seller).createVault([nftAddress], [0], "Preview Info", "Secret NFT");
    });

    it("Should restrict getVaultWithAuction from non-owners when active", async function () {
      await auction.connect(seller).createAuction(
        0,
        ethers.parseEther("0.1"),
        300,
        ethers.parseEther("0.2"),
        95,
        "1 Common"
      );

      // Non-seller queries vault: should revert
      await expect(
        auction.connect(bidder1).getVaultWithAuction(0)
      ).to.be.revertedWith("Auction not ended");

      // Seller queries vault: should succeed
      const details = await auction.connect(seller).getVaultWithAuction(0);
      expect(details.name).to.equal("Preview Info");
    });

    it("Should return preview data correctly on getAuctionCard", async function () {
      await auction.connect(seller).createAuction(
        0,
        ethers.parseEther("0.1"),
        300,
        ethers.parseEther("0.2"),
        95,
        "1 Common"
      );

      const card = await auction.connect(bidder1).getAuctionCard(0);
      expect(card.name).to.equal("Preview Info");
      expect(card.estimatedValue).to.equal(ethers.parseEther("0.2"));
      expect(card.confidenceScore).to.equal(95);
      expect(card.raritySummary).to.equal("1 Common");
      expect(card.nftCount).to.equal(1);
    });
  });

  describe("Cancellation Flow", function () {
    let nftAddress;

    beforeEach(async function () {
      nftAddress = await nft.getAddress();
      await nft.mint(seller.address);
      await nft.connect(seller).approve(await auction.getAddress(), 0);
      await auction.connect(seller).createVault([nftAddress], [0], "Cancel Test", "For refund checks");
    });

    it("Should cancel active auction if no bids have been placed and allow vault cancellation", async function () {
      await auction.connect(seller).createAuction(
        0,
        ethers.parseEther("0.1"),
        300,
        ethers.parseEther("0.2"),
        95,
        "1 Common"
      );

      // Cancel auction (reverts if bids were placed)
      await expect(auction.connect(seller).cancelAuction(0))
        .to.emit(auction, "AuctionCancelled")
        .withArgs(0);

      // Check auction is inactive
      const act = await auction.getAuction(0);
      expect(act.active).to.be.false;

      // Cancel vault and verify NFTs are returned to the seller
      await expect(auction.connect(seller).cancelVault(0))
        .to.emit(auction, "VaultCancelled")
        .withArgs(0);

      expect(await nft.ownerOf(0)).to.equal(seller.address);
    });
  });
});
