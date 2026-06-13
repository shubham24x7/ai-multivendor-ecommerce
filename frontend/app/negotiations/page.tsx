"use client";

import { useState } from "react";
import { HandCoins, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { MainLayout } from "@/components/layout/main-layout";
import { getNegotiationSuggestion, startNegotiation } from "@/services/marketplace-service";

export default function NegotiationsPage() {
  const [productId, setProductId] = useState("");
  const [amount, setAmount] = useState("50");
  const [negotiationId, setNegotiationId] = useState("");
  const [status, setStatus] = useState("");

  async function createNegotiation() {
    setStatus("Starting negotiation...");
    try {
      const result = await startNegotiation({ productId, amount: Number(amount), message: "Buyer offer" });
      setNegotiationId(result.negotiation?._id);
      setStatus("Negotiation started.");
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "Negotiation failed");
    }
  }

  async function suggest() {
    setStatus("Generating AI price suggestion...");
    try {
      const result = await getNegotiationSuggestion(negotiationId);
      setStatus(`Suggested price: ${result.suggestedPrice}. ${result.reasoning}`);
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "Suggestion failed");
    }
  }

  return (
    <MainLayout>
      <section className="mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold tracking-tight">AI Negotiation</h1>
        <p className="mt-2 text-muted-foreground">
          Create buyer offers, receive seller counters, and generate AI-assisted price suggestions.
        </p>
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Start negotiation</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4">
            <Input placeholder="Product ObjectId" value={productId} onChange={(event) => setProductId(event.target.value)} />
            <Input type="number" placeholder="Offer amount" value={amount} onChange={(event) => setAmount(event.target.value)} />
            <div className="flex flex-col gap-3 sm:flex-row">
              <Button onClick={createNegotiation}>
                <HandCoins className="h-4 w-4" />
                Start
              </Button>
              <Button variant="outline" onClick={suggest} disabled={!negotiationId}>
                <Sparkles className="h-4 w-4" />
                AI suggestion
              </Button>
            </div>
            {status ? <p className="text-sm text-muted-foreground">{status}</p> : null}
          </CardContent>
        </Card>
      </section>
    </MainLayout>
  );
}
