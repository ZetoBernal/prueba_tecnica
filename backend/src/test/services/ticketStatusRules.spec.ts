import { isValidStatusTransition } from "../../services/ticketStatusRules";
import { TicketStatus } from "../../entities/Ticket";

describe("isValidStatusTransition", () => {
  it("permite las transiciones secuenciales válidas", () => {
    expect(isValidStatusTransition(TicketStatus.ABIERTO, TicketStatus.EN_PROGRESO)).toBe(true);
    expect(isValidStatusTransition(TicketStatus.EN_PROGRESO, TicketStatus.RESUELTO)).toBe(true);
    expect(isValidStatusTransition(TicketStatus.RESUELTO, TicketStatus.CERRADO)).toBe(true);
  });

  it("permite mantener el mismo estado", () => {
    expect(isValidStatusTransition(TicketStatus.ABIERTO, TicketStatus.ABIERTO)).toBe(true);
  });

  it("rechaza saltos de estado no permitidos", () => {
    expect(isValidStatusTransition(TicketStatus.ABIERTO, TicketStatus.RESUELTO)).toBe(false);
    expect(isValidStatusTransition(TicketStatus.ABIERTO, TicketStatus.CERRADO)).toBe(false);
  });

  it("rechaza retrocesos de estado", () => {
    expect(isValidStatusTransition(TicketStatus.CERRADO, TicketStatus.RESUELTO)).toBe(false);
    expect(isValidStatusTransition(TicketStatus.RESUELTO, TicketStatus.EN_PROGRESO)).toBe(false);
  });

  it("no permite transiciones desde cerrado", () => {
    expect(isValidStatusTransition(TicketStatus.CERRADO, TicketStatus.ABIERTO)).toBe(false);
  });
});
