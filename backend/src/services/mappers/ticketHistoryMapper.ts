import { TicketHistory } from "../../entities/TicketHistory";
import { TicketStatus } from "../../entities/Ticket";
import { toUserResponse, UserResponse } from "./userMapper";

export interface TicketHistoryResponse {
  id: number;
  ticketId: number;
  previousStatus: TicketStatus;
  newStatus: TicketStatus;
  reason: string | null;
  changedBy: UserResponse;
  date: string;
  time: string;
}

export const toTicketHistoryResponse = (
  entry: TicketHistory,
  ticketId: number,
): TicketHistoryResponse => ({
  id: entry.id,
  ticketId,
  previousStatus: entry.previousStatus,
  newStatus: entry.newStatus,
  reason: entry.reason,
  changedBy: toUserResponse(entry.changedBy),
  date: entry.createdAt.toISOString().slice(0, 10),
  time: entry.createdAt.toISOString().slice(11, 19),
});
