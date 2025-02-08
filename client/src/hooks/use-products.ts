import { useQuery, useMutation } from "@tanstack/react-query";
import { Product } from "@shared/schema";
import { apiRequest, queryClient } from "@/lib/queryClient";

export function useProducts() {
  const { data: products = [], ...rest } = useQuery<Product[]>({
    queryKey: ["/api/products"],
    onSuccess: (products) => {
      // Persist to localStorage whenever we get new data
      localStorage.setItem('products', JSON.stringify(products));
    },
    initialData: () => {
      // Load initial data from localStorage if available
      const savedProducts = localStorage.getItem('products');
      return savedProducts ? JSON.parse(savedProducts) : [];
    },
  });

  return { products, ...rest };
}

export function useCreateProduct() {
  return useMutation({
    mutationFn: async (data: any) => {
      const res = await apiRequest("POST", "/api/products", data);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/products"] });
    },
  });
}

export function useUpdateProduct() {
  return useMutation({
    mutationFn: async ({ id, data }: { id: number; data: any }) => {
      const res = await apiRequest("PATCH", `/api/products/${id}`, data);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/products"] });
    },
  });
}
