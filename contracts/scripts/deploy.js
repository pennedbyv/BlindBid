async function main() {
  const Auction = await ethers.getContractFactory("BlindBidAuction");
  const auction = await Auction.deploy();

  await auction.waitForDeployment();

  console.log("BlindBidAuction deployed to:", await auction.getAddress());
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
