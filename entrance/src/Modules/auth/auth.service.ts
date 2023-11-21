import { Injectable } from '@nestjs/common';
import PostgresService from '@/Modules/postgres/postgres.service';
import {
  RegistrationBodyDto,
  RegistrationOutputDto,
} from '@/DTO/auth/registration';
import { LoginBodyDto, LoginOutputDto } from '@/DTO/auth/login';
import validatePassword from '@/Utils/password/validatePassword';
import hashPasswordWithSalt from '@/Utils/password/hashPassword';

@Injectable()
export class AuthService {
  constructor(private readonly postgresService: PostgresService) {}

  async registerUser(
    user: RegistrationBodyDto,
  ): Promise<RegistrationOutputDto> {
    const { email, password } = user;
    //ищем этого пользователя по имейлу
    const checkUser = await this.postgresService.userService.checkUserByEmail(
      email,
      false,
    );
    //Хешируем пароль
    const hashedPassword = await hashPasswordWithSalt(password);

    //Если нет - заводим нового
    const newUser = await this.postgresService.userService.setNewUser({
      email,
      password: hashedPassword,
    });
    return {
      code: 201,
      isSucceed: true,
      message: 'USER_CREATED',
      payload: { email, userid: newUser.userid },
    };
  }

  async login(body: LoginBodyDto): Promise<LoginOutputDto> {
    const { email, password } = body;
    //Шаг 1: пытаемся получить пользователя по имейлу
    const user = await this.postgresService.userService.getUserHash(email);

    //Шаг 2: Проверяем пароль с хешем и выкидываем ошибку, либо true
    await validatePassword(password, user.hash);

    //Возвращаем объект успешной проверки
    return {
      code: 200,
      message: 'LOGIN_SUCCESS',
      isSucceed: true,
      payload: {
        email: user.email,
        userId: user.userid,
      },
    };
  }
}
