import "dotenv/config";

interface EnvConfig {
  nodeEnv: string;
  port: number;
  db: {
    host: string;
    port: number;
    user: string;
    password: string;
    name: string;
  };
  jwt: {
    secret: string;
    expiresIn: string;
  };
  corsOrigin: string;
  authRateLimit: {
    windowMs: number;
    max: number;
  };
  pagination: {
    defaultPageSize: number;
    maxPageSize: number;
  };
}

const readRequired = (key: string): string => {
  const value = process.env[key];
  if (value === undefined || value === "") {
    throw new Error(`Falta la variable de entorno requerida: ${key}`);
  }
  return value;
};

export const env: EnvConfig = {
  nodeEnv: process.env.NODE_ENV ?? "development",
  port: Number(process.env.PORT ?? 3000),
  db: {
    host: process.env.DB_HOST ?? "localhost",
    port: Number(process.env.DB_PORT ?? 3306),
    user: process.env.DB_USER ?? "root",
    password: process.env.DB_PASSWORD ?? "",
    name: process.env.DB_NAME ?? "prueba_tecnica_mysql",
  },
  jwt: {
    secret: readRequired("JWT_SECRET"),
    expiresIn: process.env.JWT_EXPIRES_IN ?? "1h",
  },
  corsOrigin: process.env.CORS_ORIGIN ?? "http://localhost:5173",
  authRateLimit: {
    windowMs: Number(process.env.AUTH_RATE_LIMIT_WINDOW_MS ?? 900000),
    max: Number(process.env.AUTH_RATE_LIMIT_MAX ?? 10),
  },
  pagination: {
    defaultPageSize: Number(process.env.DEFAULT_PAGE_SIZE ?? 10),
    maxPageSize: Number(process.env.MAX_PAGE_SIZE ?? 100),
  },
};
