import http from "node:http";
import path from "node:path";
import fs from "node:fs/promises";
import { handleValue } from "./handler/handleValue.js";
import { fileURLToPath } from "url";
import { createInvoice } from "./utils/createInvoice.js";

const PORT = 3000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const server = http.createServer(async (req, res) => {
  if (req.url === "/api") {
    return await handleValue(req, res);
  }

  if (req.url === "/api/create-invoice") {
    let body = "";

    req.on("data", (chunk) => {
      body += chunk.toString();
    });

    req.on("end", async () => {
      try {
        const { amount, price, ounce } = JSON.parse(body);
        await createInvoice(amount, price, ounce);

        res.writeHead(200, { "Content-Type": "application/json" });
        return res.end(
          JSON.stringify({ message: "Invoice created successfully" })
        );
      } catch (err) {
        res.writeHead(500, { "Content-Type": "application/json" });
        return res.end(JSON.stringify({ error: err.message }));
      }
    });
    return;
  }

  let filePath = path.join(
    __dirname,
    "public",
    req.url === "/" ? "index.html" : req.url
  );
  const ext = path.extname(filePath);

  const mimeTypes = {
    ".html": "text/html",
    ".css": "text/css",
    ".js": "application/javascript",
    ".png": "image/png",
    ".jpg": "image/jpeg",
    ".jpeg": "image/jpeg",
    ".gif": "image/gif",
    ".svg": "image/svg+xml",
  };

  try {
    const content = await fs.readFile(filePath);
    res.statusCode = 200;
    res.setHeader("Content-Type", mimeTypes[ext] || "text/plain");
    res.end(content);
  } catch (err) {
    res.writeHead(404, { "Content-Type": "text/plain" });
    return res.end("File can not find");
  }
});

server.listen(PORT, () => {
  console.log(`Server is running on port: http://localhost:${PORT}`);
});
