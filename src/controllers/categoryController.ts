import { CreateCategoryInput } from "@schemas/categorySchemas";
import { categoryService } from "@services/categoryService";
import { successResponse } from "@utils/successResponse";
import { Request, Response, NextFunction } from "express";
import fs from "fs";
import path from "path";

const UPLOADS_DIR = "/uploads/icons";

export const categoryController = {
  createCategory: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const createCategoryInput: CreateCategoryInput = req.body;
      const icon = req.file ? `${UPLOADS_DIR}/${req.file.filename}` : null;

      const newCategory = await categoryService.createCategory({ ...createCategoryInput, icon });
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
};
