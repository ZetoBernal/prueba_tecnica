import { toUserResponse } from "../../../services/mappers/userMapper";
import { User, UserRole } from "../../../entities/User";

describe("userMapper", () => {
  it("mapea un User a UserResponse sin exponer passwordHash", () => {
    const user: User = {
      id: 1,
      name: "Ana Pérez",
      email: "ana@example.com",
      passwordHash: "hash-secreto",
      role: UserRole.ADMIN,
      createdAt: new Date("2026-01-01T10:00:00Z"),
      updatedAt: new Date("2026-01-01T10:00:00Z"),
    };

    const response = toUserResponse(user);

    expect(response).toEqual({
      id: 1,
      name: "Ana Pérez",
      email: "ana@example.com",
      role: UserRole.ADMIN,
      createdAt: user.createdAt,
    });
    expect(response).not.toHaveProperty("passwordHash");
  });
});
