import {
  AppError,
  ConflictError,
  ForbiddenError,
  NotFoundError,
  UnauthorizedError,
  ValidationError,
} from "../../utils/errors";

describe("errors", () => {
  it("AppError expone statusCode y code", () => {
    const error = new AppError("mensaje genérico", 418, "TEAPOT");
    expect(error.message).toBe("mensaje genérico");
    expect(error.statusCode).toBe(418);
    expect(error.code).toBe("TEAPOT");
    expect(error).toBeInstanceOf(Error);
  });

  it("ValidationError usa 400 y VALIDATION_ERROR", () => {
    const error = new ValidationError("campo inválido");
    expect(error.statusCode).toBe(400);
    expect(error.code).toBe("VALIDATION_ERROR");
  });

  it("UnauthorizedError usa 401 y mensaje por defecto", () => {
    const error = new UnauthorizedError();
    expect(error.statusCode).toBe(401);
    expect(error.code).toBe("UNAUTHORIZED");
    expect(error.message).toBe("No autenticado.");
  });

  it("ForbiddenError usa 403 y mensaje por defecto", () => {
    const error = new ForbiddenError();
    expect(error.statusCode).toBe(403);
    expect(error.code).toBe("FORBIDDEN");
  });

  it("NotFoundError usa 404 y mensaje por defecto", () => {
    const error = new NotFoundError();
    expect(error.statusCode).toBe(404);
    expect(error.code).toBe("NOT_FOUND");
  });

  it("ConflictError usa 409", () => {
    const error = new ConflictError("correo duplicado");
    expect(error.statusCode).toBe(409);
    expect(error.code).toBe("CONFLICT");
    expect(error.message).toBe("correo duplicado");
  });
});
