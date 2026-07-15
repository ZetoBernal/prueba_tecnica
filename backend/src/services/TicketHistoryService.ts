import { TicketHistoryRepository } from "../repositories/TicketHistoryRepository";
import { TicketRepository } from "../repositories/TicketRepository";
import { NotFoundError } from "../utils/errors";
import { toTicketHistoryResponse, TicketHistoryResponse } from "./mappers/ticketHistoryMapper";

export class TicketHistoryService {
  /* istanbul ignore next -- defaults de conveniencia para producción, en tests se inyectan mocks */
  constructor(
    private readonly historyRepository: TicketHistoryRepository = new TicketHistoryRepository(),
    private readonly ticketRepository: TicketRepository = new TicketRepository(),
  ) {}

  async findByTicketId(ticketId: number): Promise<TicketHistoryResponse[]> {
    const ticket = await this.ticketRepository.findById(ticketId);
    if (!ticket) {
      throw new NotFoundError("El ticket indicado no existe.");
    }

    const entries = await this.historyRepository.findByTicketId(ticketId);
    return entries.map((entry) => toTicketHistoryResponse(entry, ticketId));
  }
}
