export interface MarketIntelligence {
  demand: "High" | "Moderate" | "Low";
  competition: "Intense" | "Moderate" | "Low";
  liquidity: "High" | "Medium" | "Dry";
  estimatedTrend: "Bullish" | "Bearish" | "Stable";
  priceVolatility: "High" | "Medium" | "Low";
  floorPrice: string; // in MON (e.g. "0.25 MON")
  volume24h: string; // in MON (e.g. "12,400 MON")
  recentSalesAvg: string; // in MON (e.g. "0.27 MON")
}

/**
 * Service generating deterministic and highly realistic mock market context
 * for use by the AI Auction Strategist.
 */
export class MarketContextService {
  /**
   * Generates mock market intelligence based on collection details and bundle composition
   */
  public getMarketContext(collectionName: string, bundleSize: number): MarketIntelligence {
    const cleanName = (collectionName || "Mystery Collection").toLowerCase().trim();
    
    // Deterministic seed based on string length & code points
    const nameSeed = cleanName.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0);

    // 1. Establish baseline valuations (per NFT floor price)
    let floorBase = 0.15; // default floor in MON
    if (cleanName.includes("mojo")) floorBase = 0.28;
    else if (cleanName.includes("dragon")) floorBase = 1.25;
    else if (cleanName.includes("badge")) floorBase = 0.05;
    else if (cleanName.includes("mav")) floorBase = 0.45;
    
    // Add minor variation based on seed
    const variation = ((nameSeed % 10) - 5) / 100; // -0.05 to +0.04
    const floorPriceNum = Math.max(0.01, floorBase + variation);
    
    // Calculate volume
    const volumeNum = Math.round((floorPriceNum * 12000) + (nameSeed % 500));
    
    // Calculate average sales
    const recentAvgNum = floorPriceNum * (1 + ((nameSeed % 8) - 2) / 100); // floor price +- small margin

    // 2. Determine qualitative metrics
    const demandVal = nameSeed % 3;
    const demand: "High" | "Moderate" | "Low" = 
      demandVal === 0 ? "High" : demandVal === 1 ? "Moderate" : "Low";

    const competitionVal = (nameSeed + bundleSize) % 3;
    const competition: "Intense" | "Moderate" | "Low" = 
      competitionVal === 0 ? "Intense" : competitionVal === 1 ? "Moderate" : "Low";

    const liquidityVal = (nameSeed * bundleSize) % 3;
    const liquidity: "High" | "Medium" | "Dry" = 
      liquidityVal === 0 ? "High" : liquidityVal === 1 ? "Medium" : "Dry";

    const trendVal = (nameSeed + 5) % 3;
    const estimatedTrend: "Bullish" | "Bearish" | "Stable" = 
      trendVal === 0 ? "Bullish" : trendVal === 1 ? "Bearish" : "Stable";

    const volatilityVal = (nameSeed * 7) % 3;
    const priceVolatility: "High" | "Medium" | "Low" = 
      volatilityVal === 0 ? "High" : volatilityVal === 1 ? "Medium" : "Low";

    return {
      demand,
      competition,
      liquidity,
      estimatedTrend,
      priceVolatility,
      floorPrice: `${floorPriceNum.toFixed(3)} MON`,
      volume24h: `${volumeNum.toLocaleString()} MON`,
      recentSalesAvg: `${recentAvgNum.toFixed(3)} MON`
    };
  }
}
