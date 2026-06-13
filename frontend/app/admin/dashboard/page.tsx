import { AlertTriangle, Bot, ShieldCheck, Store, Users } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StatCard } from "@/components/dashboard/stat-card";

const moderationItems = [
  { label: "Seller approval", owner: "Urban Loom", status: "pending" },
  { label: "Product review", owner: "Smart Home Starter Kit", status: "pending" },
  { label: "AI content review", owner: "Ceramic Dinner Set", status: "flagged" }
];

export default function AdminDashboardPage() {
  return (
    <div className="grid gap-6">
      <div className="dashboard-grid">
        <StatCard label="Users" value="12,480" helper="Buyer, seller, admin accounts" />
        <StatCard label="Sellers" value="842" helper="38 pending approval" />
        <StatCard label="Products" value="16,210" helper="112 awaiting moderation" />
        <StatCard label="AI usage" value="4,920" helper="Monthly generation events" />
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ShieldCheck className="h-5 w-5 text-primary" />
              Moderation queue
            </CardTitle>
          </CardHeader>
          <CardContent className="grid gap-3">
            {moderationItems.map((item) => (
              <div
                key={`${item.label}-${item.owner}`}
                className="flex flex-col justify-between gap-3 rounded-lg border p-4 sm:flex-row sm:items-center"
              >
                <div>
                  <p className="font-semibold">{item.label}</p>
                  <p className="text-sm text-muted-foreground">{item.owner}</p>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant={item.status === "flagged" ? "outline" : "secondary"}>
                    {item.status}
                  </Badge>
                  <Button size="sm">Review</Button>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <div className="grid gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5 text-primary" />
                User operations
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Account status, role review, and suspension flows are reserved for backend RBAC.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Store className="h-5 w-5 text-primary" />
                Seller governance
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Seller approval, rejection, store moderation, and audit trails have dedicated UI space.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bot className="h-5 w-5 text-primary" />
                AI monitoring
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-sm text-muted-foreground">
                Track provider usage, failed requests, prompt versions, and content safety results.
              </p>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <AlertTriangle className="h-4 w-4 text-primary" />
                3 flagged generations require review.
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
