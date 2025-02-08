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
import { Edit } from "lucide-react";

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

  return (
    <Table>
      <TableHeader>
        <TableRow>
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
        {products.map((product) => (
          <TableRow key={product.id}>
            <TableCell>{product.name}</TableCell>
            <TableCell>{product.category}</TableCell>
            <TableCell>${product.currentPrice}</TableCell>
            <TableCell>
              ${product.competitorPrice || "N/A"}
            </TableCell>
            <TableCell>
              ${product.suggestedPrice || "N/A"}
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
                  <Button variant="outline" size="icon">
                    <Edit className="h-4 w-4" />
                  </Button>
                </DialogTrigger>
                <CompetitorForm productId={product.id} />
              </Dialog>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
