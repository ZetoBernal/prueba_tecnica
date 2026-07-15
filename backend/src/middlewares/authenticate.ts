import { NextFunction, Request, Response } from "express";
import { UnauthorizedError } from "../utils/errors";
import { verifyAuthToken } from "../utils/jwt";

const extractToken = (req: Request): string | null => {
  const authHeader = req.headers.authorization;
  if (authHeader?.startsWith("Bearer ")) {
    return authHeader.slice("Bearer ".length);
  }

  const cookieToken = (req.cookies as Record<string, string> | undefined)?.token;
  return cookieToken ?? null;
};

export const authenticate = (req: Request, _res: Response, next: NextFunction): void => {
  const token = extractToken(req);

  if (!token) {
    next(new UnauthorizedError("Token de autenticación no proporcionado."));
    return;
  }

  try {
    const payload = verifyAuthToken(token);
    req.user = { id: payload.sub, role: payload.role };
    next();
  } catch {
    next(new UnauthorizedError("Token de autenticación inválido o expirado."));
  }
};
