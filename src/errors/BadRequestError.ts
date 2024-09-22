import { AppError } from "./AppError";

export class BadRequestError extends AppError {
  private static readonly _statusCode = 400;
  readonly statusCode: number;
  readonly isOperational: boolean;

  constructor(message?: string, code?: number, isOperational?: boolean) {
    super(message || "Not Found");
    this.statusCode = code || BadRequestError._statusCode;
    this.isOperational = isOperational || true;
  }
}
