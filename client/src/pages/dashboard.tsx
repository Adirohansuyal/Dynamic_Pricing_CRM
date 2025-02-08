import { useQuery } from "@tanstack/react-query";
import { Product } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { Plus } from "lucide-react";
import ProductForm from "@/components/product-form";
import PriceTable from "@/components/price-table";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";

export default function Dashboard() {
  const { data: products, isLoading } = useQuery<Product[]>({
    queryKey: ["/api/products"],
  });

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen bg-gradient-to-b from-background to-muted/20 p-8"
    >
      <div className="container mx-auto max-w-7xl">
        <Card className="border-none shadow-lg">
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
    </motion.div>
  );
}