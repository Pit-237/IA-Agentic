import "dotenv/config";
import { z } from "zod";

const configSchema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  PORT: z.coerce.number().int().min(1).max(65535).default(3001),
  APP_ORIGIN: z.string().url().default("http://localhost:5173"),
  ADMIN_USERNAME: z.string().min(1).max(128),
  ADMIN_PASSWORD: z.string().min(12).max(256),
  SESSION_SECRET: z.string().min(32),
  DATABASE_PATH: z.string().min(1).default("./data/site.db"),
});

const result = configSchema.safeParse(process.env);

if (!result.success) {
  throw new Error(`Invalid server configuration: ${result.error.message}`);
}

export const config = result.data;
