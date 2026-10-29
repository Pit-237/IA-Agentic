import { randomBytes, scrypt, timingSafeEqual } from "node:crypto";
import { promisify } from "node:util";
import type { NextFunction, Request, Response } from "express";
import { config } from "./config.js";

const deriveKey = promisify(scrypt);
const passwordSalt = randomBytes(16);
const configuredPasswordKey = (await deriveKey(config.ADMIN_PASSWORD, passwordSalt, 64)) as Buffer;

export async function verifyCredentials(username: string, password: string): Promise<boolean> {
  const submittedUsername = Buffer.from(username);
  const configuredUsername = Buffer.from(config.ADMIN_USERNAME);
  if (
    submittedUsername.length !== configuredUsername.length ||
    !timingSafeEqual(submittedUsername, configuredUsername)
  ) {
    return false;
  }

  const submittedKey = (await deriveKey(password, passwordSalt, 64)) as Buffer;
  return timingSafeEqual(submittedKey, configuredPasswordKey);
}

export function requireAdmin(req: Request, res: Response, next: NextFunction): void {
  if (!req.session?.admin) {
    res.status(401).json({ error: "Autenticação necessária." });
    return;
  }
  next();
}

export function requireSameOrigin(req: Request, res: Response, next: NextFunction): void {
  const origin = req.get("origin");
  if (origin !== config.APP_ORIGIN) {
    res.status(403).json({ error: "Origem da solicitação não permitida." });
    return;
  }
  next();
}
