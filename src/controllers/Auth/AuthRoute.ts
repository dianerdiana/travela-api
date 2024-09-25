import express from "express";
import { register, login } from "./AuthController";
import { uploadSingleImage } from "@middlewares/uploadImage";

const router = express.Router();

// Prefix
router.use("/auth");

// Routes
router.post("/register", uploadSingleImage("avatar", "avatar"), register);
router.post("/login", login);

export const AuthRoute = router;
