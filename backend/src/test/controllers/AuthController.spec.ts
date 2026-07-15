import { Request, Response } from "express";
import { AuthController } from "../../controllers/AuthController";
import { AuthService } from "../../services/AuthService";
import { UserRole } from "../../entities/User";

type AuthServiceMock = jest.Mocked<Pick<AuthService, "register" | "login">>;

const buildResponse = (): Response => {
  const res: Partial<Response> = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res as Response;
};

describe("AuthController", () => {
  let authService: AuthServiceMock;
  let controller: AuthController;

  beforeEach(() => {
    authService = { register: jest.fn(), login: jest.fn() };
    controller = new AuthController(authService as unknown as AuthService);
  });

  it("register responde 201 con el resultado del servicio", async () => {
    const authResult = {
      user: { id: 1, name: "Ana", email: "ana@example.com", role: UserRole.USER, createdAt: new Date() },
      token: "token",
    };
    authService.register.mockResolvedValue(authResult);
    const res = buildResponse();
    const next = jest.fn();

    await controller.register({ body: {} } as Request, res, next);

    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({ success: true, data: authResult }),
    );
    expect(next).not.toHaveBeenCalled();
  });

  it("register delega el error a next()", async () => {
    const error = new Error("fallo");
    authService.register.mockRejectedValue(error);
    const res = buildResponse();
    const next = jest.fn();

    await controller.register({ body: {} } as Request, res, next);

    expect(next).toHaveBeenCalledWith(error);
  });

  it("login responde 200 con el resultado del servicio", async () => {
    const authResult = {
      user: { id: 1, name: "Ana", email: "ana@example.com", role: UserRole.USER, createdAt: new Date() },
      token: "token",
    };
    authService.login.mockResolvedValue(authResult);
    const res = buildResponse();
    const next = jest.fn();

    await controller.login({ body: {} } as Request, res, next);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(next).not.toHaveBeenCalled();
  });

  it("login delega el error a next()", async () => {
    const error = new Error("credenciales inválidas");
    authService.login.mockRejectedValue(error);
    const res = buildResponse();
    const next = jest.fn();

    await controller.login({ body: {} } as Request, res, next);

    expect(next).toHaveBeenCalledWith(error);
  });
});
