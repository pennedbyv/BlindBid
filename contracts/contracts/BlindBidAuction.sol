// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

/**
 * @title BlindBidAuction
 * @notice Blind vault-based NFT auction protocol
 */
contract BlindBidAuction is ReentrancyGuard {
    /* ---------- STRUCTS ---------- */
   
    uint256 public constant BID_INCREMENT = 0.1 ether;

    struct NFTItem {
        address nftAddress;
        uint256 tokenId;
    }

    struct Auction {
        address seller;
        uint256 currentBid;
        address highestBidder;
        uint256 startTime;
        uint256 lastBidTime;
        uint256 bidWindow;
        uint256 auctionDuration;
        uint256 endTime;
        bool active;
        bool ended;
        uint256 reservePrice; // Renamed from startPrice
    }

    struct AuctionPreview {
        uint256 estimatedValue;
        uint8 confidenceScore;
        string raritySummary;
    }

    struct Vault {
        NFTItem[] nfts;
        Auction auction;
        string name;
        string description;
        AuctionPreview preview;
    }

    /* ---------- STORAGE ---------- */

    uint256 public vaultCount;
    mapping(uint256 => Vault) public vaults;
    uint256[] public auctionIds;
    address public operator;

    /* ---------- EVENTS ---------- */

    event VaultCreated(uint256 indexed vaultId, address indexed seller);
    event AuctionCreated(uint256 indexed vaultId, uint256 reservePrice); // Renamed startPrice -> reservePrice
    event AuctionStarted(
        uint256 indexed vaultId,
        uint256 startTime,
        uint256 endTime
    );
    event BidPlaced(uint256 indexed vaultId, address bidder, uint256 amount);
    event AuctionEnded(
        uint256 indexed vaultId,
        address winner,
        uint256 finalPrice
    );
    event AuctionCancelled(uint256 indexed vaultId);
    event VaultCancelled(uint256 indexed vaultId);

    /* ---------- MODIFIERS ---------- */

    modifier onlySellerOrOperator(uint256 vaultId) {
        require(
            msg.sender == vaults[vaultId].auction.seller || msg.sender == operator,
            "Not authorized"
        );
        _;
    }

    modifier onlySeller(uint256 vaultId) {
        require(
            msg.sender == vaults[vaultId].auction.seller,
            "Not vault seller"
        );
        _;
    }

    /* ---------- CONSTRUCTOR ---------- */

    constructor() {
        operator = msg.sender;
    }

    /* ---------- OPERATOR SETTER ---------- */

    function setOperator(address _operator) external {
        require(msg.sender == operator, "Only operator can set operator");
        operator = _operator;
    }

    /* ---------- VAULT ---------- */

    function createVault(
        address[] calldata nftAddresses,
        uint256[] calldata tokenIds,
        string calldata name,
        string calldata description
    ) external {
        require(nftAddresses.length == tokenIds.length, "Length mismatch");
        require(nftAddresses.length > 0, "Empty vault");

        uint256 vaultId = vaultCount;
        Vault storage v = vaults[vaultId];

        for (uint256 i = 0; i < nftAddresses.length; i++) {
            IERC721(nftAddresses[i]).transferFrom(
                msg.sender,
                address(this),
                tokenIds[i]
            );

            v.nfts.push(
                NFTItem({nftAddress: nftAddresses[i], tokenId: tokenIds[i]})
            );
        }

        v.auction.seller = msg.sender;
        v.name = name;
        v.description = description;

        vaultCount++;

        emit VaultCreated(vaultId, msg.sender);
    }

    /* ---------- AUCTION ---------- */

    /**
     * @notice Merged create and start auction. Creates and immediately activates the auction.
     *         Accepts off-chain AI strategist preview data.
     */
    function createAuction(
        uint256 vaultId,
        uint256 reservePrice,
        uint256 auctionDuration,
        uint256 estimatedValue,
        uint8 confidenceScore,
        string calldata raritySummary
    ) external onlySellerOrOperator(vaultId) {
        Auction storage a = vaults[vaultId].auction;

        require(!a.active && !a.ended, "Auction exists");
        require(auctionDuration > 0, "Invalid duration");

        a.reservePrice = reservePrice;
        a.currentBid = reservePrice;
        a.bidWindow = 60 seconds;
        a.auctionDuration = auctionDuration;
        
        a.startTime = block.timestamp;
        a.lastBidTime = block.timestamp;
        a.endTime = block.timestamp + auctionDuration;
        a.active = true;
        a.ended = false;

        Vault storage v = vaults[vaultId];
        v.preview = AuctionPreview({
            estimatedValue: estimatedValue,
            confidenceScore: confidenceScore,
            raritySummary: raritySummary
        });

        auctionIds.push(vaultId);

        emit AuctionCreated(vaultId, reservePrice);
        emit AuctionStarted(vaultId, a.startTime, a.endTime);
    }

    function cancelAuction(uint256 vaultId) external onlySellerOrOperator(vaultId) {
        Auction storage a = vaults[vaultId].auction;

        require(a.active, "Auction not active");
        require(!a.ended, "Auction already ended");
        require(a.highestBidder == address(0), "Bids already placed");

        // reset auction state
        delete vaults[vaultId].auction;

        emit AuctionCancelled(vaultId);
    }

    function cancelVault(uint256 vaultId) external onlySellerOrOperator(vaultId) {
        Auction storage a = vaults[vaultId].auction;
        Vault storage v = vaults[vaultId];

        require(!a.active, "Auction active");
        require(!a.ended, "Auction already ended");

        // return NFTs to seller
        for (uint256 i = 0; i < v.nfts.length; i++) {
            IERC721(v.nfts[i].nftAddress).transferFrom(
                address(this),
                a.seller,
                v.nfts[i].tokenId
            );
        }

        // clear vault storage
        delete vaults[vaultId];

        emit VaultCancelled(vaultId);
    }

    function bid(uint256 vaultId) external payable nonReentrant {
        Auction storage a = vaults[vaultId].auction;

        require(a.active && !a.ended, "Auction inactive");
        require(block.timestamp <= a.endTime, "Auction duration ended");
        require(
            block.timestamp <= a.lastBidTime + a.bidWindow,
            "Bid window expired"
        );

        require(
            msg.value == a.currentBid + BID_INCREMENT,
            "Bid must be +0.1 MON"
        );

        // refund previous bidder
        if (a.highestBidder != address(0)) {
            payable(a.highestBidder).transfer(a.currentBid);
        }

        a.currentBid = msg.value;
        a.highestBidder = msg.sender;
        a.lastBidTime = block.timestamp;

        emit BidPlaced(vaultId, msg.sender, msg.value);
    }

    function endAuction(uint256 vaultId) external nonReentrant {
        Auction storage a = vaults[vaultId].auction;
        Vault storage v = vaults[vaultId];

        require(a.active && !a.ended, "Invalid state");
        require(
            block.timestamp > a.endTime ||
                block.timestamp > a.lastBidTime + a.bidWindow,
            "Auction still running"
        );

        a.active = false;
        a.ended = true;

        if (a.highestBidder != address(0)) {
            for (uint256 i = 0; i < v.nfts.length; i++) {
                IERC721(v.nfts[i].nftAddress).transferFrom(
                    address(this),
                    a.highestBidder,
                    v.nfts[i].tokenId
                );
            }

            payable(a.seller).transfer(a.currentBid);
            emit AuctionEnded(vaultId, a.highestBidder, a.currentBid);
        } else {
            for (uint256 i = 0; i < v.nfts.length; i++) {
                IERC721(v.nfts[i].nftAddress).transferFrom(
                    address(this),
                    a.seller,
                    v.nfts[i].tokenId
                );
            }

            emit AuctionEnded(vaultId, address(0), 0);
        }
    }

    /* ---------- GETTERS ---------- */

    function getAuction(
        uint256 vaultId
    ) external view returns (Auction memory) {
        return vaults[vaultId].auction;
    }

    /**
     * @notice Returns full vault details along with auction state
     * @dev Only readable by the seller/operator or after the auction has ended (reveal phase)
     */
    function getVaultWithAuction(
        uint256 vaultId
    )
        external
        view
        returns (
            string memory name,
            string memory description,
            NFTItem[] memory nfts,
            address seller,
            uint256 currentBid,
            address highestBidder,
            uint256 lastBidTime,
            bool active,
            bool ended,
            uint256 reservePrice
        )
    {
        Vault storage v = vaults[vaultId];
        Auction storage a = v.auction;

        require(
            a.ended || msg.sender == a.seller || msg.sender == operator,
            "Auction not ended"
        );

        return (
            v.name,
            v.description,
            v.nfts,
            a.seller,
            a.currentBid,
            a.highestBidder,
            a.lastBidTime,
            a.active,
            a.ended,
            a.reservePrice
        );
    }

    /**
     * @notice Returns minimal data needed to render auction cards without exposing NFT details
     */
    function getAuctionCard(
        uint256 vaultId
    )
        external
        view
        returns (
            string memory name,
            string memory description,
            bool isLive,
            bool isEnded,
            uint256 timeRemaining,
            uint256 minimumPrice,
            uint256 estimatedValue,
            uint8 confidenceScore,
            string memory raritySummary,
            uint256 nftCount
        )
    {
        Vault storage v = vaults[vaultId];
        Auction storage a = v.auction;

        uint256 remaining;

        if (a.ended) {
            remaining = 0;
        } else if (block.timestamp >= a.endTime) {
            remaining = 0;
        } else {
            remaining = a.endTime - block.timestamp;
        }

        return (
            v.name,
            v.description,
            a.active,
            a.ended,
            remaining,
            a.reservePrice,
            v.preview.estimatedValue,
            v.preview.confidenceScore,
            v.preview.raritySummary,
            v.nfts.length
        );
    }

    /**
     * @notice Checks if a user is the seller of a vault
     */
    function isVaultSeller(
        uint256 vaultId,
        address user
    ) external view returns (bool) {
        return vaults[vaultId].auction.seller == user;
    }

    /**
     * @notice Returns all vault IDs that have had auctions started
     */
    function getAllAuctions() external view returns (uint256[] memory) {
        return auctionIds;
    }

    function getAuctionTiming(
        uint256 vaultId
    )
        external
        view
        returns (
            uint256 lastBidTime,
            uint256 bidWindow,
            uint256 endTime,
            bool active,
            bool ended
        )
    {
        Auction storage a = vaults[vaultId].auction;
        return (a.lastBidTime, a.bidWindow, a.endTime, a.active, a.ended);
    }

    function getAuctionPreview(
        uint256 vaultId
    )
        external
        view
        returns (
            uint256 estimatedValue,
            uint8 confidenceScore,
            string memory raritySummary,
            uint256 nftCount
        )
    {
        Vault storage v = vaults[vaultId];
        return (
            v.preview.estimatedValue,
            v.preview.confidenceScore,
            v.preview.raritySummary,
            v.nfts.length
        );
    }
}
