import { Router } from "express";
import { AuthController } from "../controllers/AuthController";
import { validateBody } from "../middlewares/validateDto";
import { RegisterUserDto } from "../dto/auth/RegisterUserDto";
import { LoginUserDto } from "../dto/auth/LoginUserDto";
import { authRateLimiter } from "../middlewares/rateLimiter";

const router = Router();
const authController = new AuthController();

router.post(
  "/register",
  authRateLimiter,
  validateBody(RegisterUserDto),
  authController.register,
);
router.post("/login", authRateLimiter, validateBody(LoginUserDto), authController.login);

export default router;
