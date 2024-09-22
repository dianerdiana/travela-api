import { NextFunction, Request, Response } from "express";
import { LoginInput, RegisterInput } from "@schemas/authSchemas";
import { authService } from "@services/authService";
import { successResponse } from "@utils/successResponse";
import { BadRequestError } from "@errors/BadRequestError";
import fs from "fs";
import path from "path";

const UPLOADS_DIR = "/uploads/avatar";

export const authController = {
  register: async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!req.file) {
        throw new BadRequestError("Avatar is required", 400, true);
      }
      const registerInput: RegisterInput = {
        ...req.body,
        avatar: `${UPLOADS_DIR}/${req.file.filename}`,
      };
      const newUser = await authService.register(registerInput);

      res.status(201).json(successResponse(newUser));
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
  login: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const loginInput: LoginInput = req.body;
      const user = await authService.login(loginInput);

      res.status(200).json(successResponse(user));
    } catch (error) {
      next(error);
    }
  },
};
