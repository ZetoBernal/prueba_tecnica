import bcrypt from "bcrypt";
import { UserRepository } from "../repositories/UserRepository";
import { RegisterUserDto } from "../dto/auth/RegisterUserDto";
import { LoginUserDto } from "../dto/auth/LoginUserDto";
import { UserRole } from "../entities/User";
import { ConflictError, UnauthorizedError } from "../utils/errors";
import { signAuthToken } from "../utils/jwt";
import { toUserResponse, UserResponse } from "./mappers/userMapper";

const SALT_ROUNDS = 10;

export interface AuthResult {
  user: UserResponse;
  token: string;
}

export class AuthService {
  /* istanbul ignore next -- default de conveniencia para producción, en tests se inyecta el mock */
  constructor(private readonly userRepository: UserRepository = new UserRepository()) {}

  async register(dto: RegisterUserDto): Promise<AuthResult> {
    const existingUser = await this.userRepository.findByEmail(dto.email);
    if (existingUser) {
      throw new ConflictError("El correo electrónico ya está registrado.");
    }

    const passwordHash = await bcrypt.hash(dto.password, SALT_ROUNDS);
    const user = await this.userRepository.create({
      name: dto.name,
      email: dto.email,
      passwordHash,
      role: UserRole.USER,
    });

    const token = signAuthToken({ sub: user.id, role: user.role });
    return { user: toUserResponse(user), token };
  }

  async login(dto: LoginUserDto): Promise<AuthResult> {
    const user = await this.userRepository.findByEmail(dto.email);
    if (!user) {
      throw new UnauthorizedError("Credenciales incorrectas.");
    }

    const isPasswordValid = await bcrypt.compare(dto.password, user.passwordHash);
    if (!isPasswordValid) {
      throw new UnauthorizedError("Credenciales incorrectas.");
    }

    const token = signAuthToken({ sub: user.id, role: user.role });
    return { user: toUserResponse(user), token };
  }
}
