import { signAuthToken, verifyAuthToken } from "../../utils/jwt";
import { UserRole } from "../../entities/User";

describe("jwt utils", () => {
  it("firma y verifica un token válido", () => {
    const token = signAuthToken({ sub: 42, role: UserRole.ADMIN });
    const payload = verifyAuthToken(token);

    expect(payload.sub).toBe(42);
    expect(payload.role).toBe(UserRole.ADMIN);
  });

  it("lanza un error al verificar un token inválido", () => {
    expect(() => verifyAuthToken("token-invalido")).toThrow();
  });
});
