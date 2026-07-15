import { Transform, Type } from "class-transformer";
import { IsBoolean, IsDateString, IsEnum, IsInt, IsOptional, IsString, Max, Min } from "class-validator";
import { TicketPriority, TicketStatus } from "../../entities/Ticket";

const toBoolean = ({ value }: { value: unknown }): boolean | undefined => {
  if (value === undefined) return undefined;
  if (typeof value === "boolean") return value;
  return value === "true";
};

export class TicketQueryDto {
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  id?: number;

  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsEnum(TicketPriority)
  priority?: TicketPriority;

  @IsOptional()
  @IsEnum(TicketStatus)
  status?: TicketStatus;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  assignedTo?: number;

  @IsOptional()
  @IsDateString()
  date?: string;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  changedBy?: number;

  @IsOptional()
  @Transform(toBoolean)
  @IsBoolean()
  isModified?: boolean;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  pageSize?: number;
}
