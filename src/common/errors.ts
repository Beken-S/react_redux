const enum ERROR_CODE {
  BadRequestError = 400,
  NotFoundError = 404,
  InvalidResponseError = 1000,
  NetworkError = 1001,
  TypeError = 4000,
  SyntaxError = 4001,
  InvalidDataLength = 4002,
  UnexpectedError = 5000,
  UnknownError = 5001,
}

class BaseError extends Error {
  constructor(
    public readonly code: ERROR_CODE,
    public readonly message: string,
    public readonly originalError?: Error
  ) {
    super(message);
    this.code = code;
  }
}

class BadRequestError extends BaseError {
  constructor(message: string) {
    super(ERROR_CODE.BadRequestError, message);
  }
}

class NotFoundError extends BaseError {
  constructor(message: string) {
    super(ERROR_CODE.NotFoundError, message);
  }
}

class InvalidResponseError extends BaseError {
  constructor(message: string) {
    super(ERROR_CODE.InvalidResponseError, message);
  }
}

class NetworkError extends BaseError {
  constructor(message: string) {
    super(ERROR_CODE.NetworkError, message);
  }
}

class TypeError extends BaseError {
  constructor(message: string) {
    super(ERROR_CODE.TypeError, message);
  }
}

class SyntaxError extends BaseError {
  constructor(message: string) {
    super(ERROR_CODE.SyntaxError, message);
  }
}

class UnexpectedError extends BaseError {
  constructor(message: string) {
    super(ERROR_CODE.UnexpectedError, message);
  }
}

class UnknownError extends BaseError {
  constructor(message: string) {
    super(ERROR_CODE.UnknownError, message);
  }
}

class InvalidDataLength extends BaseError {
  constructor(message: string) {
    super(ERROR_CODE.InvalidDataLength, message);
  }
}

export {
  ERROR_CODE,
  BaseError,
  BadRequestError,
  NotFoundError,
  NetworkError,
  InvalidResponseError,
  TypeError,
  SyntaxError,
  UnexpectedError,
  UnknownError,
  InvalidDataLength,
};
