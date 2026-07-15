import { AppDataSource } from "../../config/data-source";
import { TicketHistoryRepository } from "../../repositories/TicketHistoryRepository";

jest.mock("../../config/data-source", () => ({
  AppDataSource: { getRepository: jest.fn() },
}));

describe("TicketHistoryRepository", () => {
  const find = jest.fn();
  const create = jest.fn();
  const save = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (AppDataSource.getRepository as jest.Mock).mockReturnValue({ find, create, save });
  });

  it("create delega en el repositorio de TypeORM", () => {
    create.mockReturnValue({ id: 1 });
    const repository = new TicketHistoryRepository();

    const result = repository.create({ reason: "motivo" });

    expect(create).toHaveBeenCalledWith({ reason: "motivo" });
    expect(result).toEqual({ id: 1 });
  });

  it("save delega en el repositorio de TypeORM", async () => {
    save.mockResolvedValue({ id: 1 });
    const repository = new TicketHistoryRepository();

    const result = await repository.save({ id: 1 } as never);

    expect(save).toHaveBeenCalled();
    expect(result).toEqual({ id: 1 });
  });

  it("findByTicketId consulta ordenado cronológicamente para el ticket dado", async () => {
    find.mockResolvedValue([]);
    const repository = new TicketHistoryRepository();

    await repository.findByTicketId(5);

    expect(find).toHaveBeenCalledWith({
      where: { ticket: { id: 5 } },
      relations: ["changedBy"],
      order: { createdAt: "ASC" },
    });
  });
});
