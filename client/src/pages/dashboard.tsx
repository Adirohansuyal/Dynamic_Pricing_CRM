import { useQuery } from "@tanstack/react-query";
import { Product } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { Plus } from "lucide-react";
import ProductForm from "@/components/product-form";
import PriceTable from "@/components/price-table";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { useEffect, useState } from "react";

const BackgroundElement = ({ mouseX, mouseY, offset = 0 }) => {
  const x = useTransform(mouseX, [0, window.innerWidth], [-15 - offset, 15 + offset]);
  const y = useTransform(mouseY, [0, window.innerHeight], [-15 - offset, 15 + offset]);

  return (
    <motion.div
      style={{ x, y }}
      className="pointer-events-none absolute inset-0"
    >
      <svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none">
        <defs>
          <linearGradient id={`grid-gradient-${offset}`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="rgba(99, 102, 241, 0.05)" />
            <stop offset="100%" stopColor="rgba(99, 102, 241, 0.02)" />
          </linearGradient>
        </defs>
        <pattern id={`grid-pattern-${offset}`} width="4" height="4" patternUnits="userSpaceOnUse">
          <path d="M 4 0 L 0 0 0 4" fill="none" stroke={`url(#grid-gradient-${offset})`} strokeWidth="0.5" />
        </pattern>
        <rect width="100%" height="100%" fill={`url(#grid-pattern-${offset})`} />
      </svg>
    </motion.div>
  );
};

const FloatingCard = ({ mouseX, mouseY, className, children }) => {
  const x = useSpring(useTransform(mouseX, [0, window.innerWidth], [-5, 5]));
  const y = useSpring(useTransform(mouseY, [0, window.innerHeight], [-5, 5]));

  return (
    <motion.div
      style={{ x, y }}
      className={className}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {children}
    </motion.div>
  );
};

export default function Dashboard() {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const handleMouseMove = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  const { data: products, isLoading } = useQuery<Product[]>({
    queryKey: ["/api/products"],
  });

  if (!mounted) return null;

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-b from-background to-muted/20">
      <BackgroundElement mouseX={mouseX} mouseY={mouseY} offset={0} />
      <BackgroundElement mouseX={mouseX} mouseY={mouseY} offset={10} />
      <BackgroundElement mouseX={mouseX} mouseY={mouseY} offset={20} />

      <FloatingCard
        mouseX={mouseX}
        mouseY={mouseY}
        className="p-8 relative z-10 min-h-screen"
      >
        <div className="container mx-auto max-w-7xl">
          <Card className="backdrop-blur-sm bg-background/80 border-none shadow-lg">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-7">
              <div>
                <CardTitle className="text-3xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                  Dynamic Pricing Dashboard
                </CardTitle>
                <p className="text-muted-foreground mt-1">
                  Manage your product prices and monitor competitors
                </p>
              </div>
              <Dialog>
                <DialogTrigger asChild>
                  <Button size="lg" className="shadow-md hover:shadow-lg transition-all">
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
                  <div className="h-8 bg-muted rounded animate-pulse" />
                  <div className="h-8 bg-muted rounded animate-pulse opacity-70" />
                  <div className="h-8 bg-muted rounded animate-pulse opacity-50" />
                </div>
              ) : (
                <PriceTable products={products || []} />
              )}
            </CardContent>
          </Card>
        </div>
      </FloatingCard>
    </div>
  );
}