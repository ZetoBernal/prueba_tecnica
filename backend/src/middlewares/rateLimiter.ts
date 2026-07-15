import rateLimit from "express-rate-limit";
import { env } from "../utils/env";
import { errorResponse } from "../utils/apiResponse";

export const authRateLimiter = rateLimit({
  windowMs: env.authRateLimit.windowMs,
  limit: env.authRateLimit.max,
  standardHeaders: true,
  legacyHeaders: false,
  handler: (_req, res) => {
    res
      .status(429)
      .json(errorResponse("TOO_MANY_REQUESTS", "Demasiados intentos, inténtalo más tarde."));
  },
});
