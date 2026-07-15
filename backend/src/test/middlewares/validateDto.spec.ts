import { Request, Response } from "express";
import { validateBody, validateQuery } from "../../middlewares/validateDto";
import { RegisterUserDto } from "../../dto/auth/RegisterUserDto";
import { TicketQueryDto } from "../../dto/ticket/TicketQueryDto";
import { ValidationError } from "../../utils/errors";

describe("validateBody", () => {
  it("llama a next() y reemplaza req.body con la instancia validada", async () => {
    const middleware = validateBody(RegisterUserDto);
    const req = {
      body: {
        name: "Ana Pérez",
        email: "ana@example.com",
        password: "Segura#123",
        confirmPassword: "Segura#123",
      },
    } as Request;
    const next = jest.fn();

    await middleware(req, {} as Response, next);

    expect(next).toHaveBeenCalledWith();
    expect(req.body).toBeInstanceOf(RegisterUserDto);
  });

  it("llama a next con ValidationError si faltan campos requeridos", async () => {
    const middleware = validateBody(RegisterUserDto);
    const req = { body: { email: "correo-invalido" } } as Request;
    const next = jest.fn();

    await middleware(req, {} as Response, next);

    expect(next).toHaveBeenCalledWith(expect.any(ValidationError));
  });

  it("llama a next con ValidationError si la confirmación de contraseña no coincide", async () => {
    const middleware = validateBody(RegisterUserDto);
    const req = {
      body: {
        name: "Ana Pérez",
        email: "ana@example.com",
        password: "Segura#123",
        confirmPassword: "OtraClave#123",
      },
    } as Request;
    const next = jest.fn();

    await middleware(req, {} as Response, next);

    expect(next).toHaveBeenCalledWith(expect.any(ValidationError));
  });

  it("llama a next con ValidationError si hay campos no permitidos", async () => {
    const middleware = validateBody(RegisterUserDto);
    const req = {
      body: {
        name: "Ana Pérez",
        email: "ana@example.com",
        password: "Segura#123",
        confirmPassword: "Segura#123",
        role: "admin",
      },
    } as Request;
    const next = jest.fn();

    await middleware(req, {} as Response, next);

    expect(next).toHaveBeenCalledWith(expect.any(ValidationError));
  });
});

describe("validateQuery", () => {
  it("adjunta req.validatedQuery cuando los query params son válidos", async () => {
    const middleware = validateQuery(TicketQueryDto);
    const req = {
      query: {
        id: "7",
        assignedTo: "3",
        changedBy: "9",
        date: "2026-01-01",
        page: "2",
        pageSize: "10",
        isModified: "true",
      },
    } as unknown as Request;
    const next = jest.fn();

    await middleware(req, {} as Response, next);

    expect(next).toHaveBeenCalledWith();
    expect(req.validatedQuery).toEqual(
      expect.objectContaining({
        id: 7,
        assignedTo: 3,
        changedBy: 9,
        page: 2,
        pageSize: 10,
        isModified: true,
      }),
    );
  });

  it("interpreta isModified=false y ausencia de valor correctamente", async () => {
    const middleware = validateQuery(TicketQueryDto);
    const req = { query: { isModified: "false" } } as unknown as Request;
    const next = jest.fn();

    await middleware(req, {} as Response, next);

    expect(next).toHaveBeenCalledWith();
    expect(req.validatedQuery).toEqual(expect.objectContaining({ isModified: false }));
  });

  it("llama a next con ValidationError si pageSize excede el máximo", async () => {
    const middleware = validateQuery(TicketQueryDto);
    const req = { query: { pageSize: "500" } } as unknown as Request;
    const next = jest.fn();

    await middleware(req, {} as Response, next);

    expect(next).toHaveBeenCalledWith(expect.any(ValidationError));
  });
});
