import { Request, Response } from "express";
import { authenticate } from "../../middlewares/authenticate";
import { signAuthToken } from "../../utils/jwt";
import { UserRole } from "../../entities/User";
import { UnauthorizedError } from "../../utils/errors";

const buildRequest = (overrides: Partial<Request> = {}): Request =>
  ({
    headers: {},
    cookies: {},
    ...overrides,
  }) as unknown as Request;

describe("authenticate middleware", () => {
  it("adjunta req.user cuando el token Bearer es válido", () => {
    const token = signAuthToken({ sub: 7, role: UserRole.ADMIN });
    const req = buildRequest({ headers: { authorization: `Bearer ${token}` } });
    const next = jest.fn();

    authenticate(req, {} as Response, next);

    expect(req.user).toEqual({ id: 7, role: UserRole.ADMIN });
    expect(next).toHaveBeenCalledWith();
  });

  it("adjunta req.user cuando el token viene en cookie", () => {
    const token = signAuthToken({ sub: 3, role: UserRole.USER });
    const req = buildRequest({ cookies: { token } });
    const next = jest.fn();

    authenticate(req, {} as Response, next);

    expect(req.user).toEqual({ id: 3, role: UserRole.USER });
  });

  it("llama a next con UnauthorizedError si no hay token", () => {
    const req = buildRequest();
    const next = jest.fn();

    authenticate(req, {} as Response, next);

    expect(next).toHaveBeenCalledWith(expect.any(UnauthorizedError));
  });

  it("llama a next con UnauthorizedError si el token es inválido", () => {
    const req = buildRequest({ headers: { authorization: "Bearer token-invalido" } });
    const next = jest.fn();

    authenticate(req, {} as Response, next);

    expect(next).toHaveBeenCalledWith(expect.any(UnauthorizedError));
  });
});
