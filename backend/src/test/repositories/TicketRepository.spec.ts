import { AppDataSource } from "../../config/data-source";
import { TicketRepository } from "../../repositories/TicketRepository";
import { TicketPriority, TicketStatus } from "../../entities/Ticket";
import { TicketQueryDto } from "../../dto/ticket/TicketQueryDto";

jest.mock("../../config/data-source", () => ({
  AppDataSource: { getRepository: jest.fn() },
}));

const buildQueryBuilderMock = () => {
  const qb: Record<string, jest.Mock> = {};
  qb.leftJoinAndSelect = jest.fn().mockReturnValue(qb);
  qb.andWhere = jest.fn().mockReturnValue(qb);
  qb.orderBy = jest.fn().mockReturnValue(qb);
  qb.skip = jest.fn().mockReturnValue(qb);
  qb.take = jest.fn().mockReturnValue(qb);
  qb.getManyAndCount = jest.fn();
  return qb;
};

describe("TicketRepository", () => {
  const findOne = jest.fn();
  const create = jest.fn();
  const save = jest.fn();
  const deleteFn = jest.fn();
  let createQueryBuilder: jest.Mock;

  beforeEach(() => {
    jest.clearAllMocks();
    createQueryBuilder = jest.fn();
    (AppDataSource.getRepository as jest.Mock).mockReturnValue({
      findOne,
      create,
      save,
      delete: deleteFn,
      createQueryBuilder,
    });
  });

  it("findById incluye las relaciones assignedTo y lastChangedBy", async () => {
    findOne.mockResolvedValue({ id: 1 });
    const repository = new TicketRepository();

    await repository.findById(1);

    expect(findOne).toHaveBeenCalledWith({
      where: { id: 1 },
      relations: ["assignedTo", "lastChangedBy"],
    });
  });

  it("create y save delegan en el repositorio de TypeORM", async () => {
    create.mockReturnValue({ id: 1 });
    save.mockResolvedValue({ id: 1 });
    const repository = new TicketRepository();

    const created = repository.create({ title: "t" });
    const saved = await repository.save(created);

    expect(create).toHaveBeenCalledWith({ title: "t" });
    expect(saved).toEqual({ id: 1 });
  });

  it("delete delega en el repositorio de TypeORM", async () => {
    const repository = new TicketRepository();

    await repository.delete(3);

    expect(deleteFn).toHaveBeenCalledWith(3);
  });

  it("findAll no aplica filtros adicionales cuando el query está vacío", async () => {
    const qb = buildQueryBuilderMock();
    qb.getManyAndCount.mockResolvedValue([[], 0]);
    createQueryBuilder.mockReturnValue(qb);
    const repository = new TicketRepository();

    const query = Object.assign(new TicketQueryDto(), {});
    const result = await repository.findAll(query, 1, 10);

    expect(qb.andWhere).not.toHaveBeenCalled();
    expect(qb.skip).toHaveBeenCalledWith(0);
    expect(qb.take).toHaveBeenCalledWith(10);
    expect(result).toEqual({ items: [], total: 0 });
  });

  it("findAll aplica todos los filtros combinables", async () => {
    const qb = buildQueryBuilderMock();
    qb.getManyAndCount.mockResolvedValue([[{ id: 1 }], 1]);
    createQueryBuilder.mockReturnValue(qb);
    const repository = new TicketRepository();

    const query = Object.assign(new TicketQueryDto(), {
      id: 1,
      title: "error",
      priority: TicketPriority.ALTA,
      status: TicketStatus.ABIERTO,
      assignedTo: 5,
      date: "2026-01-01",
      changedBy: 9,
      isModified: true,
    });

    const result = await repository.findAll(query, 2, 5);

    expect(qb.andWhere).toHaveBeenCalledTimes(8);
    expect(qb.skip).toHaveBeenCalledWith(5);
    expect(qb.take).toHaveBeenCalledWith(5);
    expect(result).toEqual({ items: [{ id: 1 }], total: 1 });
  });
});
