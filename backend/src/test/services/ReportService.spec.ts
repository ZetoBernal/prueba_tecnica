import { ReportService } from "../../services/ReportService";
import { ReportRepository } from "../../repositories/ReportRepository";
import { TicketPriority, TicketStatus } from "../../entities/Ticket";

type ReportRepoMock = jest.Mocked<Pick<ReportRepository, "countByStatus" | "countByPriority">>;

describe("ReportService", () => {
  let reportRepository: ReportRepoMock;
  let service: ReportService;

  beforeEach(() => {
    reportRepository = { countByStatus: jest.fn(), countByPriority: jest.fn() };
    service = new ReportService(reportRepository as unknown as ReportRepository);
  });

  it("devuelve el conteo por estado incluyendo estados en cero", async () => {
    reportRepository.countByStatus.mockResolvedValue([
      { status: TicketStatus.ABIERTO, total: "3" },
      { status: TicketStatus.RESUELTO, total: "1" },
    ]);

    const summary = await service.getStatusSummary();

    expect(summary).toEqual([
      { status: TicketStatus.ABIERTO, total: 3 },
      { status: TicketStatus.EN_PROGRESO, total: 0 },
      { status: TicketStatus.RESUELTO, total: 1 },
      { status: TicketStatus.CERRADO, total: 0 },
    ]);
  });

  it("devuelve el conteo por prioridad incluyendo prioridades en cero", async () => {
    reportRepository.countByPriority.mockResolvedValue([
      { priority: TicketPriority.CRITICA, total: "2" },
    ]);

    const summary = await service.getPrioritySummary();

    expect(summary).toEqual([
      { priority: TicketPriority.BAJA, total: 0 },
      { priority: TicketPriority.MEDIA, total: 0 },
      { priority: TicketPriority.ALTA, total: 0 },
      { priority: TicketPriority.CRITICA, total: 2 },
    ]);
  });

  it("devuelve ceros para todos los estados cuando no hay tickets", async () => {
    reportRepository.countByStatus.mockResolvedValue([]);

    const summary = await service.getStatusSummary();

    expect(summary.every((item) => item.total === 0)).toBe(true);
  });
});
