import { Store } from "../models/store.model.js";
import { createSlug } from "../utils/slug.js";
import { getSellerByUserId } from "./seller.service.js";

export async function updateOwnStore(userId, payload) {
  const seller = await getSellerByUserId(userId);
  const update = {
    ...payload
  };

  if (payload.name) {
    update.slug = `${createSlug(payload.name)}-${seller._id.toString().slice(-6)}`;
  }

  return Store.findOneAndUpdate({ sellerId: seller._id }, update, {
    new: true,
    runValidators: true
  });
}
