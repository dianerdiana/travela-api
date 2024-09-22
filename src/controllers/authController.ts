import { NextFunction, Request, Response } from "express";
import { RegisterInput } from "@schemas/authSchemas";
import { authService } from "@services/authService";
import { successResponse } from "@utils/successResponse";
import { BadRequestError } from "@errors/BadRequestError";

const UPLOADS_DIR = "/uploads/avatar";

export const authController = {
  register: async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!req.file) {
        throw new BadRequestError("No image file is selected!", 400, true);
      }
      const registerInput: RegisterInput = {
        ...req.body,
        avatar: `${UPLOADS_DIR}/${req.file.filename}`,
      };
      console.log({ registerInput });
      const newUser = await authService.register(registerInput);

      res.status(200).json(successResponse(newUser));
    } catch (error) {
      next(error);
    }
  },
};
