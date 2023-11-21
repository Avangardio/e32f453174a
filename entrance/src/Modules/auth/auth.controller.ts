import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  Res,
  UseFilters,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { AuthService } from '@/Modules/auth/auth.service';
import { ConfigService } from '@nestjs/config';
import { JwtServiceRoot } from '@/Guards/jwt.service';
import { LoginBodyDto } from '@/DTO/auth/login';
import { Request, Response } from 'express';
import { RefreshGuard } from '@/Guards/refresh.guard';
import { RegistrationBodyDto } from '@/DTO/auth/registration';
import { ExtendedErrorFilter } from '@/Errors/errors.filter';
import { RefreshTokenDTO } from '@/Modules/redis/dto/tokensDTO';
import TokensRepo from '@/Modules/redis/classes/TokensRepo';
import { v4 as uuidv4 } from 'uuid';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly configService: ConfigService,
    private readonly jwtServiceRoot: JwtServiceRoot,
    private tokensRepo: TokensRepo,
  ) {}

  @Get('authenticate')
  @UseGuards(RefreshGuard)
  authentication(
    @Req() request: Request,
    @Res({ passthrough: true }) response: Response,
  ) {
    const newAccessToken = request['newAccessToken'] as string;
    const newRefreshTokenId = request['refreshId'] as string;

    //отдаем новый рефреш токен
    response.cookie('refreshToken', newRefreshTokenId, {
      httpOnly: true,
      path: '/',
      maxAge: 86400 * 1000 * 3,
    });
    //Отдаем новый access токен
    response.cookie('accessToken', newAccessToken, {
      httpOnly: true,
      path: '/',
      maxAge: 60 * 1000 * 3,
    });
    response.status(200);
    return 'Auth success';
  }

  @Post('registration')
  @UsePipes(ValidationPipe)
  @UseFilters(ExtendedErrorFilter)
  async registration(
    @Body() body: RegistrationBodyDto,
    @Req() request: Request,
    @Res({ passthrough: true }) response: Response,
  ) {
    const newUser = await this.authService.registerUser(body);
    response.status(newUser.code);
    return newUser;
  }

  @Post('login')
  @UseFilters(ExtendedErrorFilter)
  @UsePipes(ValidationPipe)
  async login(
    @Body() body: LoginBodyDto,
    @Req() request: Request,
    @Res({ passthrough: true }) response: Response,
  ) {
    //Выполняем метод логина
    const result = await this.authService.login(body);
    //Проверяем, успешно ли прошел проверку пользователь
    if (result.code === 200) {
      const { code, message, isSucceed, payload } = result;
      const newRefreshToken: RefreshTokenDTO = {
        userId: result.payload.userId.toString(),
        fingerprint: request.ip,
      };
      const newRefreshId = uuidv4();
      //Добавляем токен в редис
      await this.tokensRepo.setRefreshToken(
        newRefreshId,
        newRefreshToken.fingerprint,
        newRefreshToken.userId,
      );
      //отправляем токен на 3 дня
      response.cookie('refreshToken', newRefreshId, {
        httpOnly: true,
        path: '/',
        maxAge: 86400 * 1000 * 3,
      });
      response.status(result.code);
      //возвращаем часть ответа
      return {
        code,
        message,
        isSucceed,
      };
    }
    //Отдаем код результата
    response.status(result.code);
    //Возвращаем результат
    return result;
  }
  @Get('logout')
  async logoutUser(@Res({ passthrough: true }) response: Response) {
    //удаляем куки
    response.clearCookie('refreshToken');
    response.clearCookie('accessToken');
    //возвращаем ответ
    response.status(200);
    return 'OK';
  }
}
