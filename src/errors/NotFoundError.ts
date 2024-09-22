import { AppError } from "./AppError";

export class NotFoundError extends AppError {
  private static readonly _statusCode = 404;
  readonly statusCode: number;
  readonly isOperational: boolean;

  constructor(message?: string, code?: number, isOperational?: boolean) {
    super(message || "Not Found");
    this.statusCode = code || NotFoundError._statusCode;
    this.isOperational = isOperational || true;
  }
}
