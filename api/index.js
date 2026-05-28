import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const functionDir = path.dirname(fileURLToPath(import.meta.url));
const roots = [
  process.cwd(),
  path.resolve(process.cwd(), ".."),
  functionDir,
  path.resolve(functionDir, ".."),
  path.resolve(functionDir, "../.."),
];

const types = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".png": "image/png",
  ".svg": "image/svg+xml; charset=utf-8",
};

export default async function handler(request, response) {
  const url = new URL(request.url || "/", "https://lexos-ai-ultimatetwo.vercel.app");
  const requestedPath = url.pathname === "/" ? "index.html" : decodeURIComponent(url.pathname.slice(1));

  for (const root of roots) {
    const filePath = path.resolve(root, requestedPath);

    if (!filePath.startsWith(root)) {
      response.statusCode = 403;
      response.end("Forbidden");
      return;
    }

    try {
      const data = await fs.readFile(filePath);
      response.setHeader("Content-Type", types[path.extname(filePath)] || "application/octet-stream");
      response.setHeader("X-Content-Type-Options", "nosniff");
      response.end(data);
      return;
    } catch {
      // Try the next possible Vercel function root.
    }
  }

  response.statusCode = 404;
  response.end("Not found");
}
