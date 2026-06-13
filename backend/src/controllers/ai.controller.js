import { AiLog } from "../models/ai-log.model.js";
import {
  compareProducts,
  generateProductDescription,
  runShoppingCopilot,
  runSmartSearch,
  summarizeReviews
} from "../services/ai.service.js";
import { sendSuccess } from "../utils/api-response.js";
import { asyncHandler } from "../utils/async-handler.js";

export const productDescription = asyncHandler(async (req, res) => {
  const result = await generateProductDescription(req.body, req.user);
  sendSuccess(res, {
    message: "Product description generated",
    data: result
  });
});

export const shoppingCopilot = asyncHandler(async (req, res) => {
  const result = await runShoppingCopilot(req.body, req.user);
  sendSuccess(res, {
    message: "Shopping copilot response generated",
    data: result
  });
});

export const productComparison = asyncHandler(async (req, res) => {
  const result = await compareProducts(req.body, req.user);
  sendSuccess(res, {
    message: "Product comparison generated",
    data: result
  });
});

export const reviewSummarizer = asyncHandler(async (req, res) => {
  const result = await summarizeReviews(req.body, req.user);
  sendSuccess(res, {
    message: "Review summary generated",
    data: result
  });
});

export const smartSearch = asyncHandler(async (req, res) => {
  const result = await runSmartSearch(req.body, req.user);
  sendSuccess(res, {
    message: "Smart search completed",
    data: result
  });
});

export const aiUsageLogs = asyncHandler(async (_req, res) => {
  const logs = await AiLog.find().sort({ createdAt: -1 }).limit(100);
  sendSuccess(res, {
    message: "AI logs fetched",
    data: { logs }
  });
});
