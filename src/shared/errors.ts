/**
 * Custom Error Classes
 *
 * Application-specific errors that are caught by the global error handler
 * in app.ts and converted to appropriate HTTP responses.
 *
 * Usage:
 *   throw new NotFoundError('Order', 'ord_123');  // -> 404: "Order with id 'ord_123' not found"
 *   throw new ValidationError('Invalid status');  // -> 400: "Invalid status"
 */

/**
 * Base application error with HTTP status code.
 * Extend this for specific error types.
 */
export class AppError extends Error {
  constructor(
    message: string,
    public statusCode: number = 500,
    public code?: string
  ) {
    super(message);
    this.name = 'AppError';
    Error.captureStackTrace(this, this.constructor);
  }
}

/**
 * 404 Not Found error.
 * Use when a requested resource doesn't exist.
 */
export class NotFoundError extends AppError {
  constructor(resource: string, id: string) {
    super(`${resource} with id '${id}' not found`, 404, 'NOT_FOUND');
    this.name = 'NotFoundError';
  }
}

/**
 * 400 Validation error.
 * Use for business rule violations (not schema validation - that's handled by Zod).
 */
export class ValidationError extends AppError {
  constructor(message: string) {
    super(message, 400, 'VALIDATION_ERROR');
    this.name = 'ValidationError';
  }
}
