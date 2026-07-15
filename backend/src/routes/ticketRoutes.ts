import { Router } from "express";
import { TicketController } from "../controllers/TicketController";
import { TicketHistoryController } from "../controllers/TicketHistoryController";
import { validateBody, validateQuery } from "../middlewares/validateDto";
import { CreateTicketDto } from "../dto/ticket/CreateTicketDto";
import { UpdateTicketDto } from "../dto/ticket/UpdateTicketDto";
import { TicketQueryDto } from "../dto/ticket/TicketQueryDto";
import { authenticate } from "../middlewares/authenticate";

const router = Router();
const ticketController = new TicketController();
const ticketHistoryController = new TicketHistoryController();

router.use(authenticate);

router.get("/", validateQuery(TicketQueryDto), ticketController.findAll);
router.post("/", validateBody(CreateTicketDto), ticketController.create);
router.get("/:id", ticketController.findOne);
router.patch("/:id", validateBody(UpdateTicketDto), ticketController.update);
router.delete("/:id", ticketController.delete);
router.get("/:id/history", ticketHistoryController.findByTicketId);

export default router;
