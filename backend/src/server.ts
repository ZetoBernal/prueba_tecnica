import "reflect-metadata";
import { createApp } from "./app";
import { AppDataSource } from "./config/data-source";
import { env } from "./utils/env";
import { logger } from "./utils/logger";

const start = async (): Promise<void> => {
  await AppDataSource.initialize();
  logger.info("Conexión a la base de datos establecida.");

  const app = createApp();
  app.listen(env.port, () => {
    logger.info(`Servidor escuchando en el puerto ${env.port}.`);
  });
};

start().catch((error: unknown) => {
  logger.error({ err: error }, "Error al iniciar el servidor.");
  process.exitCode = 1;
});
