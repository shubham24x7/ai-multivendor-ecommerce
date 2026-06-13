"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Bot, Globe2, MapPin, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { MainLayout } from "@/components/layout/main-layout";
import { ProductGrid } from "@/components/products/product-grid";
import { products } from "@/lib/mock-data";

const highlights = [
  {
    icon: Globe2,
    title: "Global commerce",
    text: "Multi-currency, multi-language marketplace foundations for international sellers."
  },
  {
    icon: MapPin,
    title: "Hyperlocal discovery",
    text: "Location-aware marketplace architecture for nearby products, services, and sellers."
  },
  {
    icon: Bot,
    title: "AI shopping flows",
    text: "Built for copilot search, product summaries, comparison, and seller content tools."
  },
  {
    icon: ShieldCheck,
    title: "Trusted sellers",
    text: "Admin approval, seller status, moderation, and trust workflows from day one."
  }
];

export default function HomePage() {
  return (
    <MainLayout>
      <section className="bg-secondary/45">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 py-16 sm:px-6 lg:grid-cols-[1.05fr_0.95fr] lg:px-8 lg:py-20">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45 }}
            className="flex flex-col justify-center"
          >
            <p className="text-sm font-semibold uppercase tracking-wide text-primary">
              AI powered marketplace foundation
            </p>
            <h1 className="mt-4 max-w-3xl text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
              Global products, local sellers, smarter buying.
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-7 text-muted-foreground sm:text-lg">
              A production-ready frontend foundation for buyer, seller, and admin journeys across
              marketplace discovery, carts, dashboards, AI commerce, and trusted operations.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Button asChild size="lg">
                <Link href="/products">
                  Explore products
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline">
                <Link href="/seller/dashboard">Seller dashboard</Link>
              </Button>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.12, duration: 0.45 }}
            className="grid gap-4 sm:grid-cols-2"
          >
            {highlights.map((item) => (
              <Card key={item.title}>
                <CardContent className="p-5">
                  <item.icon className="h-6 w-6 text-primary" />
                  <h2 className="mt-4 font-semibold">{item.title}</h2>
                  <p className="mt-2 text-sm leading-6 text-muted-foreground">{item.text}</p>
                </CardContent>
              </Card>
            ))}
          </motion.div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="mb-6 flex items-end justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">Featured products</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Seed data is shown until the backend product API is connected.
            </p>
          </div>
          <Button asChild variant="outline">
            <Link href="/products">View all</Link>
          </Button>
        </div>
        <ProductGrid products={products} />
      </section>
    </MainLayout>
  );
}
