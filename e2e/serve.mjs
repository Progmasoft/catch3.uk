// SPDX-FileCopyrightText: 2026 Progmasoft <support@progmasoft.com>
// SPDX-License-Identifier: AGPL-3.0-or-later

// Serves the generated site (.output/public) for the layout tests the way
// nginx serves it on tazel.net: a path is its file, its .html file or the
// index.html of its directory, and anything else is 404.html with status 404.

import { createServer } from "node:http";
import { readFile, stat } from "node:fs/promises";
import { extname, join, normalize } from "node:path";

const root = join(import.meta.dirname, "..", ".output", "public");
const port = Number(process.argv[2] ?? 3200);
const types = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript",
  ".css": "text/css",
  ".json": "application/json",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".woff2": "font/woff2",
  ".xml": "application/xml",
  ".txt": "text/plain; charset=utf-8",
};

async function file(path) {
  try {
    return (await stat(path)).isFile() ? path : undefined;
  } catch {
    return undefined;
  }
}

createServer(async (request, response) => {
  const path = decodeURIComponent(new URL(request.url ?? "/", "http://x").pathname);
  const local = normalize(join(root, path));
  if (!local.startsWith(root)) {
    response.writeHead(400).end();
    return;
  }
  const found =
    (await file(local)) ?? (await file(`${local}.html`)) ?? (await file(join(local, "index.html")));
  const target = found ?? join(root, "404.html");
  response.writeHead(found ? 200 : 404, {
    "content-type": types[extname(target)] ?? "application/octet-stream",
  });
  response.end(await readFile(target));
}).listen(port, "127.0.0.1");
