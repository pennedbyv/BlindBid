const meme1Image = new URL('../../meme1.jpeg', import.meta.url).href;
const meme2Image = new URL('../../meme2.jpeg', import.meta.url).href;
const meme3Image = new URL('../../meme3.jpeg', import.meta.url).href;

export const MOCK_STRATEGIST_INVENTORY = [
  {
    id: "cyberpunk-442",
    name: "BountyNFT",
    collection: "MONAD PRIMATES",
    rarity: "RARE",
    estimatedValue: 12.5,
    category: "Monad Primates",
    image: meme1Image
  },
  {
    id: "shard-genesis",
    name: "Shard of Genesis",
    collection: "VOID SHARDS",
    rarity: "LEGENDARY",
    estimatedValue: 45.0,
    category: "Void Shards",
    image: meme2Image
  },
  {
    id: "token-102",
    name: "Token #102",
    collection: "MONAD GENESIS",
    rarity: "COMMON",
    estimatedValue: 3.2,
    category: "Monad Genesis",
    image: meme3Image
  }
];
