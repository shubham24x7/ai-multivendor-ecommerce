import {
  closeExpiredGroupBuys,
  createGroupBuy,
  joinGroupBuy,
  listActiveGroupBuys
} from "../services/group-buy.service.js";
import { sendSuccess } from "../utils/api-response.js";
import { asyncHandler } from "../utils/async-handler.js";

export const createGroup = asyncHandler(async (req, res) => {
  const group = await createGroupBuy(req.body, req.user._id);
  sendSuccess(res, { statusCode: 201, message: "Group buy created", data: { group } });
});

export const getGroups = asyncHandler(async (_req, res) => {
  const groups = await listActiveGroupBuys();
  sendSuccess(res, { message: "Group buys fetched", data: { groups } });
});

export const joinGroup = asyncHandler(async (req, res) => {
  const group = await joinGroupBuy(req.params.id, req.user._id, req.body.quantity);
  sendSuccess(res, { message: "Joined group buy", data: { group } });
});

export const closeExpiredGroups = asyncHandler(async (_req, res) => {
  const closedCount = await closeExpiredGroupBuys();
  sendSuccess(res, { message: "Expired groups closed", data: { closedCount } });
});
