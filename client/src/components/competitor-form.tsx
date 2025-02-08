import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { UpdatePrice, updatePriceSchema } from "@shared/schema";
import { useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import {
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface CompetitorFormProps {
  productId: number;
}

export default function CompetitorForm({ productId }: CompetitorFormProps) {
  const { toast } = useToast();
  const form = useForm<UpdatePrice>({
    resolver: zodResolver(updatePriceSchema),
    defaultValues: {
      competitorPrice: 0,
    },
  });

  const mutation = useMutation({
    mutationFn: async (data: UpdatePrice) => {
      await apiRequest("POST", `/api/products/${productId}/competitor-price`, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/products"] });
      toast({
        title: "Success",
        description: "Competitor price updated successfully",
      });
    },
  });

  const onSubmit = (data: UpdatePrice) => {
    mutation.mutate(data);
  };

  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Update Competitor Price</DialogTitle>
      </DialogHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="competitorPrice"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Competitor Price</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    step="0.01"
                    onChange={(e) => field.onChange(parseFloat(e.target.value))}
                    value={field.value}
                  />
                </FormControl>
              </FormItem>
            )}
          />
          <Button type="submit" disabled={mutation.isPending}>
            Update Price
          </Button>
        </form>
      </Form>
    </DialogContent>
  );
}
