import { Request, Response } from "express";
import { TicketController } from "../../controllers/TicketController";
import { TicketService } from "../../services/TicketService";
import { TicketPriority, TicketStatus } from "../../entities/Ticket";
import { UserRole } from "../../entities/User";
import { ValidationError } from "../../utils/errors";

type TicketServiceMock = jest.Mocked<Pick<TicketService, "create" | "findAll" | "findById" | "update" | "delete">>;

const buildResponse = (): Response => {
  const res: Partial<Response> = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  res.send = jest.fn().mockReturnValue(res);
  return res as Response;
};

const buildTicketResponse = () => ({
  id: 1,
  title: "Ticket",
  description: null,
  priority: TicketPriority.BAJA,
  status: TicketStatus.ABIERTO,
  assignedTo: { id: 1, name: "Ana", email: "ana@example.com", role: UserRole.USER, createdAt: new Date() },
  resolvedReason: null,
  closedReason: null,
  isModified: false,
  modificationReason: null,
  lastChangedBy: null,
  date: "2026-01-01",
  time: "10:00:00",
  createdAt: new Date(),
  updatedAt: new Date(),
});

describe("TicketController", () => {
  let ticketService: TicketServiceMock;
  let controller: TicketController;

  beforeEach(() => {
    ticketService = {
      create: jest.fn(),
      findAll: jest.fn(),
      findById: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    };
    controller = new TicketController(ticketService as unknown as TicketService);
  });

  it("create responde 201 con el ticket creado", async () => {
    ticketService.create.mockResolvedValue(buildTicketResponse());
    const res = buildResponse();
    const next = jest.fn();

    await controller.create({ body: {} } as Request, res, next);

    expect(res.status).toHaveBeenCalledWith(201);
    expect(next).not.toHaveBeenCalled();
  });

  it("create delega el error a next()", async () => {
    const error = new Error("fallo al crear");
    ticketService.create.mockRejectedValue(error);
    const res = buildResponse();
    const next = jest.fn();

    await controller.create({ body: {} } as Request, res, next);

    expect(next).toHaveBeenCalledWith(error);
  });

  it("findAll responde 200 usando req.validatedQuery", async () => {
    ticketService.findAll.mockResolvedValue({
      items: [buildTicketResponse()],
      meta: { page: 1, pageSize: 10, totalItems: 1, totalPages: 1 },
    });
    const res = buildResponse();
    const next = jest.fn();
    const req = { validatedQuery: { page: 1 } } as unknown as Request;

    await controller.findAll(req, res, next);

    expect(ticketService.findAll).toHaveBeenCalledWith({ page: 1 });
    expect(res.status).toHaveBeenCalledWith(200);
  });

  it("findAll delega el error a next()", async () => {
    const error = new Error("fallo al listar");
    ticketService.findAll.mockRejectedValue(error);
    const res = buildResponse();
    const next = jest.fn();

    await controller.findAll({ validatedQuery: {} } as unknown as Request, res, next);

    expect(next).toHaveBeenCalledWith(error);
  });

  it("findOne responde 200 con el ticket solicitado", async () => {
    ticketService.findById.mockResolvedValue(buildTicketResponse());
    const res = buildResponse();
    const next = jest.fn();

    await controller.findOne({ params: { id: "1" } } as unknown as Request, res, next);

    expect(ticketService.findById).toHaveBeenCalledWith(1);
    expect(res.status).toHaveBeenCalledWith(200);
  });

  it("findOne delega ValidationError si el id no es un entero positivo", async () => {
    const res = buildResponse();
    const next = jest.fn();

    await controller.findOne({ params: { id: "abc" } } as unknown as Request, res, next);

    expect(next).toHaveBeenCalledWith(expect.any(ValidationError));
    expect(ticketService.findById).not.toHaveBeenCalled();
  });

  it("update responde 200 cuando hay usuario autenticado", async () => {
    ticketService.update.mockResolvedValue(buildTicketResponse());
    const res = buildResponse();
    const next = jest.fn();
    const req = {
      params: { id: "1" },
      body: {},
      user: { id: 5, role: "user" },
    } as unknown as Request;

    await controller.update(req, res, next);

    expect(ticketService.update).toHaveBeenCalledWith(1, {}, 5);
    expect(res.status).toHaveBeenCalledWith(200);
  });

  it("update delega el error si no hay usuario autenticado", async () => {
    const res = buildResponse();
    const next = jest.fn();
    const req = { params: { id: "1" }, body: {} } as unknown as Request;

    await controller.update(req, res, next);

    expect(next).toHaveBeenCalled();
    expect(ticketService.update).not.toHaveBeenCalled();
  });

  it("delete responde 204 sin contenido", async () => {
    ticketService.delete.mockResolvedValue(undefined);
    const res = buildResponse();
    const next = jest.fn();

    await controller.delete({ params: { id: "1" } } as unknown as Request, res, next);

    expect(res.status).toHaveBeenCalledWith(204);
    expect(res.send).toHaveBeenCalled();
  });

  it("delete delega el error a next()", async () => {
    const error = new Error("fallo al eliminar");
    ticketService.delete.mockRejectedValue(error);
    const res = buildResponse();
    const next = jest.fn();

    await controller.delete({ params: { id: "1" } } as unknown as Request, res, next);

    expect(next).toHaveBeenCalledWith(error);
  });
});
