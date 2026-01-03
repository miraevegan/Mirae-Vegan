import Hero from "../models/Hero.js";
import cloudinary from "../config/cloudinary.js";
import { uploadFromBuffer } from "../utils/uploadToCloudinary.js";

export const getHero = async (req, res) => {
  try {
    const hero = await Hero.findOne({ isActive: true }).sort({ createdAt: -1 });
    res.status(200).json(hero || null);
  } catch (error) {
    console.error("GET HERO ERROR:", error);
    res.status(500).json({ message: "Failed to fetch hero" });
  }
};

export const upsertHero = async (req, res) => {
  try {
    const { mediaType } = req.body;

    if (!["image", "video"].includes(mediaType)) {
      return res.status(400).json({ message: "Invalid media type" });
    }

    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: "No media files uploaded" });
    }

    if (mediaType === "video" && req.files.length > 1) {
      return res.status(400).json({
        message: "Only one video allowed for hero",
      });
    }

    /* Remove old hero */
    const oldHero = await Hero.findOne({ isActive: true });

    if (oldHero) {
      for (const item of oldHero.media) {
        await cloudinary.uploader.destroy(item.publicId, {
          resource_type: oldHero.mediaType === "video" ? "video" : "image",
        });
      }
      await Hero.updateOne({ _id: oldHero._id }, { isActive: false });
    }

    /* Upload new media */
    const uploadedMedia = [];

    for (const file of req.files) {
      const result = await uploadFromBuffer(
        file.buffer,
        mediaType === "video" ? "hero/videos" : "hero/images"
      );

      uploadedMedia.push({
        url: result.secure_url,
        publicId: result.public_id,
      });
    }

    const hero = await Hero.create({
      mediaType,
      media: uploadedMedia,
      isActive: true,
    });

    res.status(201).json(hero);
  } catch (error) {
    console.error("UPSERT HERO ERROR:", error);
    res.status(500).json({ message: "Failed to update hero" });
  }
};
