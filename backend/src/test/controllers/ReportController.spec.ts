import { Request, Response } from "express";
import { ReportController } from "../../controllers/ReportController";
import { ReportService } from "../../services/ReportService";
import { TicketPriority, TicketStatus } from "../../entities/Ticket";

type ServiceMock = jest.Mocked<Pick<ReportService, "getStatusSummary" | "getPrioritySummary">>;

const buildResponse = (): Response => {
  const res: Partial<Response> = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res as Response;
};

describe("ReportController", () => {
  let reportService: ServiceMock;
  let controller: ReportController;

  beforeEach(() => {
    reportService = { getStatusSummary: jest.fn(), getPrioritySummary: jest.fn() };
    controller = new ReportController(reportService as unknown as ReportService);
  });

  it("getStatusSummary responde 200 con el resumen por estado", async () => {
    reportService.getStatusSummary.mockResolvedValue([{ status: TicketStatus.ABIERTO, total: 2 }]);
    const res = buildResponse();
    const next = jest.fn();

    await controller.getStatusSummary({} as Request, res, next);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(next).not.toHaveBeenCalled();
  });

  it("getStatusSummary delega el error a next()", async () => {
    const error = new Error("fallo");
    reportService.getStatusSummary.mockRejectedValue(error);
    const res = buildResponse();
    const next = jest.fn();

    await controller.getStatusSummary({} as Request, res, next);

    expect(next).toHaveBeenCalledWith(error);
  });

  it("getPrioritySummary responde 200 con el resumen por prioridad", async () => {
    reportService.getPrioritySummary.mockResolvedValue([
      { priority: TicketPriority.ALTA, total: 4 },
    ]);
    const res = buildResponse();
    const next = jest.fn();

    await controller.getPrioritySummary({} as Request, res, next);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(next).not.toHaveBeenCalled();
  });

  it("getPrioritySummary delega el error a next()", async () => {
    const error = new Error("fallo");
    reportService.getPrioritySummary.mockRejectedValue(error);
    const res = buildResponse();
    const next = jest.fn();

    await controller.getPrioritySummary({} as Request, res, next);

    expect(next).toHaveBeenCalledWith(error);
  });
});
