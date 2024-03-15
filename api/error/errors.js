export class InvalidFileUploadTypeError extends Error {
  constructor() {
    super("Provide a right file type")

    this.httpCode = 400;

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, InvalidPropertyError)
    }
  }
}
export class ForbiddenError extends Error {
  constructor() {
    super("You must login to be able to perform this action")

    this.httpCode = 403;

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, InvalidPropertyError)
    }
  }
}
export class NotFoundError extends Error {
  constructor() {
    super("Resource not found")

    this.httpCode = 404;

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, InvalidPropertyError)
    }
  }
}
export class UnauthorizedError extends Error {
  constructor() {
    super("You don't have the permission to perform this action")

    this.httpCode = 401;

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, InvalidPropertyError)
    }
  }
}
export class WrongLoginCredentialsError extends Error {
  constructor() {
    super("Wrong login credentials")

    this.httpCode = 401;

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, InvalidPropertyError)
    }
  }
}
export class InvalidPropertyError extends Error {
  constructor(msg) {
    super(msg)

    this.httpCode = 406;

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, InvalidPropertyError)
    }
  }
}
export class RequiredParameterError extends Error {
  constructor(param) {
    super(`${param} is Required.`)

    this.httpCode = 400;

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, RequiredParameterError)
    }
  }
}
export class DuplicateParameterError extends Error {
  constructor(param) {
    super(`this ${param} already exists.`)

    this.httpCode = 409;
    
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, RequiredParameterError)
    }
  }
}
