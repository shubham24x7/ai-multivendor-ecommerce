import {
  createPaymentIntent,
  handlePaymentWebhook,
  refundTransaction,
  verifyRazorpayWebhook,
  verifyStripeWebhook
} from "../services/payment.service.js";
import { sendSuccess } from "../utils/api-response.js";
import { asyncHandler } from "../utils/async-handler.js";

export const createIntent = asyncHandler(async (req, res) => {
  const result = await createPaymentIntent(req.body, req.user);
  sendSuccess(res, { statusCode: 201, message: "Payment intent created", data: result });
});

export const refund = asyncHandler(async (req, res) => {
  const result = await refundTransaction(req.params.id, req.body);
  sendSuccess(res, { statusCode: 201, message: "Refund created", data: { refund: result } });
});

export const stripeWebhook = asyncHandler(async (req, res) => {
  const event = await verifyStripeWebhook(req);
  const transaction = await handlePaymentWebhook("stripe", event);
  sendSuccess(res, { message: "Stripe webhook processed", data: { transaction } });
});

export const razorpayWebhook = asyncHandler(async (req, res) => {
  const event = await verifyRazorpayWebhook(req);
  const transaction = await handlePaymentWebhook("razorpay", event);
  sendSuccess(res, { message: "Razorpay webhook processed", data: { transaction } });
});

export const paypalWebhook = asyncHandler(async (req, res) => {
  const transaction = await handlePaymentWebhook("paypal", req.body);
  sendSuccess(res, { message: "PayPal webhook processed", data: { transaction } });
});
