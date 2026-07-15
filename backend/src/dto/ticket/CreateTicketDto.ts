import { IsEnum, IsInt, IsOptional, IsString, MaxLength, Min } from "class-validator";
import { TicketPriority, TicketStatus } from "../../entities/Ticket";

export class CreateTicketDto {
  @IsString({ message: "El título es requerido." })
  @MaxLength(200)
  title!: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsEnum(TicketPriority, { message: "La prioridad debe ser baja, media, alta o crítica." })
  priority!: TicketPriority;

  @IsEnum(TicketStatus, {
    message: "El estado debe ser abierto, en progreso, resuelto o cerrado.",
  })
  status!: TicketStatus;

  @IsInt({ message: "El usuario asignado es requerido." })
  @Min(1)
  assignedTo!: number;
}
