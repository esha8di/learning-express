import { Router } from "express";
import { authController } from "./auth.controller";

const router = Router();
router.get("/",authController.getUser)

export const authRoute = router;