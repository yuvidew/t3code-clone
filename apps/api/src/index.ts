import { serve } from "@hono/node-server";
import { Hono } from "hono";
import { cors } from "hono/cors";
import type { Health } from "@repo/shared";

const app = new Hono();
app.use("*", cors({ origin: process.env.WEB_ORIGIN ?? "http://localhost:3000" }));

app.get("/health", (c) => {
  const body: Health = { status: "ok", timestamp: new Date().toISOString() };
  return c.json(body);
});

const port = Number(process.env.PORT ?? 4000);
serve({ fetch: app.fetch, port }, () => console.log(`API listening on http://localhost:${port}`));
