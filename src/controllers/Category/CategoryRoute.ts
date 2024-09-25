import express from "express";
import { uploadSingleImage } from "@middlewares/uploadImage";
import { CategoryController } from "@controllers/Category/CategoryController";

const router = express.Router();

// prettier-ignore
{
  router.post(
    "/categories/create",
    uploadSingleImage("icon", "icons"),
    CategoryController.createCategory
  );
  router.get(
    "/categories",
    CategoryController.getCategories
  );
  router.get(
    "/categories/:slug",
    CategoryController.getCategory
  );
  router.put(
    "/categories/update/:categoryId",
    uploadSingleImage("icon", "icons"),
    CategoryController.updateCategory
  );
  router.delete(
    "/delete",
    CategoryController.deleteCategory
  );
}

export const CategoryRoute = router;
