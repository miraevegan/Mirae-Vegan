// import express from "express";
// import sendEmail from "../utils/email/sendEmail.js";

// const router = express.Router();

// router.get("/email", async (req, res) => {
//   try {
//     await sendEmail({
//       to: "monishranjan9@gmail.com", // 🔴 replace with your real email
//       subject: "🚀 Mirae Email Test",
//       html: `
//         <div style="font-family: Arial, sans-serif; padding: 20px">
//           <h1 style="color:#111">Email Working Successfully 🎉</h1>
//           <p>If you received this email, Brevo is configured correctly.</p>
//           <p><strong>Project:</strong> Mirae E-Commerce</p>
//         </div>
//       `,
//     });

//     res.json({ success: true, message: "Test email sent" });
//   } catch (error) {
//     res.status(500).json({ message: "Email failed" });
//   }
// });

// export default router;
