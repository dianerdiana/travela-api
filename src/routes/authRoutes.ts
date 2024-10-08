import express from "express";
import { validate } from "@middlewares/validate";
import { authController } from "@controllers/authController";
import { loginSchema, registerSchema } from "@schemas/authSchemas";
import { uploadSingleImage } from "@middlewares/uploadImage";

const router = express.Router();

router.post(
  "/register",
  uploadSingleImage("avatar", "avatar"),
  validate(registerSchema),
  authController.register
);
router.post("/login", validate(loginSchema), authController.login);

export const authRoutes = router;
