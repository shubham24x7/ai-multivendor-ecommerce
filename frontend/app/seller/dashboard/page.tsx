import Link from "next/link";
import { BadgeCheck, Boxes, ClipboardList, ShieldCheck, Users, WandSparkles } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { StatCard } from "@/components/dashboard/stat-card";
import { products } from "@/lib/mock-data";
import { formatCurrency } from "@/utils/formatters";

export default function SellerDashboardPage() {
  return (
    <div className="grid gap-6">
      <Card className="border-primary/30 bg-primary/5">
        <CardContent className="flex flex-col justify-between gap-4 p-5 md:flex-row md:items-center">
          <div>
            <p className="flex items-center gap-2 font-semibold">
              <BadgeCheck className="h-5 w-5 text-primary" />
              Store approval status
            </p>
            <p className="mt-1 text-sm text-muted-foreground">
              Seller onboarding is ready for admin review and approval workflows.
            </p>
          </div>
          <Badge>Approved</Badge>
        </CardContent>
      </Card>

      <div className="dashboard-grid">
        <StatCard label="Products" value="24" helper="3 pending moderation" />
        <StatCard label="Orders" value="18" helper="5 awaiting fulfillment" />
        <StatCard label="Revenue" value="$4,820" helper="Current month estimate" />
        <StatCard label="Trust score" value="92" helper="Foundation metric" />
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.25fr_0.75fr]">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Boxes className="h-5 w-5 text-primary" />
              Product inventory
            </CardTitle>
          </CardHeader>
          <CardContent className="grid gap-3">
            {products.map((product) => (
              <div
                key={product.id}
                className="flex flex-col justify-between gap-3 rounded-lg border p-4 sm:flex-row sm:items-center"
              >
                <div>
                  <p className="font-semibold">{product.title}</p>
                  <p className="text-sm text-muted-foreground">
                    {formatCurrency(product.price, product.currency)} · {product.inventory} in stock
                  </p>
                </div>
                <Badge variant="secondary">Active</Badge>
              </div>
            ))}
          </CardContent>
        </Card>

        <div className="grid gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <WandSparkles className="h-5 w-5 text-primary" />
                AI description generator
              </CardTitle>
            </CardHeader>
            <CardContent className="grid gap-3">
              <Input placeholder="Product title" />
              <Input placeholder="Key attributes" />
              <Button>Generate draft</Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ClipboardList className="h-5 w-5 text-primary" />
                Fulfillment queue
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Seller order routing is ready for backend order and Socket.io events.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ShieldCheck className="h-5 w-5 text-primary" />
                Trust score
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-sm text-muted-foreground">
                Fulfillment, returns, reviews, and delivery metrics power seller badge levels.
              </p>
              <Button asChild variant="outline">
                <Link href="/analytics">View analytics</Link>
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5 text-primary" />
                Group sales
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-sm text-muted-foreground">
                Create group buys with dynamic discount tiers and auto-close logic.
              </p>
              <Button asChild variant="outline">
                <Link href="/group-buying">Manage groups</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
