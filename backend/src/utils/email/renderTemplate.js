// src/utils/email/renderTemplate.js
import fs from "fs/promises";
import path from "path";

export async function renderTemplate(templateName, variables = {}) {
  const filePath = path.resolve("src", "emails", templateName);
  let content = await fs.readFile(filePath, "utf-8");

  Object.entries(variables).forEach(([key, value]) => {
    const regex = new RegExp(`{{\\s*${key}\\s*}}`, "g");
    content = content.replace(regex, value);
  });

  return content;
}
