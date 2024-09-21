import { NextFunction, Request, Response } from "express";
import { ZodSchema } from "zod";

export const validate =
  (schema: ZodSchema) => (req: Request, Res: Response, next: NextFunction) => {
    schema.parse(req.body);
    next();
  };
