"use client";

import { SlidersHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { MainLayout } from "@/components/layout/main-layout";
import { ProductGrid } from "@/components/products/product-grid";
import { useProducts } from "@/features/products/product-queries";

export default function ProductsPage() {
  const { data: products = [], isLoading } = useProducts();

  return (
    <MainLayout>
      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-primary">Marketplace</p>
            <h1 className="mt-2 text-3xl font-bold tracking-tight">Products</h1>
            <p className="mt-2 max-w-2xl text-muted-foreground">
              Browse global and hyperlocal products from approved sellers.
            </p>
          </div>
          <Button variant="outline">
            <SlidersHorizontal className="h-4 w-4" />
            Filters
          </Button>
        </div>

        {isLoading ? (
          <div className="rounded-lg border p-8 text-center text-sm text-muted-foreground">
            Loading products...
          </div>
        ) : (
          <ProductGrid products={products} />
        )}
      </section>
    </MainLayout>
  );
}
