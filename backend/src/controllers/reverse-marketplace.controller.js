import {
  acceptRequestOffer,
  compareRequestOffers,
  createBuyerRequest,
  listOpenRequests,
  submitSellerOffer
} from "../services/reverse-marketplace.service.js";
import { sendSuccess } from "../utils/api-response.js";
import { asyncHandler } from "../utils/async-handler.js";

export const createRequest = asyncHandler(async (req, res) => {
  const request = await createBuyerRequest(req.body, req.user._id);
  sendSuccess(res, { statusCode: 201, message: "Buyer request created", data: { request } });
});

export const getOpenRequests = asyncHandler(async (_req, res) => {
  const requests = await listOpenRequests();
  sendSuccess(res, { message: "Open requests fetched", data: { requests } });
});

export const createOffer = asyncHandler(async (req, res) => {
  const offer = await submitSellerOffer(req.body, req.user._id);
  sendSuccess(res, { statusCode: 201, message: "Seller offer submitted", data: { offer } });
});

export const compareOffers = asyncHandler(async (req, res) => {
  const offers = await compareRequestOffers(req.params.id, req.user._id);
  sendSuccess(res, { message: "Offers compared", data: { offers } });
});

export const acceptOffer = asyncHandler(async (req, res) => {
  const result = await acceptRequestOffer(req.params.id, req.params.offerId, req.user._id);
  sendSuccess(res, { message: "Offer accepted", data: result });
});
