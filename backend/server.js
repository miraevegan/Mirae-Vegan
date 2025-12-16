// src/server.js
import dotenv from "dotenv";
dotenv.config();

import "./src/config/env.js"

import app from "./app.js";
import { connectDB } from "./src/config/db.js";

const PORT = process.env.PORT || 5555;

connectDB();

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
