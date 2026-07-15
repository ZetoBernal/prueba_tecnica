import { TicketService } from "../../services/TicketService";
import { TicketRepository } from "../../repositories/TicketRepository";
import { TicketHistoryRepository } from "../../repositories/TicketHistoryRepository";
import { UserRepository } from "../../repositories/UserRepository";
import { Ticket, TicketPriority, TicketStatus } from "../../entities/Ticket";
import { User, UserRole } from "../../entities/User";
import { CreateTicketDto } from "../../dto/ticket/CreateTicketDto";
import { UpdateTicketDto } from "../../dto/ticket/UpdateTicketDto";
import { TicketQueryDto } from "../../dto/ticket/TicketQueryDto";
import { NotFoundError, ValidationError } from "../../utils/errors";

type TicketRepoMock = jest.Mocked<Pick<TicketRepository, "findById" | "create" | "save" | "delete" | "findAll">>;
type HistoryRepoMock = jest.Mocked<Pick<TicketHistoryRepository, "create" | "save">>;
type UserRepoMock = jest.Mocked<Pick<UserRepository, "findById" | "findByEmail" | "create">>;

const buildUser = (overrides: Partial<User> = {}): User => ({
  id: 1,
  name: "Ana Pérez",
  email: "ana@example.com",
  passwordHash: "hash",
  role: UserRole.USER,
  createdAt: new Date(),
  updatedAt: new Date(),
  ...overrides,
});

const buildTicket = (overrides: Partial<Ticket> = {}): Ticket => ({
  id: 1,
  title: "Ticket original",
  description: "descripción original",
  priority: TicketPriority.MEDIA,
  status: TicketStatus.ABIERTO,
  assignedTo: buildUser(),
  resolvedReason: null,
  closedReason: null,
  isModified: false,
  modificationReason: null,
  lastChangedBy: null,
  createdAt: new Date(),
  updatedAt: new Date(),
  ...overrides,
});

describe("TicketService", () => {
  let ticketRepository: TicketRepoMock;
  let ticketHistoryRepository: HistoryRepoMock;
  let userRepository: UserRepoMock;
  let ticketService: TicketService;

  beforeEach(() => {
    ticketRepository = {
      findById: jest.fn(),
      create: jest.fn(),
      save: jest.fn(),
      delete: jest.fn(),
      findAll: jest.fn(),
    };
    ticketHistoryRepository = {
      create: jest.fn(),
      save: jest.fn(),
    };
    userRepository = {
      findById: jest.fn(),
      findByEmail: jest.fn(),
      create: jest.fn(),
    };
    ticketService = new TicketService(
      ticketRepository as unknown as TicketRepository,
      ticketHistoryRepository as unknown as TicketHistoryRepository,
      userRepository as unknown as UserRepository,
    );
  });

  describe("create", () => {
    const dto: CreateTicketDto = Object.assign(new CreateTicketDto(), {
      title: "Nuevo ticket",
      description: "detalle",
      priority: TicketPriority.ALTA,
      status: TicketStatus.ABIERTO,
      assignedTo: 5,
    });

    it("crea el ticket cuando el usuario asignado existe", async () => {
      const assignedUser = buildUser({ id: 5 });
      userRepository.findById.mockResolvedValue(assignedUser);
      const createdTicket = buildTicket({ id: 10, assignedTo: assignedUser });
      ticketRepository.create.mockReturnValue(createdTicket);
      ticketRepository.save.mockResolvedValue(createdTicket);

      const result = await ticketService.create(dto);

      expect(userRepository.findById).toHaveBeenCalledWith(5);
      expect(result.id).toBe(10);
      expect(result.assignedTo.id).toBe(5);
    });

    it("lanza NotFoundError si el usuario asignado no existe", async () => {
      userRepository.findById.mockResolvedValue(null);

      await expect(ticketService.create(dto)).rejects.toThrow(NotFoundError);
      expect(ticketRepository.create).not.toHaveBeenCalled();
    });
  });

  describe("findById", () => {
    it("devuelve el ticket mapeado si existe", async () => {
      ticketRepository.findById.mockResolvedValue(buildTicket({ id: 7 }));

      const result = await ticketService.findById(7);

      expect(result.id).toBe(7);
    });

    it("lanza NotFoundError si no existe", async () => {
      ticketRepository.findById.mockResolvedValue(null);

      await expect(ticketService.findById(99)).rejects.toThrow(NotFoundError);
    });
  });

  describe("findAll", () => {
    it("calcula la metadata de paginación con valores por defecto", async () => {
      ticketRepository.findAll.mockResolvedValue({ items: [buildTicket()], total: 1 });

      const query = Object.assign(new TicketQueryDto(), {});
      const result = await ticketService.findAll(query);

      expect(ticketRepository.findAll).toHaveBeenCalledWith(query, 1, 10);
      expect(result.meta).toEqual({ page: 1, pageSize: 10, totalItems: 1, totalPages: 1 });
      expect(result.items).toHaveLength(1);
    });

    it("respeta page y pageSize personalizados y limita al máximo permitido", async () => {
      ticketRepository.findAll.mockResolvedValue({ items: [], total: 0 });

      const query = Object.assign(new TicketQueryDto(), { page: 2, pageSize: 500 });
      const result = await ticketService.findAll(query);

      expect(ticketRepository.findAll).toHaveBeenCalledWith(query, 2, 100);
      expect(result.meta.totalPages).toBe(0);
    });
  });

  describe("update", () => {
    it("lanza NotFoundError si el ticket no existe", async () => {
      ticketRepository.findById.mockResolvedValue(null);

      await expect(ticketService.update(1, {}, 1)).rejects.toThrow(NotFoundError);
    });

    it("rechaza una transición de estado no permitida", async () => {
      ticketRepository.findById.mockResolvedValue(
        buildTicket({ status: TicketStatus.ABIERTO }),
      );

      const dto: UpdateTicketDto = { status: TicketStatus.RESUELTO };

      await expect(ticketService.update(1, dto, 1)).rejects.toThrow(ValidationError);
    });

    it("exige resolvedReason al pasar a resuelto", async () => {
      ticketRepository.findById.mockResolvedValue(
        buildTicket({ status: TicketStatus.EN_PROGRESO }),
      );

      const dto: UpdateTicketDto = { status: TicketStatus.RESUELTO };

      await expect(ticketService.update(1, dto, 1)).rejects.toThrow(
        "Debes indicar el motivo al marcar el ticket como resuelto.",
      );
    });

    it("exige closedReason al cerrar el ticket", async () => {
      ticketRepository.findById.mockResolvedValue(
        buildTicket({ status: TicketStatus.RESUELTO }),
      );

      const dto: UpdateTicketDto = { status: TicketStatus.CERRADO };

      await expect(ticketService.update(1, dto, 1)).rejects.toThrow(
        "Debes indicar el motivo al cerrar el ticket.",
      );
    });

    it("exige modificationReason cuando cambian campos distintos al estado", async () => {
      ticketRepository.findById.mockResolvedValue(buildTicket({ title: "Original" }));

      const dto: UpdateTicketDto = { title: "Nuevo título" };

      await expect(ticketService.update(1, dto, 1)).rejects.toThrow(
        "Debes indicar el motivo de la modificación.",
      );
    });

    it("no hace nada si no hay cambios reales", async () => {
      const ticket = buildTicket({ title: "Igual" });
      ticketRepository.findById.mockResolvedValue(ticket);

      const dto: UpdateTicketDto = { title: "Igual" };
      const result = await ticketService.update(1, dto, 1);

      expect(result.title).toBe("Igual");
      expect(ticketRepository.save).not.toHaveBeenCalled();
    });

    it("aplica una transición de estado válida y registra el historial", async () => {
      const ticket = buildTicket({ status: TicketStatus.EN_PROGRESO });
      ticketRepository.findById.mockResolvedValue(ticket);
      const changedByUser = buildUser({ id: 9, name: "Supervisor" });
      userRepository.findById.mockResolvedValue(changedByUser);
      ticketRepository.save.mockImplementation(async (t) => t);
      const historyEntry = {};
      ticketHistoryRepository.create.mockReturnValue(historyEntry as never);

      const dto: UpdateTicketDto = {
        status: TicketStatus.RESUELTO,
        resolvedReason: "Se corrigió el problema",
      };

      const result = await ticketService.update(1, dto, 9);

      expect(result.status).toBe(TicketStatus.RESUELTO);
      expect(result.isModified).toBe(true);
      expect(result.lastChangedBy?.id).toBe(9);
      expect(ticketHistoryRepository.create).toHaveBeenCalledWith(
        expect.objectContaining({
          previousStatus: TicketStatus.EN_PROGRESO,
          newStatus: TicketStatus.RESUELTO,
          reason: "Se corrigió el problema",
        }),
      );
      expect(ticketHistoryRepository.save).toHaveBeenCalledWith(historyEntry);
    });

    it("actualiza campos normales con modificationReason sin registrar historial", async () => {
      const ticket = buildTicket({ title: "Original" });
      ticketRepository.findById.mockResolvedValue(ticket);
      userRepository.findById.mockResolvedValue(buildUser({ id: 3 }));
      ticketRepository.save.mockImplementation(async (t) => t);

      const dto: UpdateTicketDto = {
        title: "Nuevo título",
        modificationReason: "Se corrigió un typo",
      };

      const result = await ticketService.update(1, dto, 3);

      expect(result.title).toBe("Nuevo título");
      expect(result.isModified).toBe(true);
      expect(ticketHistoryRepository.create).not.toHaveBeenCalled();
    });

    it("lanza NotFoundError si el nuevo usuario asignado no existe", async () => {
      const ticket = buildTicket({ assignedTo: buildUser({ id: 1 }) });
      ticketRepository.findById.mockResolvedValue(ticket);
      userRepository.findById.mockResolvedValue(null);

      const dto: UpdateTicketDto = { assignedTo: 2, modificationReason: "Reasignación" };

      await expect(ticketService.update(1, dto, 1)).rejects.toThrow(NotFoundError);
    });
  });

  describe("delete", () => {
    it("elimina el ticket si existe", async () => {
      ticketRepository.findById.mockResolvedValue(buildTicket({ id: 4 }));

      await ticketService.delete(4);

      expect(ticketRepository.delete).toHaveBeenCalledWith(4);
    });

    it("lanza NotFoundError si el ticket no existe", async () => {
      ticketRepository.findById.mockResolvedValue(null);

      await expect(ticketService.delete(4)).rejects.toThrow(NotFoundError);
      expect(ticketRepository.delete).not.toHaveBeenCalled();
    });
  });
});
