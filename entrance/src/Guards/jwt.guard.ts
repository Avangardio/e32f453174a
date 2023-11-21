import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { JwtServiceRoot } from "@/Guards/jwt.service";
import { Request } from "express";
import { UnAuthorizedError } from "@/Errors/validationErrors/validationErrors";

@Injectable()
export class JwtGuard implements CanActivate {
  constructor(private jwtService: JwtServiceRoot) {
  }

  async canActivate(context: ExecutionContext) {
    const request: Request = context.switchToHttp().getRequest();
    //Получаем айпи пользователя
    const { ip } = request;
    const response = context.switchToHttp().getResponse();
    //ищем acess токен
    const accessToken = request.cookies.accessToken;
    //если нет - исключение 401
    if (!accessToken) throw new UnAuthorizedError("No token");
    //пытаемся валидировать access токен, в случае успеха - декадируем его, в противном - undefined
    const decodedToken = await this.jwtService.validate(accessToken);

    //если есть рефреш токен и он равен рефреш токену из access токена и айпи совпадает с предыдущим, пытаемся создать новый access
    if (
      !decodedToken &&
      !decodedToken.refresh &&
      decodedToken.fingerprint !== ip
    )
      throw new UnAuthorizedError("Expired or wrong token");

    //Пропускаем запрос дальше, прикрепляя к телу запроса данные userId
    request["userId"] = +decodedToken.userId;
    if (typeof request.body === "undefined") request.body = { userId: +decodedToken.userId };
    else request.body.userId = +decodedToken.userId;
    return true;
  }
}
