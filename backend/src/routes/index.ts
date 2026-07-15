import { Router } from "express";
import authRoutes from "./authRoutes";
import ticketRoutes from "./ticketRoutes";
import reportRoutes from "./reportRoutes";

const router = Router();

router.use("/auth", authRoutes);
router.use("/tickets", ticketRoutes);
router.use("/tickets/summary", reportRoutes);

export default router;
