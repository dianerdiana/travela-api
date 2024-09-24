import { categoryService } from "@services/categoryService";
import { successResponse } from "@utils/successResponse";
import { Request, Response, NextFunction } from "express";
import fs from "fs";
import path from "path";

const UPLOADS_DIR = "/uploads/icons";

export const categoryController = {
  createCategory: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { name } = req.body;
      const icon = req.file ? `${UPLOADS_DIR}/${req.file.filename}` : null;

      const newCategory = await categoryService.createCategory({ name, icon });
      res.status(201).json(successResponse("Category created successfuly.", newCategory));
    } catch (error) {
      if (req.file?.filename) {
        fs.unlink(path.join(__dirname, `../..${UPLOADS_DIR}/${req.file.filename}`), (err) => {
          if (err) {
            console.error("Error deleting file:", err);
          }
        });
      }
      next(error);
    }
  },
  getCategory: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { slug } = req.params;

      const category = await categoryService.getCategory(slug);
      res.status(200).json(successResponse("Success", category));
    } catch (error) {
      next(error);
    }
  },
  getCategories: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const {
        pageSize = "10",
        order = "asc",
        page = "1",
        sort = "name",
        search = null,
      } = req.query;

      const category = await categoryService.getCategories({
        pageSize: pageSize as string,
        order: order as string,
        page: page as string,
        sort: sort as string,
        search: search as string,
      });

      res.status(200).json(successResponse("Success", category));
    } catch (error) {
      next(error);
    }
  },
  updateCategory: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { name } = req.body;
      const { categoryId } = req.params;
      const icon = req.file ? `${UPLOADS_DIR}/${req.file.filename}` : null;

      const updatedCategory = await categoryService.updateCategory({
        categoryId: Number(categoryId),
        name,
        icon,
      });
      res.status(200).json(successResponse("Category update successfuly.", updatedCategory));
    } catch (error) {
      if (req.file?.filename) {
        fs.unlink(path.join(__dirname, `../..${UPLOADS_DIR}/${req.file.filename}`), (err) => {
          if (err) {
            console.error("Error deleting file:", err);
          }
        });
      }
      next(error);
    }
  },
  deleteCategory: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { categoryIds } = req.body;

      const totalDeleted = await categoryService.deleteCategories({ categoryIds });
      res
        .status(200)
        .json(successResponse(`${totalDeleted} categories has been deleted`, totalDeleted));
    } catch (error) {
      next(error);
    }
  },
};
