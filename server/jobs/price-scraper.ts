import { storage } from "../storage";
import { log } from "../vite";

interface ScrapedPrice {
  id: number;
  competitorPrice: number;
}

export async function scrapePrices(): Promise<void> {
  try {
    log("Starting price scraping job", "scraper");
    const products = await storage.getProducts();

    // For demonstration, we'll simulate scraping with random price variations
    const scrapedPrices: ScrapedPrice[] = products.map(product => ({
      id: product.id,
      competitorPrice: simulateCompetitorPrice(Number(product.currentPrice))
    }));

    // Update prices in storage
    for (const price of scrapedPrices) {
      await storage.updateCompetitorPrice(price.id, {
        competitorPrice: price.competitorPrice
      });
    }

    log(`Successfully updated prices for ${scrapedPrices.length} products`, "scraper");
  } catch (error) {
    if (error instanceof Error) {
      log(`Error in price scraping job: ${error.message}`, "scraper");
    }
    throw error;
  }
}

// Helper function to simulate competitor prices
function simulateCompetitorPrice(currentPrice: number): number {
  const variation = (Math.random() - 0.5) * 0.2; // +/- 10% variation
  return Number((currentPrice * (1 + variation)).toFixed(2));
}
