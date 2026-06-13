import { cloudinary } from "../config/cloudinary.js";
import { AppError } from "../utils/app-error.js";

export async function uploadImage(file, folder) {
  if (!file) throw new AppError("Image file is required", 400);

  const base64 = file.buffer.toString("base64");
  const dataUri = `data:${file.mimetype};base64,${base64}`;

  const result = await cloudinary.uploader.upload(dataUri, {
    folder,
    resource_type: "image"
  });

  return {
    publicId: result.public_id,
    secureUrl: result.secure_url,
    width: result.width,
    height: result.height,
    format: result.format,
    bytes: result.bytes
  };
}
