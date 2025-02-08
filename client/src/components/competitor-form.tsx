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
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormDescription,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

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
        variant: "default",
      });
    },
  });

  const onSubmit = (data: UpdatePrice) => {
    mutation.mutate(data);
  };

  return (
    <DialogContent className="sm:max-w-md">
      <DialogHeader>
        <DialogTitle>Update Competitor Price</DialogTitle>
        <DialogDescription>
          Enter the latest competitor price to update your pricing strategy
        </DialogDescription>
      </DialogHeader>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
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
                      className="font-mono"
                    />
                  </FormControl>
                  <FormDescription>
                    Enter the current price from your competitor
                  </FormDescription>
                </FormItem>
              )}
            />
            <div className="flex justify-end">
              <Button
                type="submit"
                disabled={mutation.isPending}
                className="min-w-[120px]"
              >
                {mutation.isPending ? "Updating..." : "Update Price"}
              </Button>
            </div>
          </form>
        </Form>
      </motion.div>
    </DialogContent>
  );
}