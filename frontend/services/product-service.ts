import { apiClient } from "@/lib/api-client";
import { products } from "@/lib/mock-data";
import type { Product } from "@/types/product";

export async function getProducts(): Promise<Product[]> {
  try {
    const response = await apiClient.get("/products");
    return response.data.data ?? response.data;
  } catch {
    return products;
  }
}

export async function getProductBySlug(slug: string): Promise<Product | undefined> {
  try {
    const response = await apiClient.get(`/products/${slug}`);
    return response.data.data ?? response.data;
  } catch {
    return products.find((product) => product.slug === slug);
  }
}
