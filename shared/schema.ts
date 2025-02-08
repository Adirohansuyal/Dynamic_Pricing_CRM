import { pgTable, text, serial, integer, boolean, numeric } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const products = pgTable("products", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  currentPrice: numeric("current_price").notNull(),
  competitorPrice: numeric("competitor_price"),
  category: text("category").notNull(),
  autoPrice: boolean("auto_price").notNull().default(false),
  suggestedPrice: numeric("suggested_price")
});

export const insertProductSchema = createInsertSchema(products)
  .omit({ id: true, suggestedPrice: true })
  .extend({
    currentPrice: z.number().positive(),
    competitorPrice: z.number().positive().optional(),
  });

export type InsertProduct = z.infer<typeof insertProductSchema>;
export type Product = typeof products.$inferSelect;

export const updatePriceSchema = z.object({
  competitorPrice: z.number().positive(),
});

export type UpdatePrice = z.infer<typeof updatePriceSchema>;
