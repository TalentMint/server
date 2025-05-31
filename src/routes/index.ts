import { Router } from "express";
import auth from "./auth";
import talent from "./talent";

const router = Router();

router.use("/auth", auth);
router.use("/talent", talent);

export default router;
