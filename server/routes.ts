import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertProductSchema, updatePriceSchema } from "@shared/schema";

export function registerRoutes(app: Express): Server {
  // Products CRUD
  app.get("/api/products", async (_req, res) => {
    const products = await storage.getProducts();
    res.json(products);
  });

  app.post("/api/products", async (req, res) => {
    const result = insertProductSchema.safeParse(req.body);
    if (!result.success) {
      return res.status(400).json({ error: result.error });
    }
    const product = await storage.createProduct(result.data);
    res.json(product);
  });

  app.patch("/api/products/:id", async (req, res) => {
    const id = parseInt(req.params.id);
    const product = await storage.updateProduct(id, req.body);
    res.json(product);
  });

  app.delete("/api/products/:id", async (req, res) => {
    const id = parseInt(req.params.id);
    await storage.deleteProduct(id);
    res.status(204).send();
  });

  // Update competitor price
  app.post("/api/products/:id/competitor-price", async (req, res) => {
    const result = updatePriceSchema.safeParse(req.body);
    if (!result.success) {
      return res.status(400).json({ error: result.error });
    }
    const id = parseInt(req.params.id);
    const product = await storage.updateCompetitorPrice(id, result.data);
    res.json(product);
  });

  const httpServer = createServer(app);
  return httpServer;
}
