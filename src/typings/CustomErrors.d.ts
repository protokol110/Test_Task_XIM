export class CustomError extends Error {
  statusCode: number;
  details?: any;

  constructor(message: string, statusCode: number = 500, details?: any) {
    super(message);
    this.statusCode = statusCode;
    this.name = 'CustomError';
    this.details = details;
  }
}

export class NotFoundError extends CustomError {
  constructor(message: string = 'Resource not found', details?: any) {
    super(message, 404, details);
    this.name = 'NotFoundError';
  }
}

export class UnauthorizedError extends CustomError {
  constructor(message: string = 'Unauthorized access', details?: any) {
    super(message, 401, details);
    this.name = 'UnauthorizedError';
  }
}

export class ForbiddenError extends CustomError {
  constructor(message: string = 'Access forbidden', details?: any) {
    super(message, 403, details);
    this.name = 'ForbiddenError';
  }
}

export class VerificationError extends CustomError {
  constructor(message: string = 'Verification failed', details?: any) {
    super(message, 400, details);
    this.name = 'VerificationError';
  }
}
