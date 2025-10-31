import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export async function createInvoice(amountPaid, pricePerOz, goldSold) {
  try {
    const filePath = path.join(__dirname, "..", "purchases.txt");

    const now = new Date();
    const text = `
        ${now.toISOString()}, amount paid: €${amountPaid}, price per Oz: €${pricePerOz}, gold sold: ${goldSold}
    `;

    const line = `${text}\n`;

    await fs.appendFile(filePath, line);
  } catch (err) {
    console.error('Errror saving purchase record:', err.message)
  }
}
