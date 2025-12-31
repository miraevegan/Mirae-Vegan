// src/services/brevoEmail.service.js
import { brevoClient } from "../config/brevo.js";
import { renderTemplate } from "../utils/email/renderTemplate.js";

/**
 * Send order-related email via Brevo with template rendering
 * @param {string} to - Recipient email
 * @param {string} subject - Email subject
 * @param {string} templateName - Template filename (e.g. 'order-confirmed.html')
 * @param {Object} variables - Variables for template interpolation
 */
export async function sendOrderEmail(to, subject, templateName, variables) {
  try {
    const htmlContent = await renderTemplate(templateName, variables);

    const emailPayload = {
      sender: { email: process.env.BREVO_SENDER_EMAIL, name: "Miraé Store" },
      to: [{ email: to }],
      subject,
      htmlContent,
    };

    await brevoClient.sendTransacEmail(emailPayload);
  } catch (error) {
    console.error("Brevo email error:", error.response?.body || error.message);
    throw error;
  }
}

/* ================= NEWSLETTER EMAIL (SERVICE) ================= */

export async function sendNewsletterEmail({ to, subject, htmlContent }) {
  try {
    if (!to?.length || !subject || !htmlContent) {
      throw new Error("Missing newsletter email parameters");
    }

    const emailPayload = {
      sender: {
        email: process.env.BREVO_SENDER_EMAIL,
        name: "Miraé Vegan",
      },
      to, // [{ email }]
      subject,
      htmlContent,
    };

    await brevoClient.sendTransacEmail(emailPayload);
  } catch (error) {
    console.error(
      "Brevo newsletter error:",
      error.response?.body || error.message
    );
    throw error;
  }
}
