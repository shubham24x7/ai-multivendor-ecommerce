"use client";

import Image from "next/image";
import Link from "next/link";
import { Heart, ShoppingCart, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { addToCart } from "@/features/cart/cart-slice";
import { toggleWishlist } from "@/features/wishlist/wishlist-slice";
import { useAppDispatch } from "@/store/hooks";
import type { Product } from "@/types/product";
import { formatCurrency } from "@/utils/formatters";

export function ProductCard({ product }: { product: Product }) {
  const dispatch = useAppDispatch();

  return (
    <Card className="overflow-hidden">
      <Link href={`/products/${product.slug}`} className="block">
        <div className="relative aspect-[4/3] bg-muted">
          <Image src={product.imageUrl} alt={product.title} fill className="object-cover" />
        </div>
      </Link>
      <CardContent className="space-y-4 p-4">
        <div className="flex items-start justify-between gap-3">
          <div>
            <Link href={`/products/${product.slug}`} className="font-semibold hover:underline">
              {product.title}
            </Link>
            <p className="mt-1 text-sm text-muted-foreground">{product.sellerName}</p>
          </div>
          <Badge variant="secondary">{product.location}</Badge>
        </div>
        <p className="line-clamp-2 text-sm text-muted-foreground">{product.aiSummary}</p>
        <div className="flex items-center justify-between">
          <div>
            <p className="font-semibold">{formatCurrency(product.price, product.currency)}</p>
            <p className="flex items-center gap-1 text-xs text-muted-foreground">
              <Star className="h-3.5 w-3.5 fill-primary text-primary" />
              {product.rating}
            </p>
          </div>
          <div className="flex gap-2">
            <Button
              aria-label="Add to wishlist"
              size="icon"
              variant="outline"
              onClick={() => dispatch(toggleWishlist(product))}
            >
              <Heart className="h-4 w-4" />
            </Button>
            <Button aria-label="Add to cart" size="icon" onClick={() => dispatch(addToCart(product))}>
              <ShoppingCart className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
