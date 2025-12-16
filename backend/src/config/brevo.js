// src/config/brevo.js
import brevo from "@getbrevo/brevo";

export const brevoClient = new brevo.TransactionalEmailsApi();

brevoClient.setApiKey(
  brevo.TransactionalEmailsApiApiKeys.apiKey,
  process.env.BREVO_API_KEY
);
