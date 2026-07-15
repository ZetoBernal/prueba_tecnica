import { toTicketHistoryResponse } from "../../../services/mappers/ticketHistoryMapper";
import { TicketHistory } from "../../../entities/TicketHistory";
import { TicketStatus } from "../../../entities/Ticket";
import { User, UserRole } from "../../../entities/User";

describe("ticketHistoryMapper", () => {
  it("mapea una entrada de historial incluyendo el usuario que cambió el estado", () => {
    const changedBy: User = {
      id: 5,
      name: "Carlos",
      email: "carlos@example.com",
      passwordHash: "hash",
      role: UserRole.USER,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const entry: TicketHistory = {
      id: 1,
      ticket: { id: 20 } as TicketHistory["ticket"],
      previousStatus: TicketStatus.ABIERTO,
      newStatus: TicketStatus.EN_PROGRESO,
      reason: null,
      changedBy,
      createdAt: new Date("2026-03-01T08:15:30Z"),
    };

    const response = toTicketHistoryResponse(entry, 20);

    expect(response).toEqual({
      id: 1,
      ticketId: 20,
      previousStatus: TicketStatus.ABIERTO,
      newStatus: TicketStatus.EN_PROGRESO,
      reason: null,
      changedBy: {
        id: 5,
        name: "Carlos",
        email: "carlos@example.com",
        role: UserRole.USER,
        createdAt: changedBy.createdAt,
      },
      date: "2026-03-01",
      time: "08:15:30",
    });
  });
});
