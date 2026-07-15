jest.mock("dotenv/config", () => ({}));

describe("env", () => {
  const originalEnv = { ...process.env };

  afterEach(() => {
    process.env = { ...originalEnv };
    jest.resetModules();
  });

  it("carga valores por defecto cuando las variables opcionales no están definidas", () => {
    process.env.JWT_SECRET = "secret-de-prueba";
    delete process.env.PORT;
    delete process.env.DB_HOST;

    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { env } = require("../../utils/env") as typeof import("../../utils/env");

    expect(env.port).toBe(3000);
    expect(env.db.host).toBe("localhost");
    expect(env.jwt.secret).toBe("secret-de-prueba");
  });

  it("lanza un error si falta JWT_SECRET", () => {
    delete process.env.JWT_SECRET;
    jest.resetModules();

    expect(() => {
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      require("../../utils/env");
    }).toThrow("Falta la variable de entorno requerida: JWT_SECRET");
  });
});
