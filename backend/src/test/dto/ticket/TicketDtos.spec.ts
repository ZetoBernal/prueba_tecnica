import { validate } from "class-validator";
import { CreateTicketDto } from "../../../dto/ticket/CreateTicketDto";
import { UpdateTicketDto } from "../../../dto/ticket/UpdateTicketDto";
import { TicketPriority, TicketStatus } from "../../../entities/Ticket";

describe("CreateTicketDto", () => {
  it("no reporta errores con datos válidos", async () => {
    const dto = Object.assign(new CreateTicketDto(), {
      title: "Error al exportar",
      description: "detalle",
      priority: TicketPriority.ALTA,
      status: TicketStatus.ABIERTO,
      assignedTo: 5,
    });

    const errors = await validate(dto);

    expect(errors).toHaveLength(0);
  });

  it("reporta error si falta el título o la prioridad es inválida", async () => {
    const dto = Object.assign(new CreateTicketDto(), {
      title: "",
      priority: "urgente",
      status: TicketStatus.ABIERTO,
      assignedTo: 5,
    });

    const errors = await validate(dto);
    const properties = errors.map((error) => error.property);

    expect(properties).toEqual(expect.arrayContaining(["priority"]));
  });
});

describe("UpdateTicketDto", () => {
  it("no reporta errores cuando no se envía ningún campo (todos opcionales)", async () => {
    const dto = new UpdateTicketDto();

    const errors = await validate(dto);

    expect(errors).toHaveLength(0);
  });

  it("no reporta errores con una actualización parcial válida", async () => {
    const dto = Object.assign(new UpdateTicketDto(), {
      status: TicketStatus.RESUELTO,
      resolvedReason: "Se corrigió el problema",
      modificationReason: "Cambio de estado",
    });

    const errors = await validate(dto);

    expect(errors).toHaveLength(0);
  });

  it("reporta error si el estado enviado no es un valor del enum", async () => {
    const dto = Object.assign(new UpdateTicketDto(), { status: "pausado" });

    const errors = await validate(dto);

    expect(errors.some((error) => error.property === "status")).toBe(true);
  });
});
