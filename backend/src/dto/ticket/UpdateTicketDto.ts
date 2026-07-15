import { IsEnum, IsInt, IsOptional, IsString, MaxLength, Min } from "class-validator";
import { TicketPriority, TicketStatus } from "../../entities/Ticket";

export class UpdateTicketDto {
  @IsOptional()
  @IsString()
  @MaxLength(200)
  title?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsEnum(TicketPriority, { message: "La prioridad debe ser baja, media, alta o crítica." })
  priority?: TicketPriority;

  @IsOptional()
  @IsEnum(TicketStatus, {
    message: "El estado debe ser abierto, en progreso, resuelto o cerrado.",
  })
  status?: TicketStatus;

  @IsOptional()
  @IsInt()
  @Min(1)
  assignedTo?: number;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  resolvedReason?: string;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  closedReason?: string;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  modificationReason?: string;
}
