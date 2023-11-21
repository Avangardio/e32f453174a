import { ExtendedError } from "@/Errors/errors";

export class DatabaseRedisError extends ExtendedError {
  constructor(message: string, originMessage?: any) {
    super("DatabaseError", message, 500, originMessage);
  }
}

export class ActiveBlockError extends ExtendedError {
  constructor(message: string, originMessage?: any) {
    super("BlockActiveError", message, 400, originMessage);
  }
}

export class InvalidRequestError extends ExtendedError {
  constructor(message: string, originMessage?: any) {
    super("InvalidRequestError", message, 404, originMessage);
  }
}

export class NotMatchingError extends ExtendedError {
  constructor(message: string, originMessage?: any) {
    super("NotMatchingError", message, 400, originMessage);
  }
}
