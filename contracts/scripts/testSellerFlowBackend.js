async function testFlow() {
  console.log("Triggering POST /seller/create-auction on backend...");

  const payload = {
    vaultId: 1,
    sellerGoal: "Sell this NFT bundle as quickly as possible. Speed is important, give a reasonable discount.",
    nftBundle: [
      { tokenId: 0, collectionName: "MockNFT", rarity: "Common", name: "Mock #0" },
      { tokenId: 1, collectionName: "MockNFT", rarity: "Rare", name: "Mock #1" },
      { tokenId: 2, collectionName: "MockNFT", rarity: "Legendary", name: "Mock #2" }
    ],
    socketId: "test-socket-id-12345"
  };

  try {
    const response = await fetch("http://localhost:4000/seller/create-auction", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(payload)
    });

    const data = await response.json();
    console.log("Response status:", response.status);
    console.log("Response data:", JSON.stringify(data, null, 2));

    if (response.status === 201 && data.success) {
      console.log("SUCCESS: Complete Seller Agent Flow works end-to-end!");
    } else {
      console.error("FAILED: Seller Agent Flow returned error");
      process.exitCode = 1;
    }
  } catch (error) {
    console.error("Connection failed:", error.message || error);
    process.exitCode = 1;
  }
}

testFlow();
