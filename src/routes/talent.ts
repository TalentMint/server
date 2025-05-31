import { Router } from "express";
import {
    createTalent,
    fetchTalents,
    getTalentDetails,
    mintTalent,
} from "../controllers/talentController";
import { AuthMiddleware } from "../middlewares/authMiddleware";

const router = Router();

router.get("/", fetchTalents);
router.post("/", AuthMiddleware, createTalent);

router.post("/mint", AuthMiddleware, mintTalent);

router.get("/:talentID", getTalentDetails);
router.post("/:talentID/mint", AuthMiddleware, mintTalent);
// router.post("/zk", ZKAuthHandler);

export default router;
