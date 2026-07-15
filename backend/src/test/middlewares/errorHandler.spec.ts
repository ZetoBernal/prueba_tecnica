import { Request, Response } from "express";
import { errorHandler, notFoundHandler } from "../../middlewares/errorHandler";
import { NotFoundError } from "../../utils/errors";

const buildResponse = (): Response => {
  const res: Partial<Response> = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res as Response;
};

describe("errorHandler middleware", () => {
  it("responde con el statusCode y code del AppError", () => {
    const res = buildResponse();
    const error = new NotFoundError("Ticket no encontrado.");

    errorHandler(error, {} as Request, res, jest.fn());

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      data: null,
      error: { code: "NOT_FOUND", message: "Ticket no encontrado." },
    });
  });

  it("responde 500 para errores no controlados", () => {
    const res = buildResponse();

    errorHandler(new Error("boom"), {} as Request, res, jest.fn());

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      data: null,
      error: { code: "INTERNAL_ERROR", message: "Ha ocurrido un error interno." },
    });
  });
});

describe("notFoundHandler middleware", () => {
  it("responde 404 con la ruta solicitada", () => {
    const res = buildResponse();
    const req = { method: "GET", originalUrl: "/api/inexistente" } as Request;

    notFoundHandler(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        error: expect.objectContaining({ code: "NOT_FOUND" }),
      }),
    );
  });
});
