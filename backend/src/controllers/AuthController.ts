import { NextFunction, Request, Response } from "express";
import { AuthService } from "../services/AuthService";
import { RegisterUserDto } from "../dto/auth/RegisterUserDto";
import { LoginUserDto } from "../dto/auth/LoginUserDto";
import { successResponse } from "../utils/apiResponse";

export class AuthController {
  /* istanbul ignore next -- default de conveniencia para producción, en tests se inyecta el mock */
  constructor(private readonly authService: AuthService = new AuthService()) {}

  register = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const dto = req.body as RegisterUserDto;
      const result = await this.authService.register(dto);
      res.status(201).json(successResponse(result));
    } catch (error) {
      next(error);
    }
  };

  login = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const dto = req.body as LoginUserDto;
      const result = await this.authService.login(dto);
      res.status(200).json(successResponse(result));
    } catch (error) {
      next(error);
    }
  };
}
