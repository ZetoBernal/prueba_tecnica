import { NextFunction, Request, Response } from "express";
import { plainToInstance } from "class-transformer";
import { validate, ValidationError } from "class-validator";
import { ValidationError as AppValidationError } from "../utils/errors";

type ClassConstructor<T> = new () => T;

const flattenErrors = (errors: ValidationError[]): string => {
  return errors
    .flatMap((error) => Object.values(error.constraints ?? {}))
    .join(" ");
};

export const validateBody = <T extends object>(dtoClass: ClassConstructor<T>) => {
  return async (req: Request, _res: Response, next: NextFunction): Promise<void> => {
    const instance = plainToInstance(dtoClass, req.body);
    const errors = await validate(instance, {
      whitelist: true,
      forbidNonWhitelisted: true,
    });

    if (errors.length > 0) {
      next(new AppValidationError(flattenErrors(errors)));
      return;
    }

    req.body = instance;
    next();
  };
};

export const validateQuery = <T extends object>(dtoClass: ClassConstructor<T>) => {
  return async (req: Request, _res: Response, next: NextFunction): Promise<void> => {
    const instance = plainToInstance(dtoClass, req.query);
    const errors = await validate(instance, {
      whitelist: true,
      forbidNonWhitelisted: true,
    });

    if (errors.length > 0) {
      next(new AppValidationError(flattenErrors(errors)));
      return;
    }

    req.validatedQuery = instance as unknown as Record<string, unknown>;
    next();
  };
};
