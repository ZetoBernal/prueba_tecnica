import { Repository } from "typeorm";
import { AppDataSource } from "../config/data-source";
import { TicketHistory } from "../entities/TicketHistory";

export class TicketHistoryRepository {
  private readonly repository: Repository<TicketHistory>;

  constructor() {
    this.repository = AppDataSource.getRepository(TicketHistory);
  }

  create(data: Partial<TicketHistory>): TicketHistory {
    return this.repository.create(data);
  }

  async save(entry: TicketHistory): Promise<TicketHistory> {
    return this.repository.save(entry);
  }

  async findByTicketId(ticketId: number): Promise<TicketHistory[]> {
    return this.repository.find({
      where: { ticket: { id: ticketId } },
      relations: ["changedBy"],
      order: { createdAt: "ASC" },
    });
  }
}
