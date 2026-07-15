import { validate } from "class-validator";
import { RegisterUserDto } from "../../../dto/auth/RegisterUserDto";

describe("Match validator (usado en RegisterUserDto.confirmPassword)", () => {
  it("no reporta error cuando confirmPassword coincide con password", async () => {
    const dto = Object.assign(new RegisterUserDto(), {
      name: "Ana Pérez",
      email: "ana@example.com",
      password: "Segura#123",
      confirmPassword: "Segura#123",
    });

    const errors = await validate(dto);

    expect(errors).toHaveLength(0);
  });

  it("reporta error cuando confirmPassword no coincide con password", async () => {
    const dto = Object.assign(new RegisterUserDto(), {
      name: "Ana Pérez",
      email: "ana@example.com",
      password: "Segura#123",
      confirmPassword: "Distinta#123",
    });

    const errors = await validate(dto);

    const confirmPasswordError = errors.find((error) => error.property === "confirmPassword");
    expect(confirmPasswordError).toBeDefined();
    expect(confirmPasswordError?.constraints).toEqual(
      expect.objectContaining({ match: "La confirmación de contraseña no coincide." }),
    );
  });
});
