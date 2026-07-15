import "dotenv/config";
import mysql from "mysql2/promise";

const createDatabase = async (): Promise<void> => {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST ?? "localhost",
    port: Number(process.env.DB_PORT ?? 3306),
    user: process.env.DB_USER ?? "root",
    password: process.env.DB_PASSWORD ?? "",
  });

  const databaseName = process.env.DB_NAME ?? "prueba_tecnica_mysql";

  try {
    await connection.query(
      `CREATE DATABASE IF NOT EXISTS \`${databaseName}\` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci`,
    );
    process.stdout.write(`Base de datos "${databaseName}" lista.\n`);
  } finally {
    await connection.end();
  }
};

createDatabase().catch((error: unknown) => {
  process.stderr.write(`Error creando la base de datos: ${String(error)}\n`);
  process.exitCode = 1;
});
