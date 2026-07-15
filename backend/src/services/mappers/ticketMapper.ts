import { Ticket, TicketPriority, TicketStatus } from "../../entities/Ticket";
import { toUserResponse, UserResponse } from "./userMapper";

export interface TicketResponse {
  id: number;
  title: string;
  description: string | null;
  priority: TicketPriority;
  status: TicketStatus;
  assignedTo: UserResponse;
  resolvedReason: string | null;
  closedReason: string | null;
  isModified: boolean;
  modificationReason: string | null;
  lastChangedBy: UserResponse | null;
  date: string;
  time: string;
  createdAt: Date;
  updatedAt: Date;
}

const toDateString = (date: Date): string => date.toISOString().slice(0, 10);
const toTimeString = (date: Date): string => date.toISOString().slice(11, 19);

export const toTicketResponse = (ticket: Ticket): TicketResponse => ({
  id: ticket.id,
  title: ticket.title,
  description: ticket.description,
  priority: ticket.priority,
  status: ticket.status,
  assignedTo: toUserResponse(ticket.assignedTo),
  resolvedReason: ticket.resolvedReason,
  closedReason: ticket.closedReason,
  isModified: ticket.isModified,
  modificationReason: ticket.modificationReason,
  lastChangedBy: ticket.lastChangedBy ? toUserResponse(ticket.lastChangedBy) : null,
  date: toDateString(ticket.createdAt),
  time: toTimeString(ticket.createdAt),
  createdAt: ticket.createdAt,
  updatedAt: ticket.updatedAt,
});
