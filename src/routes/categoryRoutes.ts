import express from "express";
import { validate } from "@middlewares/validate";
import { uploadSingleImage } from "@middlewares/uploadImage";
import { createCategorySchema } from "@schemas/categorySchemas";
import { categoryController } from "@controllers/categoryController";

const router = express.Router();

router.post(
  "/create",
  uploadSingleImage("icon", "icons"),
  validate(createCategorySchema),
  categoryController.createCategory
);

router.get("/:slug", categoryController.getCategory);

export const categoryRoutes = router;
