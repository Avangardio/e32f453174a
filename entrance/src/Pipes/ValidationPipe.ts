import { Injectable, ValidationPipe } from "@nestjs/common";
import { NotAcceptableError } from "@/Errors/validationErrors/validationErrors";
import { ValidationError } from "class-validator";

@Injectable()
export class ValidationPipeExt extends ValidationPipe {
  constructor() {
    super({
      transform: true,
      forbidNonWhitelisted: true,
      whitelist: false,
      exceptionFactory: (errors: ValidationError[]) =>
        new NotAcceptableError(errors.join(",")),
      skipUndefinedProperties: false
    });
  }
}
