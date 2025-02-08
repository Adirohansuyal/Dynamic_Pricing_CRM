import { products, type Product, type InsertProduct, type UpdatePrice } from "@shared/schema";
import { db } from "./db";
import { eq } from "drizzle-orm";

export interface IStorage {
  getProducts(): Promise<Product[]>;
  getProduct(id: number): Promise<Product | undefined>;
  createProduct(product: InsertProduct): Promise<Product>;
  updateProduct(id: number, product: Partial<Product>): Promise<Product>;
  deleteProduct(id: number): Promise<void>;
  updateCompetitorPrice(id: number, update: UpdatePrice): Promise<Product>;
}

export class DatabaseStorage implements IStorage {
  async getProducts(): Promise<Product[]> {
    return await db.select().from(products);
  }

  async getProduct(id: number): Promise<Product | undefined> {
    const [product] = await db.select().from(products).where(eq(products.id, id));
    return product;
  }

  async createProduct(insertProduct: InsertProduct): Promise<Product> {
    const suggestedPrice = insertProduct.competitorPrice 
      ? Number((insertProduct.competitorPrice * 0.95).toFixed(2))
      : null;

    const [product] = await db
      .insert(products)
      .values({
        ...insertProduct,
        suggestedPrice: suggestedPrice?.toString()
      })
      .returning();
    return product;
  }

  async updateProduct(id: number, update: Partial<Product>): Promise<Product> {
    const [product] = await db
      .update(products)
      .set(update)
      .where(eq(products.id, id))
      .returning();

    if (!product) throw new Error("Product not found");
    return product;
  }

  async deleteProduct(id: number): Promise<void> {
    await db.delete(products).where(eq(products.id, id));
  }

  async updateCompetitorPrice(id: number, update: UpdatePrice): Promise<Product> {
    const [existingProduct] = await db
      .select()
      .from(products)
      .where(eq(products.id, id));

    if (!existingProduct) throw new Error("Product not found");

    const suggestedPrice = Number((update.competitorPrice * 0.95).toFixed(2));
    const currentPrice = existingProduct.autoPrice 
      ? suggestedPrice 
      : Number(existingProduct.currentPrice);

    const [product] = await db
      .update(products)
      .set({
        competitorPrice: update.competitorPrice.toString(),
        suggestedPrice: suggestedPrice.toString(),
        currentPrice: currentPrice.toString()
      })
      .where(eq(products.id, id))
      .returning();

    return product;
  }
}

export const storage = new DatabaseStorage();