import { AppDataSource } from "../../config/data-source";
import { UserRepository } from "../../repositories/UserRepository";
import { UserRole } from "../../entities/User";

jest.mock("../../config/data-source", () => ({
  AppDataSource: { getRepository: jest.fn() },
}));

describe("UserRepository", () => {
  const findOne = jest.fn();
  const create = jest.fn();
  const save = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (AppDataSource.getRepository as jest.Mock).mockReturnValue({ findOne, create, save });
  });

  it("findByEmail busca por el campo email", async () => {
    findOne.mockResolvedValue(null);
    const repository = new UserRepository();

    const result = await repository.findByEmail("ana@example.com");

    expect(findOne).toHaveBeenCalledWith({ where: { email: "ana@example.com" } });
    expect(result).toBeNull();
  });

  it("findById busca por el campo id", async () => {
    findOne.mockResolvedValue({ id: 1 });
    const repository = new UserRepository();

    const result = await repository.findById(1);

    expect(findOne).toHaveBeenCalledWith({ where: { id: 1 } });
    expect(result).toEqual({ id: 1 });
  });

  it("create construye y guarda el usuario", async () => {
    const data = { name: "Ana", email: "ana@example.com", passwordHash: "hash", role: UserRole.USER };
    create.mockReturnValue({ ...data, id: 1 });
    save.mockResolvedValue({ ...data, id: 1 });
    const repository = new UserRepository();

    const result = await repository.create(data);

    expect(create).toHaveBeenCalledWith(data);
    expect(save).toHaveBeenCalled();
    expect(result.id).toBe(1);
  });
});
