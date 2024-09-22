import { NextFunction, Request, Response } from "express";
import { ZodSchema } from "zod";

export const validate =
  (schema: ZodSchema) => async (req: Request, Res: Response, next: NextFunction) => {
    try {
      await schema.parse(req.body);
      next();
    } catch (error) {
      next(error);
    }
  };
