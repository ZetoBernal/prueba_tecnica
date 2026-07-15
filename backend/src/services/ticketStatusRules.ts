import { TicketStatus } from "../entities/Ticket";

const ALLOWED_TRANSITIONS: Record<TicketStatus, TicketStatus[]> = {
  [TicketStatus.ABIERTO]: [TicketStatus.EN_PROGRESO],
  [TicketStatus.EN_PROGRESO]: [TicketStatus.RESUELTO],
  [TicketStatus.RESUELTO]: [TicketStatus.CERRADO],
  [TicketStatus.CERRADO]: [],
};

export const isValidStatusTransition = (from: TicketStatus, to: TicketStatus): boolean => {
  if (from === to) {
    return true;
  }
  return ALLOWED_TRANSITIONS[from].includes(to);
};
