let cachedServerEntry;

async function getServerEntry() {
  if (!cachedServerEntry) {
    const mod = await import("../dist/server/index.js");
    cachedServerEntry = mod.default;
  }

  return cachedServerEntry;
}

async function readRawBody(req) {
  const chunks = [];

  for await (const chunk of req) {
    chunks.push(typeof chunk === "string" ? Buffer.from(chunk) : chunk);
  }

  return chunks.length > 0 ? Buffer.concat(chunks) : undefined;
}

function toHeaders(nodeHeaders) {
  const headers = new Headers();

  for (const [key, value] of Object.entries(nodeHeaders)) {
    if (Array.isArray(value)) {
      for (const item of value) {
        headers.append(key, item);
      }
      continue;
    }

    if (typeof value === "string") {
      headers.set(key, value);
    }
  }

  return headers;
}

export default async function handler(req, res) {
  try {
    const serverEntry = await getServerEntry();
    const method = req.method || "GET";
    const protocol = req.headers["x-forwarded-proto"] || "https";
    const host = req.headers.host || "localhost";
    const url = new URL(req.url || "/", `${protocol}://${host}`);

    const request = new Request(url, {
      method,
      headers: toHeaders(req.headers),
      body: method === "GET" || method === "HEAD" ? undefined : await readRawBody(req),
    });

    const response = await serverEntry.fetch(request);

    response.headers.forEach((value, key) => {
      if (key.toLowerCase() === "content-encoding") {
        return;
      }
      res.setHeader(key, value);
    });

    res.statusCode = response.status;

    const body = Buffer.from(await response.arrayBuffer());
    res.end(body);
  } catch (error) {
    res.statusCode = 500;
    res.setHeader("content-type", "text/plain; charset=utf-8");
    res.end(`SSR handler error: ${error instanceof Error ? error.message : "Unknown error"}`);
  }
}
