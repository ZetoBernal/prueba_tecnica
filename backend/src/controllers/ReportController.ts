import { NextFunction, Request, Response } from "express";
import { ReportService } from "../services/ReportService";
import { successResponse } from "../utils/apiResponse";

export class ReportController {
  /* istanbul ignore next -- default de conveniencia para producción, en tests se inyecta el mock */
  constructor(private readonly reportService: ReportService = new ReportService()) {}

  getStatusSummary = async (_req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const summary = await this.reportService.getStatusSummary();
      res.status(200).json(successResponse(summary));
    } catch (error) {
      next(error);
    }
  };

  getPrioritySummary = async (
    _req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const summary = await this.reportService.getPrioritySummary();
      res.status(200).json(successResponse(summary));
    } catch (error) {
      next(error);
    }
  };
}
