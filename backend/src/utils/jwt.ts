import jwt, { JwtPayload } from "jsonwebtoken";
import { UserRole } from "../entities/User";
import { env } from "./env";

export interface AuthTokenPayload {
  sub: number;
  role: UserRole;
}

export const signAuthToken = (payload: AuthTokenPayload): string => {
  return jwt.sign(payload, env.jwt.secret, { expiresIn: env.jwt.expiresIn } as jwt.SignOptions);
};

export const verifyAuthToken = (token: string): AuthTokenPayload => {
  const decoded = jwt.verify(token, env.jwt.secret) as JwtPayload;
  return { sub: Number(decoded.sub), role: decoded.role as UserRole };
};
