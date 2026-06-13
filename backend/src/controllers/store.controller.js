import { updateOwnStore } from "../services/store.service.js";
import { sendSuccess } from "../utils/api-response.js";
import { asyncHandler } from "../utils/async-handler.js";

export const updateMyStore = asyncHandler(async (req, res) => {
  const store = await updateOwnStore(req.user._id, req.body);
  sendSuccess(res, { message: "Store updated", data: { store } });
});
