import { Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";

type accessJWT = {
  userId: number | string;
  fingerprint: string;
  refresh: string;
};

@Injectable()
export class JwtServiceRoot {
  constructor(private readonly jwtService: JwtService) {
  }

  async signAccess(options: accessJWT) {
    return await this.jwtService.signAsync(options);
  }

  async validate(token: string) {
    const verifiedToken = await this.jwtService
      .verifyAsync<accessJWT>(token)
      .catch(() => undefined);
    if (!verifiedToken) return undefined;
    return verifiedToken as accessJWT;
  }

  /*
  async validateUserdata(userdata: string) {
    //если жвт невалиден или просрочен
    const verifiedUser = await this.jwtService
      .verifyAsync<userdataJWT>(userdata)
      .catch(() => false);
    //возвращаем false
    if (!verifiedUser) return false;
    const { userid, username } = verifiedUser as userdataJWT;
    //Теперь надо проверить валидность токена из базы данных, ошибки ловятся внутри
    const checkedUser = await this.authService.validateUserid(userid);
    //если пользователь не найден, то возвращаем false
    if (!checkedUser) return false;
    //Иначе, подписываем обновленный куки
    const newToken = await this.signUser(verifiedUser as userdataJWT);
    return { newToken, userid, username };
  }

   */
}
