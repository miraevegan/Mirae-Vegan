// utils/uploadToCloudinary.js
import cloudinary from "../config/cloudinary.js";

export const uploadFromBuffer = (buffer, folder = "products") =>
  new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder, resource_type: "auto" },
      (error, result) => {
        if (error) reject(error);
        else resolve(result);
      }
    );

    stream.end(buffer);
  });
