import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { User } from "./User";

export enum TicketPriority {
  BAJA = "baja",
  MEDIA = "media",
  ALTA = "alta",
  CRITICA = "crítica",
}

export enum TicketStatus {
  ABIERTO = "abierto",
  EN_PROGRESO = "en progreso",
  RESUELTO = "resuelto",
  CERRADO = "cerrado",
}

@Entity({ name: "tickets" })
export class Ticket {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: "varchar", length: 200 })
  title!: string;

  @Column({ type: "text", nullable: true })
  description!: string | null;

  @Column({ type: "enum", enum: TicketPriority })
  priority!: TicketPriority;

  @Column({ type: "enum", enum: TicketStatus, default: TicketStatus.ABIERTO })
  status!: TicketStatus;

  @ManyToOne(() => User, { eager: true, onDelete: "RESTRICT" })
  @JoinColumn({ name: "assigned_to" })
  assignedTo!: User;

  @Column({ type: "varchar", length: 500, nullable: true, name: "resolved_reason" })
  resolvedReason!: string | null;

  @Column({ type: "varchar", length: 500, nullable: true, name: "closed_reason" })
  closedReason!: string | null;

  @Column({ type: "boolean", default: false, name: "is_modified" })
  isModified!: boolean;

  @Column({ type: "varchar", length: 500, nullable: true, name: "modification_reason" })
  modificationReason!: string | null;

  @ManyToOne(() => User, { eager: true, nullable: true, onDelete: "SET NULL" })
  @JoinColumn({ name: "last_changed_by" })
  lastChangedBy!: User | null;

  @CreateDateColumn({ name: "created_at" })
  createdAt!: Date;

  @UpdateDateColumn({ name: "updated_at" })
  updatedAt!: Date;
}
