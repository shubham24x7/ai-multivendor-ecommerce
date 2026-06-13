"use client";

import { useState } from "react";
import { Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { MainLayout } from "@/components/layout/main-layout";
import { createReverseRequest } from "@/services/marketplace-service";

export default function ReverseMarketplacePage() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [budgetMax, setBudgetMax] = useState("100");
  const [status, setStatus] = useState("");

  async function submitRequest() {
    setStatus("Submitting request...");
    try {
      await createReverseRequest({
        title,
        description,
        budgetMax: Number(budgetMax),
        currency: "USD",
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()
      });
      setStatus("Request submitted. Sellers can now send offers.");
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "Request failed");
    }
  }

  return (
    <MainLayout>
      <section className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold tracking-tight">Reverse Marketplace</h1>
        <p className="mt-2 text-muted-foreground">
          Buyers post what they need. Sellers compete with tailored offers.
        </p>
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Create buyer request</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4">
            <Input placeholder="What do you need?" value={title} onChange={(event) => setTitle(event.target.value)} />
            <Input
              placeholder="Describe quality, quantity, delivery, and location"
              value={description}
              onChange={(event) => setDescription(event.target.value)}
            />
            <Input
              type="number"
              placeholder="Maximum budget"
              value={budgetMax}
              onChange={(event) => setBudgetMax(event.target.value)}
            />
            <Button onClick={submitRequest}>
              <Send className="h-4 w-4" />
              Submit request
            </Button>
            {status ? <p className="text-sm text-muted-foreground">{status}</p> : null}
          </CardContent>
        </Card>
      </section>
    </MainLayout>
  );
}
