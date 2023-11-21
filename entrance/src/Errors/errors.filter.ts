import { ArgumentsHost, BadRequestException, Catch, ExceptionFilter } from "@nestjs/common";
import { ExtendedError } from "@/Errors/errors";
import { Request, Response } from "express";

@Catch(ExtendedError, BadRequestException) // Ловим только ошибки этого типа
export class ExtendedErrorFilter implements ExceptionFilter {
  catch(error: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    response.status(error?.code ?? 500).json({
      isSucceed: false,
      name: error.name,
      code: error?.code ?? 500,
      message: error.message || "SERVER_ERROR"
    }); // Возвращаем объект ошибки
  }
}
