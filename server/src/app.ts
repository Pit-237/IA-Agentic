import { randomUUID } from "node:crypto";
import express from "express";
import { rateLimit } from "express-rate-limit";
import helmet from "helmet";
import { z } from "zod";
import cookieSession from "cookie-session";
import type { NextFunction, Request, Response } from "express";
import { existsSync } from "node:fs";
import { resolve } from "node:path";
import { database } from "./database.js";
import { courses } from "./catalog.js";
import { config } from "./config.js";
import { requireAdmin, requireSameOrigin, verifyCredentials } from "./auth.js";
import { newsInputSchema } from "./news-schema.js";

type NewsRow = {
  id: string;
  title: string;
  excerpt: string;
  body: string;
  published: number;
  created_at: string;
  updated_at: string;
};

const app = express();
const loginSchema = z.object({
  username: z.string().min(1).max(128),
  password: z.string().min(1).max(256),
});
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 10,
  standardHeaders: "draft-8",
  legacyHeaders: false,
  message: { error: "Muitas tentativas. Tente novamente em alguns minutos." },
});

app.disable("x-powered-by");
app.use(helmet());
app.use(
  cookieSession({
    name: "etec-session",
    keys: [config.SESSION_SECRET],
    maxAge: 8 * 60 * 60 * 1000,
    httpOnly: true,
    secure: config.NODE_ENV === "production",
    sameSite: "lax",
  }),
);
app.use(express.json({ limit: "32kb" }));
app.use((req, res, next) => {
  res.setHeader("Cache-Control", req.path.startsWith("/api/admin") ? "no-store" : "no-cache");
  next();
});

app.get("/api/health", (_req, res) => {
  res.json({ status: "ok" });
});

app.get("/api/institution", (_req, res) => {
  res.json({
    name: "Etec Sales Gomes",
    description:
      "Uma escola técnica pública que conecta educação, conhecimento e oportunidades para a comunidade.",
    mission:
      "Formar pessoas e apoiar seus projetos de vida por meio da educação profissional e da aprendizagem contínua.",
    values: ["Conhecimento", "Inclusão", "Colaboração", "Inovação"],
    notice: "Informações institucionais resumidas; confirme dados de contato e atendimento nos canais oficiais.",
  });
});

app.get("/api/courses", (_req, res) => {
  res.json({ courses, mock: true });
});

app.get("/api/courses/:slug", (req, res) => {
  const course = courses.find((item) => item.slug === req.params.slug);
  if (!course) {
    res.status(404).json({ error: "Curso não encontrado." });
    return;
  }
  res.json({ course, mock: true });
});

app.get("/api/news", (_req, res) => {
  const rows = database
    .prepare(
      `SELECT id, title, excerpt, body, published, created_at, updated_at
       FROM news WHERE published = 1 ORDER BY created_at DESC`,
    )
    .all() as NewsRow[];
  res.json({ news: rows });
});

app.get("/api/news/:id", (req, res) => {
  const row = database
    .prepare(
      `SELECT id, title, excerpt, body, published, created_at, updated_at
       FROM news WHERE id = ? AND published = 1`,
    )
    .get(req.params.id) as NewsRow | undefined;
  if (!row) {
    res.status(404).json({ error: "Notícia não encontrada." });
    return;
  }
  res.json({ news: row });
});

app.post("/api/admin/login", loginLimiter, requireSameOrigin, async (req, res) => {
  const credentials = loginSchema.safeParse(req.body);
  if (!credentials.success) {
    res.status(400).json({ error: "Informe usuário e senha." });
    return;
  }

  if (!(await verifyCredentials(credentials.data.username, credentials.data.password))) {
    res.status(401).json({ error: "Usuário ou senha inválidos." });
    return;
  }

  req.session = { admin: true };
  res.json({ authenticated: true });
});

app.get("/api/admin/session", (req, res) => {
  res.json({ authenticated: Boolean(req.session?.admin) });
});

app.post("/api/admin/logout", requireSameOrigin, (req, res) => {
  req.session = null;
  res.status(204).end();
});

app.get("/api/admin/news", requireAdmin, (_req, res) => {
  const rows = database
    .prepare(
      `SELECT id, title, excerpt, body, published, created_at, updated_at
       FROM news ORDER BY created_at DESC`,
    )
    .all() as NewsRow[];
  res.json({ news: rows });
});

app.post("/api/admin/news", requireSameOrigin, requireAdmin, (req, res) => {
  const input = newsInputSchema.safeParse(req.body);
  if (!input.success) {
    res.status(400).json({ error: "Revise os campos da notícia.", details: input.error.flatten() });
    return;
  }

  const now = new Date().toISOString();
  const news = { id: randomUUID(), ...input.data, created_at: now, updated_at: now };
  database
    .prepare(
      `INSERT INTO news (id, title, excerpt, body, published, created_at, updated_at)
       VALUES (@id, @title, @excerpt, @body, @published, @created_at, @updated_at)`,
    )
    .run({ ...news, published: Number(news.published) });
  res.status(201).json({ news });
});

app.put("/api/admin/news/:id", requireSameOrigin, requireAdmin, (req, res) => {
  const input = newsInputSchema.safeParse(req.body);
  if (!input.success) {
    res.status(400).json({ error: "Revise os campos da notícia.", details: input.error.flatten() });
    return;
  }

  const updatedAt = new Date().toISOString();
  const result = database
    .prepare(
      `UPDATE news
       SET title = @title, excerpt = @excerpt, body = @body,
           published = @published, updated_at = @updated_at
       WHERE id = @id`,
    )
    .run({ ...input.data, published: Number(input.data.published), updated_at: updatedAt, id: req.params.id });
  if (result.changes === 0) {
    res.status(404).json({ error: "Notícia não encontrada." });
    return;
  }
  const news = database
    .prepare(
      `SELECT id, title, excerpt, body, published, created_at, updated_at
       FROM news WHERE id = ?`,
    )
    .get(req.params.id);
  res.json({ news });
});

app.delete("/api/admin/news/:id", requireSameOrigin, requireAdmin, (req, res) => {
  const result = database.prepare("DELETE FROM news WHERE id = ?").run(req.params.id);
  if (result.changes === 0) {
    res.status(404).json({ error: "Notícia não encontrada." });
    return;
  }
  res.status(204).end();
});

app.use("/api", (_req, res) => {
  res.status(404).json({ error: "Endpoint não encontrado." });
});

const clientBuild = resolve(process.cwd(), "../client/dist");
if (existsSync(clientBuild)) {
  app.use(express.static(clientBuild));
  app.get("/{*path}", (_req, res) => {
    res.sendFile(resolve(clientBuild, "index.html"));
  });
}

app.use((error: unknown, _req: Request, res: Response, _next: NextFunction) => {
  console.error("Request failed:", error);
  const status =
    typeof error === "object" &&
    error !== null &&
    "status" in error &&
    typeof error.status === "number" &&
    error.status >= 400 &&
    error.status < 500
      ? error.status
      : 500;
  res
    .status(status)
    .json({ error: status === 400 ? "Corpo da solicitação inválido." : "Não foi possível concluir a solicitação." });
});

export { app };
