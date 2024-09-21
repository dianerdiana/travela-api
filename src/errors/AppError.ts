export abstract class AppError extends Error {
  abstract readonly statusCode: number;
  abstract readonly isOperational: boolean;

  constructor(message: string) {
    super(message);

    Error.captureStackTrace(this, this.constructor);
  }
}
