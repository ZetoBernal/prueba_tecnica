import { NextFunction, Request, Response } from "express";
import { TicketService } from "../services/TicketService";
import { CreateTicketDto } from "../dto/ticket/CreateTicketDto";
import { UpdateTicketDto } from "../dto/ticket/UpdateTicketDto";
import { TicketQueryDto } from "../dto/ticket/TicketQueryDto";
import { successResponse } from "../utils/apiResponse";
import { UnauthorizedError, ValidationError } from "../utils/errors";

const parseTicketId = (rawId: string): number => {
  const id = Number(rawId);
  if (!Number.isInteger(id) || id < 1) {
    throw new ValidationError("El id del ticket debe ser un entero positivo.");
  }
  return id;
};

export class TicketController {
  /* istanbul ignore next -- default de conveniencia para producción, en tests se inyecta el mock */
  constructor(private readonly ticketService: TicketService = new TicketService()) {}

  create = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const dto = req.body as CreateTicketDto;
      const ticket = await this.ticketService.create(dto);
      res.status(201).json(successResponse(ticket));
    } catch (error) {
      next(error);
    }
  };

  findAll = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const query = (req.validatedQuery ?? {}) as TicketQueryDto;
      const result = await this.ticketService.findAll(query);
      res.status(200).json(successResponse(result));
    } catch (error) {
      next(error);
    }
  };

  findOne = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const id = parseTicketId(req.params.id);
      const ticket = await this.ticketService.findById(id);
      res.status(200).json(successResponse(ticket));
    } catch (error) {
      next(error);
    }
  };

  update = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const id = parseTicketId(req.params.id);
      const dto = req.body as UpdateTicketDto;
      if (!req.user) {
        throw new UnauthorizedError();
      }
      const ticket = await this.ticketService.update(id, dto, req.user.id);
      res.status(200).json(successResponse(ticket));
    } catch (error) {
      next(error);
    }
  };

  delete = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const id = parseTicketId(req.params.id);
      await this.ticketService.delete(id);
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  };
}
