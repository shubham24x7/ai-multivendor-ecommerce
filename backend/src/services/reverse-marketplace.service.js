import { RequestOffer } from "../models/request-offer.model.js";
import { ReverseRequest } from "../models/reverse-request.model.js";
import { Seller } from "../models/seller.model.js";
import { AppError } from "../utils/app-error.js";
import { emitToRole, emitToUser } from "../sockets/index.js";

export async function createBuyerRequest(payload, buyerId) {
  const request = await ReverseRequest.create({ ...payload, buyerId });
  try {
    emitToRole("seller", "offer_request:created", request);
  } catch (_error) {}
  return request;
}

export async function listOpenRequests() {
  return ReverseRequest.find({ status: "open", expiresAt: { $gt: new Date() } }).sort({ createdAt: -1 });
}

export async function submitSellerOffer(payload, userId) {
  const seller = await Seller.findOne({ userId });
  if (!seller) throw new AppError("Seller profile not found", 404);

  const request = await ReverseRequest.findById(payload.requestId);
  if (!request || request.status !== "open") throw new AppError("Request is not open", 400);

  const offer = await RequestOffer.create({
    ...payload,
    sellerId: seller._id
  });

  try {
    emitToUser(request.buyerId.toString(), "offer:created", offer);
  } catch (_error) {}
  return offer;
}

export async function compareRequestOffers(requestId, buyerId) {
  const request = await ReverseRequest.findOne({ _id: requestId, buyerId });
  if (!request) throw new AppError("Request not found", 404);

  const offers = await RequestOffer.find({ requestId })
    .populate("sellerId", "businessName trustScore trustBadge ratingAverage")
    .populate("productId", "title images price currency");

  return offers.sort((a, b) => a.price - b.price);
}

export async function acceptRequestOffer(requestId, offerId, buyerId) {
  const request = await ReverseRequest.findOne({ _id: requestId, buyerId, status: "open" });
  if (!request) throw new AppError("Open request not found", 404);

  const offer = await RequestOffer.findOne({ _id: offerId, requestId });
  if (!offer) throw new AppError("Offer not found", 404);

  request.status = "accepted";
  request.acceptedOfferId = offer._id;
  offer.status = "accepted";

  await Promise.all([
    request.save(),
    offer.save(),
    RequestOffer.updateMany({ requestId, _id: { $ne: offer._id } }, { status: "rejected" })
  ]);

  try {
    emitToRole("seller", "offer:accepted", { requestId, offerId });
  } catch (_error) {}

  return { request, offer };
}
