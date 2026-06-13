import crypto from "crypto";
import { env } from "../config/env.js";
import { Order } from "../models/order.model.js";
import { Transaction } from "../models/transaction.model.js";
import { AppError } from "../utils/app-error.js";
import { logger } from "../utils/logger.js";
import { emitToUser } from "../sockets/index.js";

function amountToMinor(amount) {
  return Math.round(Number(amount) * 100);
}

function basicAuth(id, secret) {
  return Buffer.from(`${id}:${secret}`).toString("base64");
}

async function resolvePaymentAmount({ orderId, amount, currency }) {
  if (orderId) {
    const order = await Order.findById(orderId);
    if (!order) throw new AppError("Order not found", 404);
    return {
      order,
      amount: order.grandTotal,
      currency: order.currency,
      buyerId: order.buyerId
    };
  }

  if (!amount || !currency) {
    throw new AppError("Either orderId or amount and currency are required", 400);
  }

  return { order: null, amount, currency, buyerId: null };
}

async function createStripeIntent(payload) {
  if (!env.payments.stripe.secretKey) throw new AppError("Stripe is not configured", 503);

  const response = await fetch("https://api.stripe.com/v1/payment_intents", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${env.payments.stripe.secretKey}`,
      "Content-Type": "application/x-www-form-urlencoded"
    },
    body: new URLSearchParams({
      amount: String(amountToMinor(payload.amount)),
      currency: payload.currency.toLowerCase(),
      automatic_payment_methods: JSON.stringify({ enabled: true }),
      metadata: JSON.stringify({ orderId: payload.orderId || "" })
    })
  });

  const data = await response.json();
  if (!response.ok) throw new AppError(data.error?.message || "Stripe payment intent failed", response.status);
  return { providerOrderId: data.id, clientSecret: data.client_secret, raw: data };
}

async function createRazorpayOrder(payload) {
  if (!env.payments.razorpay.keyId || !env.payments.razorpay.keySecret) {
    throw new AppError("Razorpay is not configured", 503);
  }

  const response = await fetch("https://api.razorpay.com/v1/orders", {
    method: "POST",
    headers: {
      Authorization: `Basic ${basicAuth(env.payments.razorpay.keyId, env.payments.razorpay.keySecret)}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      amount: amountToMinor(payload.amount),
      currency: payload.currency,
      receipt: payload.orderId || `receipt_${Date.now()}`
    })
  });

  const data = await response.json();
  if (!response.ok) throw new AppError(data.error?.description || "Razorpay order failed", response.status);
  return { providerOrderId: data.id, keyId: env.payments.razorpay.keyId, raw: data };
}

async function getPayPalAccessToken() {
  const { clientId, clientSecret, baseUrl } = env.payments.paypal;
  if (!clientId || !clientSecret) throw new AppError("PayPal is not configured", 503);

  const response = await fetch(`${baseUrl}/v1/oauth2/token`, {
    method: "POST",
    headers: {
      Authorization: `Basic ${basicAuth(clientId, clientSecret)}`,
      "Content-Type": "application/x-www-form-urlencoded"
    },
    body: "grant_type=client_credentials"
  });

  const data = await response.json();
  if (!response.ok) throw new AppError("PayPal authentication failed", response.status);
  return data.access_token;
}

async function createPayPalOrder(payload) {
  const accessToken = await getPayPalAccessToken();
  const response = await fetch(`${env.payments.paypal.baseUrl}/v2/checkout/orders`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      intent: "CAPTURE",
      purchase_units: [
        {
          reference_id: payload.orderId || `manual_${Date.now()}`,
          amount: {
            currency_code: payload.currency,
            value: Number(payload.amount).toFixed(2)
          }
        }
      ]
    })
  });

  const data = await response.json();
  if (!response.ok) throw new AppError(data.message || "PayPal order failed", response.status);
  return { providerOrderId: data.id, approvalUrl: data.links?.find((link) => link.rel === "approve")?.href, raw: data };
}

export async function createPaymentIntent(payload, user) {
  const provider = payload.provider;
  const resolved = await resolvePaymentAmount(payload);

  let providerResponse;
  if (provider === "stripe") providerResponse = await createStripeIntent({ ...resolved, orderId: payload.orderId });
  else if (provider === "razorpay") providerResponse = await createRazorpayOrder({ ...resolved, orderId: payload.orderId });
  else if (provider === "paypal") providerResponse = await createPayPalOrder({ ...resolved, orderId: payload.orderId });
  else throw new AppError("Unsupported payment provider", 400);

  const transaction = await Transaction.create({
    orderId: payload.orderId,
    buyerId: resolved.buyerId || user._id,
    type: "payment",
    provider,
    providerOrderId: providerResponse.providerOrderId,
    amount: resolved.amount,
    currency: resolved.currency,
    status: "pending",
    metadata: providerResponse
  });

  logger.info("Payment intent created", { provider, transactionId: transaction._id.toString() });
  return { transaction, providerResponse };
}

export async function refundTransaction(transactionId, payload) {
  const transaction = await Transaction.findById(transactionId);
  if (!transaction) throw new AppError("Transaction not found", 404);
  if (transaction.status !== "completed") throw new AppError("Only completed transactions can be refunded", 400);

  const refund = await Transaction.create({
    orderId: transaction.orderId,
    buyerId: transaction.buyerId,
    sellerId: transaction.sellerId,
    type: "refund",
    provider: transaction.provider,
    providerTransactionId: transaction.providerTransactionId,
    amount: payload.amount || transaction.amount,
    currency: transaction.currency,
    status: "pending",
    metadata: { reason: payload.reason }
  });

  logger.info("Refund record created", { transactionId, refundId: refund._id.toString() });
  return refund;
}

export async function verifyStripeWebhook(req) {
  const signature = req.headers["stripe-signature"];
  const secret = env.payments.stripe.webhookSecret;
  if (!signature || !secret) throw new AppError("Stripe webhook verification is not configured", 400);

  const timestamp = signature.split(",").find((part) => part.startsWith("t="))?.slice(2);
  const received = signature.split(",").find((part) => part.startsWith("v1="))?.slice(3);
  const payload = `${timestamp}.${req.body.toString("utf8")}`;
  const expected = crypto.createHmac("sha256", secret).update(payload).digest("hex");

  if (!received || expected.length !== received.length || !crypto.timingSafeEqual(Buffer.from(expected), Buffer.from(received))) {
    throw new AppError("Invalid Stripe webhook signature", 400);
  }

  return JSON.parse(req.body.toString("utf8"));
}

export async function verifyRazorpayWebhook(req) {
  const signature = req.headers["x-razorpay-signature"];
  const secret = env.payments.razorpay.webhookSecret;
  const expected = crypto.createHmac("sha256", secret).update(JSON.stringify(req.body)).digest("hex");
  if (signature !== expected) throw new AppError("Invalid Razorpay webhook signature", 400);
  return req.body;
}

export async function handlePaymentWebhook(provider, event) {
  const providerOrderId =
    provider === "stripe" ? event.data?.object?.id : provider === "razorpay" ? event.payload?.payment?.entity?.order_id : event.resource?.id;

  if (!providerOrderId) return null;

  const status = ["payment_intent.succeeded", "payment.captured", "CHECKOUT.ORDER.APPROVED"].includes(event.type || event.event)
    ? "completed"
    : "pending";

  const transaction = await Transaction.findOneAndUpdate(
    { provider, providerOrderId },
    { status, providerTransactionId: event.data?.object?.latest_charge || event.payload?.payment?.entity?.id || event.resource?.id },
    { new: true }
  );

  if (transaction?.buyerId) {
    try {
      emitToUser(transaction.buyerId.toString(), "payment:status_updated", transaction);
    } catch (_error) {}
  }

  return transaction;
}
