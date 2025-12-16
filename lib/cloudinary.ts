import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

export async function uploadToCloudinary(base64: string) {
  try {
    const result = await cloudinary.uploader.upload(base64, {
      folder: "deamoura/products",
      transformation: [
        { width: 900, crop: "scale" },
        { quality: "auto" }
      ]
    });

    return result.secure_url;
  } catch (error) {
    console.error("Cloudinary upload error:", error);
    if (error instanceof Error) {
      console.error("Error message:", error.message);
    }
    return null;
  }
}
