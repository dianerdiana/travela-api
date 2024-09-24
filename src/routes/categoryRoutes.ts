import express from "express";
import { validate } from "@middlewares/validate";
import { uploadSingleImage } from "@middlewares/uploadImage";
import { createCategorySchema, updateCategorySchema } from "@schemas/categorySchemas";
import { categoryController } from "@controllers/categoryController";

const router = express.Router();

router.post(
  "/create",
  uploadSingleImage("icon", "icons"),
  validate(createCategorySchema),
  categoryController.createCategory
);

router.get("/", categoryController.getCategories);
router.get("/:slug", categoryController.getCategory);

router.put(
  "/update/:categoryId",
  uploadSingleImage("icon", "icons"),
  validate(updateCategorySchema),
  categoryController.updateCategory
);

export const categoryRoutes = router;
