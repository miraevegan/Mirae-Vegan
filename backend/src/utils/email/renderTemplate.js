import fs from "fs/promises";
import path from "path";

export async function renderTemplate(templateName, variables = {}) {
  try {
    const filePath = path.resolve("src", "emails", templateName);
    let content = await fs.readFile(filePath, "utf-8");

    Object.entries(variables).forEach(([key, value]) => {
      const regex = new RegExp(`{{\\s*${key}\\s*}}`, "g");
      content = content.replace(regex, value);
    });

    return content;
  } catch (err) {
    console.error(`Failed to render email template ${templateName}:`, err);
    throw err;
  }
}
