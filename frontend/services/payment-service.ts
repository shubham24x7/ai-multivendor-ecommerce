import { apiClient } from "@/lib/api-client";

export type PaymentProvider = "stripe" | "razorpay" | "paypal";

export async function createPaymentIntent(payload: {
  provider: PaymentProvider;
  orderId?: string;
  amount?: number;
  currency?: string;
}) {
  const response = await apiClient.post("/payments/intents", payload);
  return response.data.data;
}

export async function refundTransaction(transactionId: string, payload: { amount?: number; reason?: string }) {
  const response = await apiClient.post(`/payments/transactions/${transactionId}/refund`, payload);
  return response.data.data;
}
