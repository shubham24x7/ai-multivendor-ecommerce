import { uploadImage } from "../services/upload.service.js";
import { sendSuccess } from "../utils/api-response.js";
import { asyncHandler } from "../utils/async-handler.js";

export const uploadSingleImage = asyncHandler(async (req, res) => {
  const folder = req.body.folder || "development/general";
  const image = await uploadImage(req.file, folder);
  sendSuccess(res, {
    statusCode: 201,
    message: "Image uploaded",
    data: { image }
  });
});
