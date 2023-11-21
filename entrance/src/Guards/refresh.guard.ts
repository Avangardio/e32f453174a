import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { JwtServiceRoot } from "@/Guards/jwt.service";
import { Request } from "express";
import TokensRepo from "@/Modules/redis/classes/TokensRepo";
import { v4 as uuidv4 } from "uuid";
import { UnAuthorizedError } from "@/Errors/validationErrors/validationErrors";

@Injectable()
export class RefreshGuard implements CanActivate {
  constructor(
    private tokensRepo: TokensRepo,
    private jwtService: JwtServiceRoot
  ) {
  }

  async canActivate(context: ExecutionContext) {
    const request: Request = context.switchToHttp().getRequest();
    //Получаем айпи пользователя
    const { ip } = request;
    const response = context.switchToHttp().getResponse();
    //ищем refresh токен
    const refreshToken = request.cookies.refreshToken;
    //если нет - исключение 401
    if (!refreshToken) throw new UnAuthorizedError("No token");
    //Проверяем на правильность отпечатка и наличия в редисе
    const refreshData = await this.tokensRepo.getRefreshToken(refreshToken);
    //Если нет токена или отпечаток не совпадает - чистим этот куки
    if (!refreshData || refreshData?.fingerprint !== ip) {
      //response.clearCookie('refreshToken');
      throw new UnAuthorizedError("Wrong token provided");
    }
    //Получаем айди пользователя
    const { userId } = refreshData;
    //Если есть - обновляем, закрепляем данные для контроллера и отдаем новый токен;
    const newRefreshToken = uuidv4();
    //Обновляем данные в редисе
    await this.tokensRepo.setRefreshToken(newRefreshToken, ip, userId);
    //Добавляем в тело запроса
    request["refreshId"] = newRefreshToken;
    //Создаем новый access токен
    const newAccessToken = await this.jwtService.signAccess({
      ...refreshData,
      refresh: newRefreshToken
    });
    request["newAccessToken"] = newAccessToken;
    return true;
  }
}
