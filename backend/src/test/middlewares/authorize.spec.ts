import { Request, Response } from "express";
import { authorize } from "../../middlewares/authorize";
import { UserRole } from "../../entities/User";
import { ForbiddenError, UnauthorizedError } from "../../utils/errors";

const buildRequest = (user?: { id: number; role: UserRole }): Request =>
  ({ user }) as unknown as Request;

describe("authorize middleware", () => {
  it("llama a next con UnauthorizedError si no hay usuario autenticado", () => {
    const middleware = authorize(UserRole.ADMIN);
    const next = jest.fn();

    middleware(buildRequest(undefined), {} as Response, next);

    expect(next).toHaveBeenCalledWith(expect.any(UnauthorizedError));
  });

  it("llama a next con ForbiddenError si el rol no está permitido", () => {
    const middleware = authorize(UserRole.ADMIN);
    const next = jest.fn();

    middleware(buildRequest({ id: 1, role: UserRole.USER }), {} as Response, next);

    expect(next).toHaveBeenCalledWith(expect.any(ForbiddenError));
  });

  it("llama a next sin argumentos si el rol está permitido", () => {
    const middleware = authorize(UserRole.ADMIN, UserRole.USER);
    const next = jest.fn();

    middleware(buildRequest({ id: 1, role: UserRole.USER }), {} as Response, next);

    expect(next).toHaveBeenCalledWith();
  });
});
