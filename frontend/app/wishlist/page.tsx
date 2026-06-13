"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { MainLayout } from "@/components/layout/main-layout";
import { ProductGrid } from "@/components/products/product-grid";
import { useWishlist } from "@/hooks/use-wishlist";

export default function WishlistPage() {
  const wishlist = useWishlist();

  return (
    <MainLayout>
      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold tracking-tight">Wishlist</h1>
        <p className="mt-2 text-muted-foreground">Products saved for later comparison and checkout.</p>
        <div className="mt-8">
          {wishlist.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center">
                <p className="text-muted-foreground">No wishlist items yet.</p>
                <Button asChild className="mt-4">
                  <Link href="/products">Browse products</Link>
                </Button>
              </CardContent>
            </Card>
          ) : (
            <ProductGrid products={wishlist} />
          )}
        </div>
      </section>
    </MainLayout>
  );
}
