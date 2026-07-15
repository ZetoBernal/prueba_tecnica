import { NextFunction, Request, Response } from "express";
import { TicketHistoryService } from "../services/TicketHistoryService";
import { successResponse } from "../utils/apiResponse";
import { ValidationError } from "../utils/errors";

const parseTicketId = (rawId: string): number => {
  const id = Number(rawId);
  if (!Number.isInteger(id) || id < 1) {
    throw new ValidationError("El id del ticket debe ser un entero positivo.");
  }
  return id;
};

export class TicketHistoryController {
  /* istanbul ignore next -- default de conveniencia para producción, en tests se inyecta el mock */
  constructor(
    private readonly ticketHistoryService: TicketHistoryService = new TicketHistoryService(),
  ) {}

  findByTicketId = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const ticketId = parseTicketId(req.params.id);
      const history = await this.ticketHistoryService.findByTicketId(ticketId);
      res.status(200).json(successResponse(history));
    } catch (error) {
      next(error);
    }
  };
}
