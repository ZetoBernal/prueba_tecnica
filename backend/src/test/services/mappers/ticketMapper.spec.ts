import { toTicketResponse } from "../../../services/mappers/ticketMapper";
import { Ticket, TicketPriority, TicketStatus } from "../../../entities/Ticket";
import { User, UserRole } from "../../../entities/User";

const buildUser = (overrides: Partial<User> = {}): User => ({
  id: 1,
  name: "Ana Pérez",
  email: "ana@example.com",
  passwordHash: "hash",
  role: UserRole.USER,
  createdAt: new Date("2026-01-01T00:00:00Z"),
  updatedAt: new Date("2026-01-01T00:00:00Z"),
  ...overrides,
});

describe("ticketMapper", () => {
  it("mapea un ticket con lastChangedBy nulo", () => {
    const ticket: Ticket = {
      id: 10,
      title: "Error al exportar",
      description: "detalle",
      priority: TicketPriority.ALTA,
      status: TicketStatus.ABIERTO,
      assignedTo: buildUser(),
      resolvedReason: null,
      closedReason: null,
      isModified: false,
      modificationReason: null,
      lastChangedBy: null,
      createdAt: new Date("2026-02-15T14:35:20Z"),
      updatedAt: new Date("2026-02-15T14:35:20Z"),
    };

    const response = toTicketResponse(ticket);

    expect(response.id).toBe(10);
    expect(response.assignedTo.id).toBe(1);
    expect(response.lastChangedBy).toBeNull();
    expect(response.date).toBe("2026-02-15");
    expect(response.time).toBe("14:35:20");
  });

  it("mapea un ticket con lastChangedBy definido", () => {
    const ticket: Ticket = {
      id: 11,
      title: "Otro ticket",
      description: null,
      priority: TicketPriority.CRITICA,
      status: TicketStatus.RESUELTO,
      assignedTo: buildUser({ id: 2 }),
      resolvedReason: "Se corrigió el bug",
      closedReason: null,
      isModified: true,
      modificationReason: "Actualización de estado",
      lastChangedBy: buildUser({ id: 3, name: "Luis" }),
      createdAt: new Date("2026-02-16T09:00:00Z"),
      updatedAt: new Date("2026-02-16T09:10:00Z"),
    };

    const response = toTicketResponse(ticket);

    expect(response.lastChangedBy?.id).toBe(3);
    expect(response.isModified).toBe(true);
    expect(response.resolvedReason).toBe("Se corrigió el bug");
  });
});
