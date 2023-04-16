export class Unauthorized extends Error {
  constructor(message: string) {
    super(message);
    this.name = "UnauthorizedError";
  }

  static is(error: Error): error is Unauthorized {
    return error.name === "UnauthorizedError";
  }
}

export class Forbidden extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ForbiddenError";
  }

  static is(error: Error): error is Forbidden {
    return error.name === "ForbiddenError";
  }
}

export class Validation extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ValidationError";
  }

  static is(error: Error): error is Validation {
    return error.name === "ValidationError";
  }
}

export const Codes = {
  401: Unauthorized,
  403: Forbidden,
  422: Validation,
} as const;
