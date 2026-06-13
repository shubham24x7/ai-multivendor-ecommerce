import { Transaction } from "../models/transaction.model.js";
import { sendSuccess } from "../utils/api-response.js";
import { asyncHandler } from "../utils/async-handler.js";

export const listTransactions = asyncHandler(async (_req, res) => {
  const transactions = await Transaction.find().sort({ createdAt: -1 }).limit(100);
  sendSuccess(res, { message: "Transactions fetched", data: { transactions } });
});
