import { Product } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { Plus } from "lucide-react";
import ProductForm from "@/components/product-form";
import PriceTable from "@/components/price-table";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import CustomCursor from "@/components/custom-cursor";
import PriceHistoryChart from "@/components/price-history-chart";
import { useProducts } from "@/hooks/use-products";

const BackgroundGrid = () => (
  <div className="absolute inset-0 -z-10">
    <svg width="100%" height="100%" className="absolute opacity-5">
      <defs>
        <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
          <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeWidth="0.5" />
        </pattern>
        <linearGradient id="fade" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="rgba(99, 102, 241, 0.2)" />
          <stop offset="100%" stopColor="rgba(99, 102, 241, 0)" />
        </linearGradient>
      </defs>
      <rect width="100%" height="100%" fill="url(#grid)" />
      <rect width="100%" height="100%" fill="url(#fade)" />
    </svg>
  </div>
);

const CircuitLines = () => (
  <div className="absolute inset-0 -z-10 overflow-hidden">
    <svg width="100%" height="100%" className="absolute opacity-10">
      <defs>
        <path id="circuit" d="M 0,20 L 40,20 L 40,80 L 100,80" stroke="currentColor" fill="none" />
      </defs>
      <g className="animate-pulse">
        {Array.from({ length: 10 }).map((_, i) => (
          <use
            key={i}
            href="#circuit"
            x={i * 200}
            y={i * 100}
            className="text-primary"
            strokeWidth="0.5"
          />
        ))}
      </g>
    </svg>
  </div>
);

const Footer = () => (
  <footer className="mt-8 text-center text-sm text-muted-foreground pb-4">
    All Rights Reserved © AdiAi Technologies
  </footer>
);

export default function Dashboard() {
  const [mounted, setMounted] = useState(false);
  const { products, isLoading } = useProducts();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#0A0A0B]">
      <CustomCursor />
      <BackgroundGrid />
      <CircuitLines />

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
        className="relative z-10 min-h-screen p-8"
      >
        <div className="container mx-auto max-w-7xl">
          <Card className="border-none bg-black/40 backdrop-blur-xl shadow-2xl shadow-primary/10">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-7">
              <div>
                <CardTitle className="text-4xl font-bold">
                  <span className="bg-gradient-to-r from-primary via-primary/80 to-primary/60 bg-clip-text text-transparent">
                    Dynamic Pricing Dashboard by AdiAi Technologies
                  </span>
                </CardTitle>
                <p className="text-muted-foreground mt-2">
                  Manage your product prices and monitor competitors
                </p>
              </div>
              <Dialog>
                <DialogTrigger asChild>
                  <Button
                    size="lg"
                    className="bg-primary hover:bg-primary/90 shadow-lg shadow-primary/20 transition-all duration-300"
                  >
                    <Plus className="w-5 h-5 mr-2" />
                    Add Product
                  </Button>
                </DialogTrigger>
                <ProductForm />
              </Dialog>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="space-y-3">
                  <div className="h-8 bg-primary/5 rounded animate-pulse" />
                  <div className="h-8 bg-primary/5 rounded animate-pulse opacity-70" />
                  <div className="h-8 bg-primary/5 rounded animate-pulse opacity-50" />
                </div>
              ) : (
                <>
                  <PriceTable products={products || []} />
                  <PriceHistoryChart products={products || []} />
                </>
              )}
            </CardContent>
          </Card>
          <Footer />
        </div>
      </motion.div>
    </div>
  );
}