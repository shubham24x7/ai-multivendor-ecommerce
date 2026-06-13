import {
  closeNegotiation,
  counterNegotiation,
  getNegotiationSuggestion,
  startNegotiation
} from "../services/negotiation.service.js";
import { sendSuccess } from "../utils/api-response.js";
import { asyncHandler } from "../utils/async-handler.js";

export const start = asyncHandler(async (req, res) => {
  const negotiation = await startNegotiation(req.body, req.user._id);
  sendSuccess(res, { statusCode: 201, message: "Negotiation started", data: { negotiation } });
});

export const counter = asyncHandler(async (req, res) => {
  const negotiation = await counterNegotiation(req.params.id, req.body, req.user);
  sendSuccess(res, { message: "Negotiation updated", data: { negotiation } });
});

export const suggest = asyncHandler(async (req, res) => {
  const result = await getNegotiationSuggestion(req.params.id);
  sendSuccess(res, { message: "AI price suggestion generated", data: result });
});

export const accept = asyncHandler(async (req, res) => {
  const negotiation = await closeNegotiation(req.params.id, "accepted", req.user);
  sendSuccess(res, { message: "Negotiation accepted", data: { negotiation } });
});

export const reject = asyncHandler(async (req, res) => {
  const negotiation = await closeNegotiation(req.params.id, "rejected", req.user);
  sendSuccess(res, { message: "Negotiation rejected", data: { negotiation } });
});
