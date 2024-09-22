import { NextFunction, Request, Response } from "express";
import { RegisterInput } from "@schemas/authSchemas";
import { authService } from "@services/authService";
import { successResponse } from "@utils/successResponse";

export const authController = {
  register: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const registerInput: RegisterInput = req.body;
      const newUser = await authService.register(registerInput);

      res.status(200).json(successResponse(newUser));
    } catch (error) {
      next(error);
    }
  },
};
