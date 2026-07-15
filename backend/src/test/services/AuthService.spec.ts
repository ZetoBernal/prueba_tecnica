import bcrypt from "bcrypt";
import { AuthService } from "../../services/AuthService";
import { UserRepository } from "../../repositories/UserRepository";
import { RegisterUserDto } from "../../dto/auth/RegisterUserDto";
import { LoginUserDto } from "../../dto/auth/LoginUserDto";
import { User, UserRole } from "../../entities/User";
import { ConflictError, UnauthorizedError } from "../../utils/errors";
import { verifyAuthToken } from "../../utils/jwt";

const buildUserRepositoryMock = (): jest.Mocked<Pick<UserRepository, "findByEmail" | "findById" | "create">> => ({
  findByEmail: jest.fn(),
  findById: jest.fn(),
  create: jest.fn(),
});

const buildUser = (overrides: Partial<User> = {}): User => ({
  id: 1,
  name: "Ana Pérez",
  email: "ana@example.com",
  passwordHash: "hash-almacenado",
  role: UserRole.USER,
  createdAt: new Date(),
  updatedAt: new Date(),
  ...overrides,
});

describe("AuthService", () => {
  let userRepository: jest.Mocked<Pick<UserRepository, "findByEmail" | "findById" | "create">>;
  let authService: AuthService;

  beforeEach(() => {
    userRepository = buildUserRepositoryMock();
    authService = new AuthService(userRepository as unknown as UserRepository);
  });

  describe("register", () => {
    const dto: RegisterUserDto = Object.assign(new RegisterUserDto(), {
      name: "Ana Pérez",
      email: "ana@example.com",
      password: "Segura#123",
      confirmPassword: "Segura#123",
    });

    it("crea el usuario con la contraseña hasheada y devuelve un token", async () => {
      userRepository.findByEmail.mockResolvedValue(null);
      userRepository.create.mockImplementation(async (data) =>
        buildUser({ name: data.name, email: data.email, passwordHash: data.passwordHash }),
      );

      const result = await authService.register(dto);

      expect(userRepository.findByEmail).toHaveBeenCalledWith("ana@example.com");
      const createArg = userRepository.create.mock.calls[0][0];
      expect(createArg.passwordHash).not.toBe(dto.password);
      expect(await bcrypt.compare(dto.password, createArg.passwordHash)).toBe(true);
      expect(result.user.email).toBe("ana@example.com");
      expect(verifyAuthToken(result.token).role).toBe(UserRole.USER);
    });

    it("lanza ConflictError si el correo ya existe", async () => {
      userRepository.findByEmail.mockResolvedValue(buildUser());

      await expect(authService.register(dto)).rejects.toThrow(ConflictError);
      expect(userRepository.create).not.toHaveBeenCalled();
    });
  });

  describe("login", () => {
    const dto: LoginUserDto = Object.assign(new LoginUserDto(), {
      email: "ana@example.com",
      password: "Segura#123",
    });

    it("devuelve token cuando las credenciales son correctas", async () => {
      const passwordHash = await bcrypt.hash(dto.password, 10);
      userRepository.findByEmail.mockResolvedValue(buildUser({ passwordHash }));

      const result = await authService.login(dto);

      expect(result.user.email).toBe("ana@example.com");
      expect(typeof result.token).toBe("string");
    });

    it("lanza UnauthorizedError si el usuario no existe", async () => {
      userRepository.findByEmail.mockResolvedValue(null);

      await expect(authService.login(dto)).rejects.toThrow(UnauthorizedError);
    });

    it("lanza UnauthorizedError si la contraseña es incorrecta", async () => {
      const passwordHash = await bcrypt.hash("otra-contraseña", 10);
      userRepository.findByEmail.mockResolvedValue(buildUser({ passwordHash }));

      await expect(authService.login(dto)).rejects.toThrow(UnauthorizedError);
    });
  });
});
