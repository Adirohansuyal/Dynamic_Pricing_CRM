import { products, type Product, type InsertProduct, type UpdatePrice } from "@shared/schema";

export interface IStorage {
  getProducts(): Promise<Product[]>;
  getProduct(id: number): Promise<Product | undefined>;
  createProduct(product: InsertProduct): Promise<Product>;
  updateProduct(id: number, product: Partial<Product>): Promise<Product>;
  deleteProduct(id: number): Promise<void>;
  updateCompetitorPrice(id: number, update: UpdatePrice): Promise<Product>;
}

export class MemStorage implements IStorage {
  private products: Map<number, Product>;
  private currentId: number;

  constructor() {
    this.products = new Map();
    this.currentId = 1;
  }

  async getProducts(): Promise<Product[]> {
    return Array.from(this.products.values());
  }

  async getProduct(id: number): Promise<Product | undefined> {
    return this.products.get(id);
  }

  async createProduct(insertProduct: InsertProduct): Promise<Product> {
    const id = this.currentId++;
    const product: Product = {
      ...insertProduct,
      id,
      suggestedPrice: insertProduct.competitorPrice 
        ? Number((insertProduct.competitorPrice * 0.95).toFixed(2))
        : null
    };
    this.products.set(id, product);
    return product;
  }

  async updateProduct(id: number, update: Partial<Product>): Promise<Product> {
    const product = await this.getProduct(id);
    if (!product) throw new Error("Product not found");

    const updatedProduct = { ...product, ...update };
    this.products.set(id, updatedProduct);
    return updatedProduct;
  }

  async deleteProduct(id: number): Promise<void> {
    this.products.delete(id);
  }

  async updateCompetitorPrice(id: number, update: UpdatePrice): Promise<Product> {
    const product = await this.getProduct(id);
    if (!product) throw new Error("Product not found");

    const suggestedPrice = Number((update.competitorPrice * 0.95).toFixed(2));
    const updatedPrice = product.autoPrice ? suggestedPrice : product.currentPrice;

    const updatedProduct = {
      ...product,
      competitorPrice: update.competitorPrice,
      suggestedPrice,
      currentPrice: updatedPrice
    };

    this.products.set(id, updatedProduct);
    return updatedProduct;
  }
}

export const storage = new MemStorage();
