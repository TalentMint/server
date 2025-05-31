import { Router } from "express";
import { createTalent } from "../controllers/talentController";
import { AuthMiddleware } from "../middlewares/authMiddleware";

const router = Router();

router.post("/", AuthMiddleware, createTalent);


// router.post("/zk", ZKAuthHandler);

export default router;
