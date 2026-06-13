"use client";

import { useQuery } from "@tanstack/react-query";
import { Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MainLayout } from "@/components/layout/main-layout";
import { Countdown } from "@/components/marketplace/countdown";
import { getGroupBuys, joinGroupBuy } from "@/services/marketplace-service";
import { formatCurrency } from "@/utils/formatters";

export default function GroupBuyingPage() {
  const { data, refetch } = useQuery({
    queryKey: ["group-buys"],
    queryFn: getGroupBuys
  });

  const groups = data?.groups ?? [];

  async function join(id: string) {
    await joinGroupBuy(id, 1);
    refetch();
  }

  return (
    <MainLayout>
      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold tracking-tight">Group Buying</h1>
        <p className="mt-2 text-muted-foreground">
          Join active groups, unlock dynamic discounts, and track live countdowns.
        </p>
        <div className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {groups.length === 0 ? (
            <Card className="md:col-span-2 xl:col-span-3">
              <CardContent className="p-8 text-center text-sm text-muted-foreground">
                No active group buys yet.
              </CardContent>
            </Card>
          ) : (
            groups.map((group: any) => (
              <Card key={group._id}>
                <CardHeader>
                  <CardTitle>{group.title}</CardTitle>
                </CardHeader>
                <CardContent className="grid gap-4">
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-bold">{formatCurrency(group.currentPrice, group.currency)}</span>
                    <Badge>{group.status}</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {group.currentQuantity}/{group.targetQuantity} joined
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Ends in <Countdown endsAt={group.endsAt} />
                  </p>
                  <Button onClick={() => join(group._id)}>
                    <Users className="h-4 w-4" />
                    Join group
                  </Button>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </section>
    </MainLayout>
  );
}
