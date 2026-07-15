import { UserRole } from "../../entities/User";

export interface AuthenticatedUser {
  id: number;
  role: UserRole;
}

declare global {
  namespace Express {
    interface Request {
      user?: AuthenticatedUser;
      validatedQuery?: Record<string, unknown>;
    }
  }
}

export {};
