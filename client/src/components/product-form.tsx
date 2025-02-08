import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { InsertProduct, insertProductSchema } from "@shared/schema";
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

export default function ProductForm() {
  const { toast } = useToast();
  const form = useForm<InsertProduct>({
    resolver: zodResolver(insertProductSchema),
    defaultValues: {
      name: "",
      category: "",
      currentPrice: 0,
      competitorPrice: undefined,
      autoPrice: false,
    },
  });

  const mutation = useMutation({
    mutationFn: async (data: InsertProduct) => {
      await apiRequest("POST", "/api/products", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/products"] });
      toast({
        title: "Success",
        description: "Product created successfully",
        variant: "default",
      });
    },
  });

  const onSubmit = (data: InsertProduct) => {
    mutation.mutate(data);
  };

  return (
    <DialogContent className="sm:max-w-md">
      <DialogHeader>
        <DialogTitle>Add New Product</DialogTitle>
        <DialogDescription>
          Enter the product details to start tracking its pricing
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
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Product Name</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Enter product name" />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="category"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Category</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Enter product category" />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="currentPrice"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Current Price</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      step="0.01"
                      onChange={(e) => field.onChange(parseFloat(e.target.value))}
                      value={field.value}
                      className="font-mono"
                      placeholder="0.00"
                    />
                  </FormControl>
                  <FormDescription>Set your initial product price</FormDescription>
                </FormItem>
              )}
            />
            <div className="flex justify-end">
              <Button
                type="submit"
                disabled={mutation.isPending}
                className="min-w-[120px]"
              >
                {mutation.isPending ? "Creating..." : "Create Product"}
              </Button>
            </div>
          </form>
        </Form>
      </motion.div>
    </DialogContent>
  );
}