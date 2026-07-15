import { TicketRepository } from "../repositories/TicketRepository";
import { TicketHistoryRepository } from "../repositories/TicketHistoryRepository";
import { UserRepository } from "../repositories/UserRepository";
import { CreateTicketDto } from "../dto/ticket/CreateTicketDto";
import { UpdateTicketDto } from "../dto/ticket/UpdateTicketDto";
import { TicketQueryDto } from "../dto/ticket/TicketQueryDto";
import { NotFoundError, ValidationError } from "../utils/errors";
import { isValidStatusTransition } from "./ticketStatusRules";
import { TicketStatus } from "../entities/Ticket";
import { toTicketResponse, TicketResponse } from "./mappers/ticketMapper";
import { env } from "../utils/env";

export interface PaginationMeta {
  page: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
}

export interface PaginatedTickets {
  items: TicketResponse[];
  meta: PaginationMeta;
}

export class TicketService {
  /* istanbul ignore next -- defaults de conveniencia para producción, en tests se inyectan mocks */
  constructor(
    private readonly ticketRepository: TicketRepository = new TicketRepository(),
    private readonly ticketHistoryRepository: TicketHistoryRepository = new TicketHistoryRepository(),
    private readonly userRepository: UserRepository = new UserRepository(),
  ) {}

  async create(dto: CreateTicketDto): Promise<TicketResponse> {
    const assignedTo = await this.userRepository.findById(dto.assignedTo);
    if (!assignedTo) {
      throw new NotFoundError("El usuario asignado no existe.");
    }

    const ticket = this.ticketRepository.create({
      title: dto.title,
      description: dto.description ?? null,
      priority: dto.priority,
      status: dto.status,
      assignedTo,
      resolvedReason: null,
      closedReason: null,
      isModified: false,
      modificationReason: null,
      lastChangedBy: null,
    });

    const saved = await this.ticketRepository.save(ticket);
    return toTicketResponse(saved);
  }

  async findById(id: number): Promise<TicketResponse> {
    const ticket = await this.ticketRepository.findById(id);
    if (!ticket) {
      throw new NotFoundError("El ticket indicado no existe.");
    }
    return toTicketResponse(ticket);
  }

  async findAll(query: TicketQueryDto): Promise<PaginatedTickets> {
    const page = query.page ?? 1;
    const pageSize = Math.min(query.pageSize ?? env.pagination.defaultPageSize, env.pagination.maxPageSize);

    const { items, total } = await this.ticketRepository.findAll(query, page, pageSize);

    return {
      items: items.map(toTicketResponse),
      meta: {
        page,
        pageSize,
        totalItems: total,
        totalPages: total === 0 ? 0 : Math.ceil(total / pageSize),
      },
    };
  }

  async update(id: number, dto: UpdateTicketDto, currentUserId: number): Promise<TicketResponse> {
    const ticket = await this.ticketRepository.findById(id);
    if (!ticket) {
      throw new NotFoundError("El ticket indicado no existe.");
    }

    const isStatusChanging = dto.status !== undefined && dto.status !== ticket.status;
    const isFieldChanging =
      (dto.title !== undefined && dto.title !== ticket.title) ||
      (dto.description !== undefined && dto.description !== ticket.description) ||
      (dto.priority !== undefined && dto.priority !== ticket.priority) ||
      (dto.assignedTo !== undefined && dto.assignedTo !== ticket.assignedTo.id);

    if (isStatusChanging) {
      const newStatus = dto.status as TicketStatus;
      if (!isValidStatusTransition(ticket.status, newStatus)) {
        throw new ValidationError(
          `No se puede cambiar el estado de "${ticket.status}" a "${newStatus}".`,
        );
      }
      if (newStatus === TicketStatus.RESUELTO && !dto.resolvedReason) {
        throw new ValidationError("Debes indicar el motivo al marcar el ticket como resuelto.");
      }
      if (newStatus === TicketStatus.CERRADO && !dto.closedReason) {
        throw new ValidationError("Debes indicar el motivo al cerrar el ticket.");
      }
    }

    if (isFieldChanging && !dto.modificationReason) {
      throw new ValidationError("Debes indicar el motivo de la modificación.");
    }

    if (!isStatusChanging && !isFieldChanging) {
      return toTicketResponse(ticket);
    }

    const previousStatus = ticket.status;

    if (dto.title !== undefined) ticket.title = dto.title;
    if (dto.description !== undefined) ticket.description = dto.description;
    if (dto.priority !== undefined) ticket.priority = dto.priority;

    if (dto.assignedTo !== undefined && dto.assignedTo !== ticket.assignedTo.id) {
      const assignedTo = await this.userRepository.findById(dto.assignedTo);
      if (!assignedTo) {
        throw new NotFoundError("El usuario asignado no existe.");
      }
      ticket.assignedTo = assignedTo;
    }

    if (isStatusChanging) {
      ticket.status = dto.status as TicketStatus;
      if (dto.resolvedReason !== undefined) ticket.resolvedReason = dto.resolvedReason;
      if (dto.closedReason !== undefined) ticket.closedReason = dto.closedReason;
    }

    const changedByUser = await this.userRepository.findById(currentUserId);
    if (!changedByUser) {
      throw new NotFoundError("El usuario autenticado no existe.");
    }

    ticket.isModified = true;
    ticket.modificationReason = dto.modificationReason ?? ticket.modificationReason;
    ticket.lastChangedBy = changedByUser;

    const saved = await this.ticketRepository.save(ticket);

    if (isStatusChanging) {
      const historyEntry = this.ticketHistoryRepository.create({
        ticket: saved,
        previousStatus,
        newStatus: saved.status,
        reason: dto.resolvedReason ?? dto.closedReason ?? null,
        changedBy: changedByUser,
      });
      await this.ticketHistoryRepository.save(historyEntry);
    }

    return toTicketResponse(saved);
  }

  async delete(id: number): Promise<void> {
    const ticket = await this.ticketRepository.findById(id);
    if (!ticket) {
      throw new NotFoundError("El ticket indicado no existe.");
    }
    await this.ticketRepository.delete(id);
  }
}
