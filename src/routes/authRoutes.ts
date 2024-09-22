import express from "express";
import { authController } from "@controllers/authController";
import { validate } from "middlewares/validate";
import { loginSchema, registerSchema } from "@schemas/authSchemas";

const router = express.Router();

router.post("/register", validate(registerSchema), authController.register);
router.post("/login", validate(registerSchema), authController.register);

export const authRoutes = router;
