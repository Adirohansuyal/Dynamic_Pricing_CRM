import { type Product, type InsertProduct, type UpdatePrice } from "@shared/schema";

export interface IStorage {
  getProducts(): Promise<Product[]>;
  getProduct(id: number): Promise<Product | undefined>;
  createProduct(product: InsertProduct): Promise<Product>;
  updateProduct(id: number, product: Partial<Product>): Promise<Product>;
  deleteProduct(id: number): Promise<void>;
  updateCompetitorPrice(id: number, update: UpdatePrice): Promise<Product>;
}

class MemStorage implements IStorage {
  private products: Product[] = [];
  private nextId = 1;

  constructor() {
    // Initialize with empty products array since we're in Node.js
    // Data persistence will happen through the frontend's localStorage
  }

  async getProducts(): Promise<Product[]> {
    return this.products;
  }

  async getProduct(id: number): Promise<Product | undefined> {
    return this.products.find(p => p.id === id);
  }

  async createProduct(insertProduct: InsertProduct): Promise<Product> {
    const suggestedPrice = insertProduct.competitorPrice 
      ? Number((insertProduct.competitorPrice * 0.95).toFixed(2))
      : null;

    const product: Product = {
      id: this.nextId++,
      ...insertProduct,
      currentPrice: insertProduct.currentPrice.toString(),
      competitorPrice: insertProduct.competitorPrice?.toString() || null,
      suggestedPrice: suggestedPrice?.toString() || null
    };

    this.products.push(product);
    return product;
  }

  async updateProduct(id: number, update: Partial<Product>): Promise<Product> {
    const index = this.products.findIndex(p => p.id === id);
    if (index === -1) throw new Error("Product not found");

    this.products[index] = { ...this.products[index], ...update };
    return this.products[index];
  }

  async deleteProduct(id: number): Promise<void> {
    const index = this.products.findIndex(p => p.id === id);
    if (index !== -1) {
      this.products.splice(index, 1);
    }
  }

  async updateCompetitorPrice(id: number, update: UpdatePrice): Promise<Product> {
    const product = await this.getProduct(id);
    if (!product) throw new Error("Product not found");

    const suggestedPrice = Number((update.competitorPrice * 0.95).toFixed(2));
    const currentPrice = product.autoPrice 
      ? suggestedPrice 
      : Number(product.currentPrice);

    const updatedProduct = await this.updateProduct(id, {
      competitorPrice: update.competitorPrice.toString(),
      suggestedPrice: suggestedPrice.toString(),
      currentPrice: currentPrice.toString()
    });

    return updatedProduct;
  }
}

export const storage = new MemStorage();