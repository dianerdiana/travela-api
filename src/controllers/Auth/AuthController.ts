// Core
import { NextFunction, Request, Response } from "express";
import fs from "fs";
import path from "path";

// Validation Schema
import { LoginInput, RegisterInput } from "./AuthSchema";

// Errors
import { BadRequestError } from "@errors/BadRequestError";

// Utils
import { successResponse } from "@utils/successResponse";
import { loginSchema, registerSchema } from "@schemas/authSchemas";
import { AuthService } from "./AuthService";

const UPLOADS_DIR = "/uploads/avatar";

export const register = async (req: Request, res: Response, next: NextFunction) => {
  const filePath = req.file ? `${UPLOADS_DIR}/${req.file.filename}` : null;

  try {
    if (!req.file) {
      throw new BadRequestError("Avatar is required", 400, true);
    }

    // Body Input
    const { avatar, email, fullName, phone, password, confirmPassword }: RegisterInput = {
      ...req.body,
      avatar: filePath,
    };

    // Validate Input
    await registerSchema.parseAsync({ email, fullName, phone, password, confirmPassword });

    // Service
    const newUser = AuthService.register({
      avatar,
      email,
      fullName,
      phone,
      password,
      confirmPassword,
    });

    res.status(201).json(successResponse("Create user successfully.", newUser));
  } catch (error) {
    // Hapus file jika ada error
    if (filePath) {
      fs.unlink(path.join(__dirname, `../../..${filePath}`), (err) => {
        if (err) {
          console.error("Error deleting file:", err);
        }
      });
    }
    next(error);
  }
};

export const login = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { username, password }: LoginInput = req.body;

    // Validate Input
    await loginSchema.parseAsync({ username, password });

    // Service
    const user = AuthService.login({ username, password });

    res.status(200).json(successResponse("Success", user));
  } catch (error) {
    next(error);
  }
};
