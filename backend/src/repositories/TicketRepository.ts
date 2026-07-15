import { Repository, SelectQueryBuilder } from "typeorm";
import { AppDataSource } from "../config/data-source";
import { Ticket } from "../entities/Ticket";
import { TicketQueryDto } from "../dto/ticket/TicketQueryDto";

export interface PaginatedResult<T> {
  items: T[];
  total: number;
}

export class TicketRepository {
  private readonly repository: Repository<Ticket>;

  constructor() {
    this.repository = AppDataSource.getRepository(Ticket);
  }

  async findById(id: number): Promise<Ticket | null> {
    return this.repository.findOne({
      where: { id },
      relations: ["assignedTo", "lastChangedBy"],
    });
  }

  create(data: Partial<Ticket>): Ticket {
    return this.repository.create(data);
  }

  async save(ticket: Ticket): Promise<Ticket> {
    return this.repository.save(ticket);
  }

  async delete(id: number): Promise<void> {
    await this.repository.delete(id);
  }

  async findAll(
    query: TicketQueryDto,
    page: number,
    pageSize: number,
  ): Promise<PaginatedResult<Ticket>> {
    const qb = this.buildFilterQuery(query);
    qb.orderBy("ticket.createdAt", "DESC")
      .skip((page - 1) * pageSize)
      .take(pageSize);

    const [items, total] = await qb.getManyAndCount();
    return { items, total };
  }

  private buildFilterQuery(query: TicketQueryDto): SelectQueryBuilder<Ticket> {
    const qb = this.repository
      .createQueryBuilder("ticket")
      .leftJoinAndSelect("ticket.assignedTo", "assignedTo")
      .leftJoinAndSelect("ticket.lastChangedBy", "lastChangedBy");

    if (query.id !== undefined) {
      qb.andWhere("ticket.id = :id", { id: query.id });
    }
    if (query.title) {
      qb.andWhere("ticket.title LIKE :title", { title: `%${query.title}%` });
    }
    if (query.priority) {
      qb.andWhere("ticket.priority = :priority", { priority: query.priority });
    }
    if (query.status) {
      qb.andWhere("ticket.status = :status", { status: query.status });
    }
    if (query.assignedTo !== undefined) {
      qb.andWhere("assignedTo.id = :assignedTo", { assignedTo: query.assignedTo });
    }
    if (query.date) {
      qb.andWhere("DATE(ticket.createdAt) = :date", { date: query.date });
    }
    if (query.changedBy !== undefined) {
      qb.andWhere("lastChangedBy.id = :changedBy", { changedBy: query.changedBy });
    }
    if (query.isModified !== undefined) {
      qb.andWhere("ticket.isModified = :isModified", { isModified: query.isModified });
    }

    return qb;
  }
}
