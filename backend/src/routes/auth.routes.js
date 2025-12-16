import express from "express";

import {
  register,
  verifyEmailOTP,
  login,
  forgotPassword,
  resetPassword,
  getProfile,
  updateProfile,
  addAddress,
  updateAddress,
  deleteAddress,
  setDefaultAddress,
  changePassword,
} from "../controllers/auth.controller.js";

import { protect } from "../middleware/auth.middleware.js";

const router = express.Router();

/* ============================
   AUTH & VERIFICATION
============================ */

// Register → sends email OTP
router.post("/register", register);

// Verify email OTP
router.post("/verify-email", verifyEmailOTP);

// Login (only verified users)
router.post("/login", login);

// Forgot password → send OTP
router.post("/forgot-password", forgotPassword);

// Reset password using OTP
router.post("/reset-password", resetPassword);

// Change password (logged in users)
router.post("/change-password", protect, changePassword);

/* ============================
   USER PROFILE
============================ */

router.get("/profile", protect, getProfile);
router.put("/profile", protect, updateProfile);

/* ============================
   ADDRESS MANAGEMENT
============================ */

router.post("/address", protect, addAddress);
router.put("/address/:addressId", protect, updateAddress);
router.delete("/address/:addressId", protect, deleteAddress);
router.put("/address/default/:addressId", protect, setDefaultAddress);

export default router;
