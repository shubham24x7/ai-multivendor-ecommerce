import { useQuery } from "@tanstack/react-query";
import { getProductBySlug, getProducts } from "@/services/product-service";

export function useProducts() {
  return useQuery({
    queryKey: ["products"],
    queryFn: getProducts
  });
}

export function useProduct(slug: string) {
  return useQuery({
    queryKey: ["products", slug],
    queryFn: () => getProductBySlug(slug),
    enabled: Boolean(slug)
  });
}
