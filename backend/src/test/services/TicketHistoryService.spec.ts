import { TicketHistoryService } from "../../services/TicketHistoryService";
import { TicketHistoryRepository } from "../../repositories/TicketHistoryRepository";
import { TicketRepository } from "../../repositories/TicketRepository";
import { Ticket, TicketPriority, TicketStatus } from "../../entities/Ticket";
import { TicketHistory } from "../../entities/TicketHistory";
import { User, UserRole } from "../../entities/User";
import { NotFoundError } from "../../utils/errors";

type HistoryRepoMock = jest.Mocked<Pick<TicketHistoryRepository, "findByTicketId" | "create" | "save">>;
type TicketRepoMock = jest.Mocked<Pick<TicketRepository, "findById">>;

const buildUser = (): User => ({
  id: 1,
  name: "Ana Pérez",
  email: "ana@example.com",
  passwordHash: "hash",
  role: UserRole.USER,
  createdAt: new Date(),
  updatedAt: new Date(),
});

const buildTicket = (): Ticket => ({
  id: 1,
  title: "Ticket",
  description: null,
  priority: TicketPriority.BAJA,
  status: TicketStatus.ABIERTO,
  assignedTo: buildUser(),
  resolvedReason: null,
  closedReason: null,
  isModified: false,
  modificationReason: null,
  lastChangedBy: null,
  createdAt: new Date(),
  updatedAt: new Date(),
});

describe("TicketHistoryService", () => {
  let historyRepository: HistoryRepoMock;
  let ticketRepository: TicketRepoMock;
  let service: TicketHistoryService;

  beforeEach(() => {
    historyRepository = { findByTicketId: jest.fn(), create: jest.fn(), save: jest.fn() };
    ticketRepository = { findById: jest.fn() };
    service = new TicketHistoryService(
      historyRepository as unknown as TicketHistoryRepository,
      ticketRepository as unknown as TicketRepository,
    );
  });

  it("devuelve el historial ordenado cronológicamente cuando el ticket existe", async () => {
    ticketRepository.findById.mockResolvedValue(buildTicket());
    const entry: TicketHistory = {
      id: 1,
      ticket: buildTicket(),
      previousStatus: TicketStatus.ABIERTO,
      newStatus: TicketStatus.EN_PROGRESO,
      reason: null,
      changedBy: buildUser(),
      createdAt: new Date(),
    };
    historyRepository.findByTicketId.mockResolvedValue([entry]);

    const result = await service.findByTicketId(1);

    expect(result).toHaveLength(1);
    expect(result[0].ticketId).toBe(1);
  });

  it("lanza NotFoundError si el ticket no existe", async () => {
    ticketRepository.findById.mockResolvedValue(null);

    await expect(service.findByTicketId(999)).rejects.toThrow(NotFoundError);
    expect(historyRepository.findByTicketId).not.toHaveBeenCalled();
  });
});
