// src/controllers/newsletter.controller.js
import NewsletterSubscriber from "../models/NewsletterSubscriber.js";
import { sendNewsletterEmail, sendOrderEmail } from "../services/brevoEmail.service.js";
import { renderTemplate } from "../utils/email/renderTemplate.js";
import dotenv from "dotenv";

dotenv.config();
// Send broadcast newsletter to all subscribed users
export const sendNewsletter = async (req, res) => {
  try {
    const { subject, templateName, variables } = req.body;

    if (!subject || !templateName) {
      return res.status(400).json({ message: "Subject & templateName are required" });
    }

    // Find all subscribed users
    const subscribers = await NewsletterSubscriber.find({ status: "subscribed" }).select("email");

    if (!subscribers.length) {
      return res.status(400).json({ message: "No subscribers found" });
    }

    // Prepare recipients for Brevo
    const recipients = subscribers.map((s) => ({ email: s.email }));

    // Render template for each recipient (or if variables are generic, just once)
    // For simplicity, we assume variables is an object or empty (generic content).
    // You can enhance it for personalized emails by looping through subscribers.

    // Here we send one email to multiple recipients with the same content
    const htmlContent = await renderTemplate(templateName, variables);

    await sendNewsletterEmail({
      to: recipients,
      subject,
      htmlContent,
    });

    res.json({
      success: true,
      sentTo: recipients.length,
    });
  } catch (error) {
    console.error("Newsletter error:", error);
    res.status(500).json({ message: error.message });
  }
};

// Subscribe user (POST)
export const subscribe = async (req, res) => {
  const { email, userName } = req.body;
  if (!email) return res.status(400).json({ message: "Email is required" });

  try {
    const existing = await NewsletterSubscriber.findOne({ email: email.toLowerCase() });

    if (existing && existing.status === "subscribed") {
      return res.status(400).json({ message: "Email already subscribed" });
    }

    if (existing && existing.status === "unsubscribed") {
      // Resubscribe user
      existing.status = "subscribed";
      existing.subscribedAt = new Date();
      existing.unsubscribedAt = null;
      await existing.save();
    } else if (!existing) {
      // New subscriber
      await NewsletterSubscriber.create({
        email: email.toLowerCase(),
        status: "subscribed",
        subscribedAt: new Date(),
      });
    }

    // Send welcome email
    await sendOrderEmail(email, "Welcome to Miraé`s Newsletter", "newsletter-welcome.html", {
      userName: userName || "Subscriber",
      unsubscribeLink: `${process.env.BASE_URL}/newsletter/unsubscribe?email=${encodeURIComponent(email)}`,
    });

    res.json({ success: true, message: "Subscribed successfully" });
  } catch (error) {
    console.error("Subscribe error:", error);
    res.status(500).json({ message: error.message });
  }
};

// Unsubscribe user (GET)
export const unsubscribe = async (req, res) => {
  const { email } = req.query;

  if (!email) {
    return res.status(400).send("<h2>Invalid unsubscribe link</h2>");
  }

  try {
    const subscriber = await NewsletterSubscriber.findOne({
      email: email.toLowerCase(),
    });

    if (!subscriber || subscriber.status === "unsubscribed") {
      return res.send(`
        <html>
          <body style="font-family: Arial; text-align:center; padding:40px">
            <h2>You’re already unsubscribed</h2>
            <p>No further action is needed.</p>
          </body>
        </html>
      `);
    }

    subscriber.status = "unsubscribed";
    subscriber.unsubscribedAt = new Date();
    await subscriber.save();

    return res.send(`
      <html>
        <head>
          <title>Unsubscribed</title>
        </head>
        <body style="
          font-family: Arial, sans-serif;
          text-align: center;
          padding: 60px;
          background: #f9f9f9;
        ">
          <h1 style="color:#2f855a;">You’ve been unsubscribed 🌱</h1>
          <p>You will no longer receive emails from Miraé.</p>
          <p style="margin-top:20px;">
            Changed your mind?
            <a href="${process.env.FRONTEND_URL || "#"}">Subscribe again</a>
          </p>
        </body>
      </html>
    `);
  } catch (error) {
    console.error("Unsubscribe error:", error);
    return res.status(500).send("<h2>Something went wrong</h2>");
  }
};

export const getSubscribers = async (req, res) => {
  try {
    // Pagination params (default page 1, limit 20)
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const statusFilter = req.query.status; // optional filter by status

    const query = {};
    if (statusFilter) {
      query.status = statusFilter;
    }

    const total = await NewsletterSubscriber.countDocuments(query);
    const subscribers = await NewsletterSubscriber.find(query)
      .sort({ subscribedAt: -1 }) // newest first
      .skip((page - 1) * limit)
      .limit(limit)
      .select("email status subscribedAt unsubscribedAt");

    res.json({
      subscribers,
      total,
      page,
      limit,
    });
  } catch (error) {
    console.error("Get subscribers error:", error);
    res.status(500).json({ message: "Failed to fetch subscribers" });
  }
};
