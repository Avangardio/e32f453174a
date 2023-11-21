import { ExtendedError } from "@/Errors/errors";

export class WrongPasswordError extends ExtendedError {
  constructor(message: string) {
    super("WrongPasswordError", message, 400);
  }
}

export class NotAcceptableError extends ExtendedError {
  constructor(message: string, originMessage?: any) {
    super("NotAcceptableError", message, 406, originMessage);
  }
}

export class UnAuthorizedError extends ExtendedError {
  constructor(message: string, originMessage?: any) {
    super("UnAuthorizedError", message, 401, originMessage);
  }
}
