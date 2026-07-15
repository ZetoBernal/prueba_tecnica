import { Repository } from "typeorm";
import { AppDataSource } from "../config/data-source";
import { Ticket, TicketPriority, TicketStatus } from "../entities/Ticket";

interface RawStatusCount {
  status: TicketStatus;
  total: string;
}

interface RawPriorityCount {
  priority: TicketPriority;
  total: string;
}

export class ReportRepository {
  private readonly repository: Repository<Ticket>;

  constructor() {
    this.repository = AppDataSource.getRepository(Ticket);
  }

  async countByStatus(): Promise<RawStatusCount[]> {
    return this.repository
      .createQueryBuilder("ticket")
      .select("ticket.status", "status")
      .addSelect("COUNT(ticket.id)", "total")
      .groupBy("ticket.status")
      .getRawMany<RawStatusCount>();
  }

  async countByPriority(): Promise<RawPriorityCount[]> {
    return this.repository
      .createQueryBuilder("ticket")
      .select("ticket.priority", "priority")
      .addSelect("COUNT(ticket.id)", "total")
      .groupBy("ticket.priority")
      .getRawMany<RawPriorityCount>();
  }
}
