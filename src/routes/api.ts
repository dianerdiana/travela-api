import express from "express";
import { authRoutes } from "./authRoutes";

const router = express.Router();

router.use("/", authRoutes);

export const ApiRoutes = router;
