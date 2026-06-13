"use client";

import { useState } from "react";
import { CreditCard, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { MainLayout } from "@/components/layout/main-layout";
import { useCart } from "@/hooks/use-cart";
import { createPaymentIntent, type PaymentProvider } from "@/services/payment-service";
import { formatCurrency } from "@/utils/formatters";

export default function CheckoutPage() {
  const { items, subtotal } = useCart();
  const [provider, setProvider] = useState<PaymentProvider>("stripe");
  const [paymentStatus, setPaymentStatus] = useState<string>("");

  async function handleCreateIntent() {
    setPaymentStatus("Creating payment intent...");
    try {
      const result = await createPaymentIntent({
        provider,
        amount: subtotal,
        currency: "USD"
      });
      setPaymentStatus(`Created ${provider} intent: ${result.transaction?._id ?? "ready"}`);
    } catch (error) {
      setPaymentStatus(error instanceof Error ? error.message : "Payment intent failed");
    }
  }

  return (
    <MainLayout>
      <section className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold tracking-tight">Checkout</h1>
        <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_360px]">
          <div className="grid gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="h-5 w-5 text-primary" />
                  Shipping address
                </CardTitle>
              </CardHeader>
              <CardContent className="grid gap-4 sm:grid-cols-2">
                <Input placeholder="Full name" />
                <Input placeholder="Phone number" />
                <Input className="sm:col-span-2" placeholder="Street address" />
                <Input placeholder="City" />
                <Input placeholder="Postal code" />
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="h-5 w-5 text-primary" />
                  Payment provider
                </CardTitle>
              </CardHeader>
              <CardContent className="grid gap-3 sm:grid-cols-3">
                {(["stripe", "razorpay", "paypal"] as PaymentProvider[]).map((item) => (
                  <Button
                    key={item}
                    variant={provider === item ? "default" : "outline"}
                    onClick={() => setProvider(item)}
                  >
                    {item[0].toUpperCase() + item.slice(1)}
                  </Button>
                ))}
              </CardContent>
            </Card>
          </div>

          <Card className="h-fit">
            <CardContent className="p-5">
              <p className="font-semibold">Checkout summary</p>
              <div className="mt-4 grid gap-3 text-sm">
                {items.map((item) => (
                  <div key={item.product.id} className="flex justify-between gap-4">
                    <span className="text-muted-foreground">
                      {item.product.title} x {item.quantity}
                    </span>
                    <span>{formatCurrency(item.product.price * item.quantity)}</span>
                  </div>
                ))}
              </div>
              <div className="mt-5 flex justify-between border-t pt-4 font-semibold">
                <span>Total</span>
                <span>{formatCurrency(subtotal)}</span>
              </div>
              <Button className="mt-6 w-full" disabled={items.length === 0} onClick={handleCreateIntent}>
                Create payment intent
              </Button>
              {paymentStatus ? <p className="mt-3 text-sm text-muted-foreground">{paymentStatus}</p> : null}
            </CardContent>
          </Card>
        </div>
      </section>
    </MainLayout>
  );
}
