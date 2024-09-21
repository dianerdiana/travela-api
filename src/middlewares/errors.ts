import { AppError } from "@errors/AppError";
import { NextFunction, Request, Response } from "express";
import { ZodError } from "zod";

export const errorMiddleware = (err: Error, req: Request, res: Response, next: NextFunction) => {
  if (err instanceof ZodError) {
    const errorMessages = err.errors.map(
      (issue: any) => `${issue.path.join(".")} is ${issue.message}`
    );

    return res.status(400).json({
      error: true,
      status: "error",
      message: "Invalid Data",
      details: errorMessages,
    });
  }

  if (err instanceof AppError) {
    if (err.isOperational) {
      return res.status(err.statusCode).json({
        error: true,
        status: "error",
        message: err.message,
      });
    }
  }

  console.error("Unexpected Error: ", err);
  return res.status(500).json({
    error: true,
    status: "error",
    message: "An unexpected error occured.",
  });
};
