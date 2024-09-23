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

      await categoryService.createCategory({ ...createCategoryInput, icon });
      res.status(201).json(successResponse("Category created successfuly."));
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
};
