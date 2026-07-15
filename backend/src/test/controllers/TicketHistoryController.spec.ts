import { Request, Response } from "express";
import { TicketHistoryController } from "../../controllers/TicketHistoryController";
import { TicketHistoryService } from "../../services/TicketHistoryService";
import { TicketStatus } from "../../entities/Ticket";
import { UserRole } from "../../entities/User";
import { ValidationError } from "../../utils/errors";

type ServiceMock = jest.Mocked<Pick<TicketHistoryService, "findByTicketId">>;

const buildResponse = (): Response => {
  const res: Partial<Response> = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res as Response;
};

describe("TicketHistoryController", () => {
  let service: ServiceMock;
  let controller: TicketHistoryController;

  beforeEach(() => {
    service = { findByTicketId: jest.fn() };
    controller = new TicketHistoryController(service as unknown as TicketHistoryService);
  });

  it("responde 200 con el historial del ticket", async () => {
    service.findByTicketId.mockResolvedValue([
      {
        id: 1,
        ticketId: 3,
        previousStatus: TicketStatus.ABIERTO,
        newStatus: TicketStatus.EN_PROGRESO,
        reason: null,
        changedBy: { id: 1, name: "Ana", email: "a@a.com", role: UserRole.USER, createdAt: new Date() },
        date: "2026-01-01",
        time: "10:00:00",
      },
    ]);
    const res = buildResponse();
    const next = jest.fn();

    await controller.findByTicketId({ params: { id: "3" } } as unknown as Request, res, next);

    expect(service.findByTicketId).toHaveBeenCalledWith(3);
    expect(res.status).toHaveBeenCalledWith(200);
  });

  it("delega ValidationError si el id no es válido", async () => {
    const res = buildResponse();
    const next = jest.fn();

    await controller.findByTicketId({ params: { id: "-1" } } as unknown as Request, res, next);

    expect(next).toHaveBeenCalledWith(expect.any(ValidationError));
    expect(service.findByTicketId).not.toHaveBeenCalled();
  });
});
