"use client";

import Link from "next/link";
import { Minus, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { MainLayout } from "@/components/layout/main-layout";
import { removeFromCart, updateQuantity } from "@/features/cart/cart-slice";
import { useCart } from "@/hooks/use-cart";
import { useAppDispatch } from "@/store/hooks";
import { formatCurrency } from "@/utils/formatters";

export default function CartPage() {
  const { items, subtotal } = useCart();
  const dispatch = useAppDispatch();

  return (
    <MainLayout>
      <section className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold tracking-tight">Cart</h1>
        <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_320px]">
          <div className="grid gap-4">
            {items.length === 0 ? (
              <Card>
                <CardContent className="p-8 text-center">
                  <p className="text-muted-foreground">Your cart is empty.</p>
                  <Button asChild className="mt-4">
                    <Link href="/products">Start shopping</Link>
                  </Button>
                </CardContent>
              </Card>
            ) : (
              items.map((item) => (
                <Card key={item.product.id}>
                  <CardContent className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <p className="font-semibold">{item.product.title}</p>
                      <p className="text-sm text-muted-foreground">
                        {formatCurrency(item.product.price, item.product.currency)}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        size="icon"
                        variant="outline"
                        onClick={() =>
                          dispatch(
                            updateQuantity({
                              productId: item.product.id,
                              quantity: item.quantity - 1
                            })
                          )
                        }
                      >
                        <Minus className="h-4 w-4" />
                      </Button>
                      <span className="w-8 text-center text-sm font-semibold">{item.quantity}</span>
                      <Button
                        size="icon"
                        variant="outline"
                        onClick={() =>
                          dispatch(
                            updateQuantity({
                              productId: item.product.id,
                              quantity: item.quantity + 1
                            })
                          )
                        }
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => dispatch(removeFromCart(item.product.id))}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>

          <Card className="h-fit">
            <CardContent className="p-5">
              <p className="font-semibold">Order summary</p>
              <div className="mt-4 flex justify-between text-sm">
                <span className="text-muted-foreground">Subtotal</span>
                <span>{formatCurrency(subtotal)}</span>
              </div>
              <Button asChild className="mt-6 w-full" disabled={items.length === 0}>
                <Link href="/checkout">Checkout</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </section>
    </MainLayout>
  );
}
