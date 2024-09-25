import express from "express";
import { AuthRoute } from "@controllers/Auth/AuthRoute";
import { CategoryRoute } from "@controllers/Category/CategoryRoute";

const router = express.Router();

router.use(AuthRoute);
router.use(CategoryRoute);

export const ApiRoutes = router;
