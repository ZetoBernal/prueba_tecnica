import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Ticket, TicketStatus } from "./Ticket";
import { User } from "./User";

@Entity({ name: "ticket_history" })
export class TicketHistory {
  @PrimaryGeneratedColumn()
  id!: number;

  @ManyToOne(() => Ticket, { onDelete: "CASCADE" })
  @JoinColumn({ name: "ticket_id" })
  ticket!: Ticket;

  @Column({ type: "enum", enum: TicketStatus, name: "previous_status" })
  previousStatus!: TicketStatus;

  @Column({ type: "enum", enum: TicketStatus, name: "new_status" })
  newStatus!: TicketStatus;

  @Column({ type: "varchar", length: 500, nullable: true })
  reason!: string | null;

  @ManyToOne(() => User, { eager: true, onDelete: "RESTRICT" })
  @JoinColumn({ name: "changed_by" })
  changedBy!: User;

  @CreateDateColumn({ name: "created_at" })
  createdAt!: Date;
}
