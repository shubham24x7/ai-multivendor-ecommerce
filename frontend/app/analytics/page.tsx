"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { MainLayout } from "@/components/layout/main-layout";
import { MetricChart } from "@/components/analytics/metric-chart";
import { getAnalytics } from "@/services/marketplace-service";

type Scope = "buyer" | "seller" | "admin";

export default function AnalyticsPage() {
  const [scope, setScope] = useState<Scope>("buyer");
  const { data } = useQuery({
    queryKey: ["analytics", scope],
    queryFn: () => getAnalytics(scope)
  });

  const chartData = Object.entries(data || {})
    .filter(([, value]) => typeof value === "number")
    .map(([label, value]) => ({ label, value: Number(value) }));

  return (
    <MainLayout>
      <section className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Analytics</h1>
            <p className="mt-2 text-muted-foreground">
              Buyer, seller, and admin analytics widgets backed by API aggregation endpoints.
            </p>
          </div>
          <div className="flex gap-2">
            {(["buyer", "seller", "admin"] as Scope[]).map((item) => (
              <Button key={item} variant={scope === item ? "default" : "outline"} onClick={() => setScope(item)}>
                {item}
              </Button>
            ))}
          </div>
        </div>
        <div className="mt-8">
          <MetricChart title={`${scope} metrics`} data={chartData.length ? chartData : [{ label: "No data", value: 0 }]} />
        </div>
      </section>
    </MainLayout>
  );
}
