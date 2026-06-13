import Link from "next/link";
import { HandCoins, PackageCheck, Sparkles, Users, WalletCards, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { StatCard } from "@/components/dashboard/stat-card";
import { orders } from "@/lib/mock-data";
import { formatCurrency } from "@/utils/formatters";

export default function BuyerDashboardPage() {
  return (
    <div className="grid gap-6">
      <div className="dashboard-grid">
        <StatCard label="Active orders" value="2" helper="Across global and local sellers" />
        <StatCard label="Wishlist items" value="8" helper="Saved for comparison" />
        <StatCard label="AI sessions" value="14" helper="Shopping copilot queries" />
        <StatCard label="Wallet spend" value="$225" helper="Current month estimate" />
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.25fr_0.75fr]">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <PackageCheck className="h-5 w-5 text-primary" />
              Recent orders
            </CardTitle>
          </CardHeader>
          <CardContent className="grid gap-3">
            {orders.map((order) => (
              <div
                key={order.id}
                className="flex flex-col justify-between gap-3 rounded-lg border p-4 sm:flex-row sm:items-center"
              >
                <div>
                  <p className="font-semibold">{order.id}</p>
                  <p className="text-sm text-muted-foreground">
                    {order.itemCount} items placed on {order.createdAt}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <Badge variant="secondary">{order.status}</Badge>
                  <span className="font-semibold">{formatCurrency(order.total, order.currency)}</span>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <div className="grid gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-primary" />
                AI copilot
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm leading-6 text-muted-foreground">
                Ask for budget-aware recommendations, compare saved products, or discover nearby
                sellers once backend AI services are connected.
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5 text-primary" />
                Group buys
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-sm text-muted-foreground">
                Join active buying groups and unlock quantity-based discounts.
              </p>
              <Button asChild variant="outline">
                <Link href="/group-buying">Browse groups</Link>
              </Button>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <HandCoins className="h-5 w-5 text-primary" />
                Negotiations
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-sm text-muted-foreground">
                Start offers and use AI-assisted price suggestions.
              </p>
              <Button asChild variant="outline">
                <Link href="/negotiations">Open negotiations</Link>
              </Button>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <WalletCards className="h-5 w-5 text-primary" />
                Payment readiness
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Stripe, Razorpay, and PayPal checkout slots are present for backend integration.
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Heart className="h-5 w-5 text-primary" />
                Saved intent
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Wishlist state is active through Redux and ready for API persistence.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
