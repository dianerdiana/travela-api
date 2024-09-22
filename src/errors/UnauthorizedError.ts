import { AppError } from "./AppError";

export class UnauthorizedError extends AppError {
  private static readonly _statusCode = 401;
  readonly statusCode: number;
  readonly isOperational: boolean;

  constructor(message?: string, code?: number, isOperational?: boolean) {
    super(message || "Not Found");
    this.statusCode = code || UnauthorizedError._statusCode;
    this.isOperational = isOperational || true;
  }
}
