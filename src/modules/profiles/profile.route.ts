import { Router } from "express";
import { profileController } from "./profile.controller";

const router = Router();

export const profileRoute = router;

router.post("/", profileController.createProfie)
router.get("/",profileController.getProfile)