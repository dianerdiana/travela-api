import { successResponse } from "@utils/successResponse";
import { Request, Response, NextFunction } from "express";
import { CategoryService } from "./CategoryService";
import fs from "fs";
import path from "path";

const UPLOADS_DIR = "/uploads/icons";

export const CategoryController = {
  createCategory: async (req: Request, res: Response, next: NextFunction) => {
    const iconPath = req.file ? `${UPLOADS_DIR}/${req.file.filename}` : null;
    try {
      const { name } = req.body;

      const newCategory = await CategoryService.createCategory({ name, icon: iconPath });

      res.status(201).json(successResponse("Category created successfuly.", newCategory));
    } catch (error) {
      if (iconPath) {
        fs.unlink(path.join(__dirname, `../../..${iconPath}`), (err) => {
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

      const category = await CategoryService.getCategory(slug);
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

      const category = await CategoryService.getCategories({
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

      const updatedCategory = await CategoryService.updateCategory({
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

      const totalDeleted = await CategoryService.deleteCategories({ categoryIds });
      res
        .status(200)
        .json(successResponse(`${totalDeleted} categories has been deleted`, totalDeleted));
    } catch (error) {
      next(error);
    }
  },
};
