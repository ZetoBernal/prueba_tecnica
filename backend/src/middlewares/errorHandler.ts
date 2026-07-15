import { NextFunction, Request, Response } from "express";
import { AppError } from "../utils/errors";
import { errorResponse } from "../utils/apiResponse";
import { logger } from "../utils/logger";

export const errorHandler = (
  error: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction,
): void => {
  if (error instanceof AppError) {
    res.status(error.statusCode).json(errorResponse(error.code, error.message));
    return;
  }

  logger.error({ err: error }, "Error no controlado");
  res.status(500).json(errorResponse("INTERNAL_ERROR", "Ha ocurrido un error interno."));
};

export const notFoundHandler = (req: Request, res: Response): void => {
  res
    .status(404)
    .json(errorResponse("NOT_FOUND", `La ruta ${req.method} ${req.originalUrl} no existe.`));
};
