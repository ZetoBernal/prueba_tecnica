import { Router } from "express";
import { ReportController } from "../controllers/ReportController";
import { authenticate } from "../middlewares/authenticate";

const router = Router();
const reportController = new ReportController();

router.use(authenticate);

router.get("/status", reportController.getStatusSummary);
router.get("/priority", reportController.getPrioritySummary);

export default router;
