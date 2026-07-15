import { AppDataSource } from "../../config/data-source";
import { ReportRepository } from "../../repositories/ReportRepository";

jest.mock("../../config/data-source", () => ({
  AppDataSource: { getRepository: jest.fn() },
}));

const buildQueryBuilderMock = () => {
  const qb: Record<string, jest.Mock> = {};
  qb.select = jest.fn().mockReturnValue(qb);
  qb.addSelect = jest.fn().mockReturnValue(qb);
  qb.groupBy = jest.fn().mockReturnValue(qb);
  qb.getRawMany = jest.fn();
  return qb;
};

describe("ReportRepository", () => {
  it("countByStatus agrupa por estado", async () => {
    const qb = buildQueryBuilderMock();
    qb.getRawMany.mockResolvedValue([{ status: "abierto", total: "2" }]);
    (AppDataSource.getRepository as jest.Mock).mockReturnValue({
      createQueryBuilder: jest.fn().mockReturnValue(qb),
    });

    const repository = new ReportRepository();
    const result = await repository.countByStatus();

    expect(qb.select).toHaveBeenCalledWith("ticket.status", "status");
    expect(qb.groupBy).toHaveBeenCalledWith("ticket.status");
    expect(result).toEqual([{ status: "abierto", total: "2" }]);
  });

  it("countByPriority agrupa por prioridad", async () => {
    const qb = buildQueryBuilderMock();
    qb.getRawMany.mockResolvedValue([{ priority: "alta", total: "1" }]);
    (AppDataSource.getRepository as jest.Mock).mockReturnValue({
      createQueryBuilder: jest.fn().mockReturnValue(qb),
    });

    const repository = new ReportRepository();
    const result = await repository.countByPriority();

    expect(qb.select).toHaveBeenCalledWith("ticket.priority", "priority");
    expect(qb.groupBy).toHaveBeenCalledWith("ticket.priority");
    expect(result).toEqual([{ priority: "alta", total: "1" }]);
  });
});
