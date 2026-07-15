import "reflect-metadata";
import { DataSource } from "typeorm";
import { User } from "../entities/User";
import { Ticket } from "../entities/Ticket";
import { TicketHistory } from "../entities/TicketHistory";
import { env } from "../utils/env";

export const AppDataSource = new DataSource({
  type: "mysql",
  host: env.db.host,
  port: env.db.port,
  username: env.db.user,
  password: env.db.password,
  database: env.db.name,
  charset: "utf8mb4",
  entities: [User, Ticket, TicketHistory],
  synchronize: env.nodeEnv !== "production",
  logging: false,
});
