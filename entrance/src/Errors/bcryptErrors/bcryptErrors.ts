import { ExtendedError } from "@/Errors/errors";

export class BcryptFuncError extends ExtendedError {
  constructor(message: string, originMessage?: any) {
    super("BcryptFuncError", message, 500, originMessage);
  }
}
