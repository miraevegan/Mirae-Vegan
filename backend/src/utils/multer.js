import multer from "multer";

const storage = multer.memoryStorage();

/* ---------- PRODUCT UPLOAD (images only) ---------- */
const productFileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image/")) {
    cb(null, true);
  } else {
    cb(new Error("Only image files are allowed"), false);
  }
};

export const productUpload = multer({
  storage,
  fileFilter: productFileFilter,
  limits: { fileSize: 15 * 1024 * 1024 },
}).fields([
  { name: "productImages", maxCount: 20 }
]);

/* ---------- HERO UPLOAD (image + video) ---------- */
const heroFileFilter = (req, file, cb) => {
  if (
    file.mimetype.startsWith("image/") ||
    file.mimetype.startsWithWith?.("video/") || // fallback safety
    file.mimetype.startsWith("video/")
  ) {
    cb(null, true);
  } else {
    cb(new Error("Only image or video files are allowed"), false);
  }
};

export const heroUpload = multer({
  storage,
  fileFilter: heroFileFilter,
  limits: { fileSize: 50 * 1024 * 1024 }, // 50MB for video
}).array("media", 10);
