import { ReportRepository } from "../repositories/ReportRepository";
import { TicketPriority, TicketStatus } from "../entities/Ticket";

export interface StatusSummaryItem {
  status: TicketStatus;
  total: number;
}

export interface PrioritySummaryItem {
  priority: TicketPriority;
  total: number;
}

export class ReportService {
  /* istanbul ignore next -- default de conveniencia para producción, en tests se inyecta el mock */
  constructor(private readonly reportRepository: ReportRepository = new ReportRepository()) {}

  async getStatusSummary(): Promise<StatusSummaryItem[]> {
    const rows = await this.reportRepository.countByStatus();
    const counts = new Map(rows.map((row) => [row.status, Number(row.total)]));

    return Object.values(TicketStatus).map((status) => ({
      status,
      total: counts.get(status) ?? 0,
    }));
  }

  async getPrioritySummary(): Promise<PrioritySummaryItem[]> {
    const rows = await this.reportRepository.countByPriority();
    const counts = new Map(rows.map((row) => [row.priority, Number(row.total)]));

    return Object.values(TicketPriority).map((priority) => ({
      priority,
      total: counts.get(priority) ?? 0,
    }));
  }
}
