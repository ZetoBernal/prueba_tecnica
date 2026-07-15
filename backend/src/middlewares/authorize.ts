import { NextFunction, Request, Response } from "express";
import { UserRole } from "../entities/User";
import { ForbiddenError, UnauthorizedError } from "../utils/errors";

export const authorize = (...allowedRoles: UserRole[]) => {
  return (req: Request, _res: Response, next: NextFunction): void => {
    if (!req.user) {
      next(new UnauthorizedError());
      return;
    }

    if (!allowedRoles.includes(req.user.role)) {
      next(new ForbiddenError("No tienes permisos para realizar esta acción."));
      return;
    }

    next();
  };
};
