import { Product } from "@shared/schema";
import { useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Switch } from "@/components/ui/switch";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import CompetitorForm from "./competitor-form";
import { Edit, TrendingUp, TrendingDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface PriceTableProps {
  products: Product[];
}

export default function PriceTable({ products }: PriceTableProps) {
  const autoPriceMutation = useMutation({
    mutationFn: async ({ id, autoPrice }: { id: number; autoPrice: boolean }) => {
      await apiRequest("PATCH", `/api/products/${id}`, { autoPrice });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/products"] });
    },
  });

  const getPriceChangeIcon = (current: number, suggested: number | null) => {
    if (!suggested) return null;
    return current > suggested ? (
      <TrendingDown className="h-4 w-4 text-red-500" />
    ) : (
      <TrendingUp className="h-4 w-4 text-green-500" />
    );
  };

  return (
    <div className="relative overflow-hidden rounded-lg border bg-card">
      <Table>
        <TableHeader>
          <TableRow className="bg-muted/50">
            <TableHead>Name</TableHead>
            <TableHead>Category</TableHead>
            <TableHead>Current Price</TableHead>
            <TableHead>Competitor Price</TableHead>
            <TableHead>Suggested Price</TableHead>
            <TableHead>Auto Price</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <AnimatePresence>
            {products.map((product) => (
              <motion.tr
                key={product.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.2 }}
                className="group hover:bg-muted/50"
              >
                <TableCell className="font-medium">{product.name}</TableCell>
                <TableCell>
                  <span className="inline-flex items-center rounded-full bg-primary/10 px-2 py-1 text-xs font-medium text-primary">
                    {product.category}
                  </span>
                </TableCell>
                <TableCell className="font-mono">
                  ${Number(product.currentPrice).toFixed(2)}
                </TableCell>
                <TableCell className="font-mono">
                  {product.competitorPrice
                    ? `$${Number(product.competitorPrice).toFixed(2)}`
                    : "N/A"}
                </TableCell>
                <TableCell className="font-mono">
                  <div className="flex items-center gap-2">
                    {product.suggestedPrice
                      ? `$${Number(product.suggestedPrice).toFixed(2)}`
                      : "N/A"}
                    {getPriceChangeIcon(
                      Number(product.currentPrice),
                      product.suggestedPrice ? Number(product.suggestedPrice) : null
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  <Switch
                    checked={product.autoPrice}
                    onCheckedChange={(checked) =>
                      autoPriceMutation.mutate({ id: product.id, autoPrice: checked })
                    }
                  />
                </TableCell>
                <TableCell>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                    </DialogTrigger>
                    <CompetitorForm productId={product.id} />
                  </Dialog>
                </TableCell>
              </motion.tr>
            ))}
          </AnimatePresence>
        </TableBody>
      </Table>
    </div>
  );
}