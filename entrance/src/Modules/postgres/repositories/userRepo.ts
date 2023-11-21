import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '@/Modules/postgres/Entities/user.entity';
import { DatabasePGError } from '@/Errors/postgresErrors/postgresErrors';
import { Injectable } from '@nestjs/common';
import { RegistrationBodyDto } from '@/DTO/auth/registration';

@Injectable()
export default class UserRepo {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async setNewUser(data: RegistrationBodyDto) {
    //Создаем данные для вставки в базу
    const newUser = this.userRepository.create({
      email: data.email,
      hash: data.password,
    });
    //Пытаемся создать пользователя
    return await this.userRepository.save(newUser).catch((e) => {
      throw new DatabasePGError('POSTGRES_ERROR');
    });
  }

  findUserByUserId(userid: number) {
    //Пытаемся получить данные по uid
    return this.userRepository
      .findOne({
        where: { userid: userid },
      })
      .catch(() => {
        throw new DatabasePGError('POSTGRES_ERROR');
      });
  }

  findUserByEmail(email: string): Promise<User | null> {
    //Пытаемся получить данные по имейлу
    return this.userRepository
      .findOne({
        where: { email: email },
      })
      .catch((e) => {
        console.log(e);

        throw new DatabasePGError('POSTGRES_ERROR');
      });
  }

  getUserPassword(email: string) {
    return this.userRepository
      .findOne({
        where: { email },
        select: ['hash', 'userid'],
      })
      .catch(() => {
        throw new DatabasePGError('POSTGRES_ERROR');
      });
  }
}
