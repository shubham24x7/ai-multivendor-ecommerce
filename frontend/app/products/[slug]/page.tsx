"use client";

import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { Heart, ShoppingCart, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { MainLayout } from "@/components/layout/main-layout";
import { addToCart } from "@/features/cart/cart-slice";
import { useProduct } from "@/features/products/product-queries";
import { toggleWishlist } from "@/features/wishlist/wishlist-slice";
import { useAppDispatch } from "@/store/hooks";
import { formatCurrency } from "@/utils/formatters";

export default function ProductDetailsPage() {
  const params = useParams<{ slug: string }>();
  const dispatch = useAppDispatch();
  const { data: product, isLoading } = useProduct(params.slug);

  if (isLoading) {
    return (
      <MainLayout>
        <div className="mx-auto max-w-7xl px-4 py-12 text-sm text-muted-foreground">
          Loading product...
        </div>
      </MainLayout>
    );
  }

  if (!product) {
    return (
      <MainLayout>
        <div className="mx-auto max-w-7xl px-4 py-12">
          <h1 className="text-2xl font-bold">Product not found</h1>
          <Button asChild className="mt-5">
            <Link href="/products">Back to products</Link>
          </Button>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <section className="mx-auto grid max-w-7xl gap-10 px-4 py-10 sm:px-6 lg:grid-cols-2 lg:px-8">
        <div className="relative aspect-square overflow-hidden rounded-lg border bg-muted">
          <Image src={product.imageUrl} alt={product.title} fill className="object-cover" priority />
        </div>

        <div>
          <div className="flex flex-wrap gap-2">
            <Badge>{product.category}</Badge>
            <Badge variant="secondary">{product.location}</Badge>
          </div>
          <h1 className="mt-4 text-3xl font-bold tracking-tight">{product.title}</h1>
          <p className="mt-3 flex items-center gap-2 text-sm text-muted-foreground">
            <Star className="h-4 w-4 fill-primary text-primary" />
            {product.rating} rating by {product.sellerName}
          </p>
          <p className="mt-6 text-3xl font-bold">{formatCurrency(product.price, product.currency)}</p>
          <p className="mt-5 leading-7 text-muted-foreground">{product.description}</p>

          <Card className="mt-6">
            <CardContent className="p-5">
              <p className="text-sm font-semibold">AI shopping summary</p>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">{product.aiSummary}</p>
            </CardContent>
          </Card>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Button size="lg" onClick={() => dispatch(addToCart(product))}>
              <ShoppingCart className="h-4 w-4" />
              Add to cart
            </Button>
            <Button size="lg" variant="outline" onClick={() => dispatch(toggleWishlist(product))}>
              <Heart className="h-4 w-4" />
              Save to wishlist
            </Button>
          </div>
        </div>
      </section>
    </MainLayout>
  );
}
