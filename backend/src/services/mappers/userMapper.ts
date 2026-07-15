import { User, UserRole } from "../../entities/User";

export interface UserResponse {
  id: number;
  name: string;
  email: string;
  role: UserRole;
  createdAt: Date;
}

export const toUserResponse = (user: User): UserResponse => ({
  id: user.id,
  name: user.name,
  email: user.email,
  role: user.role,
  createdAt: user.createdAt,
});
