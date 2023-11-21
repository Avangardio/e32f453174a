import Redis from 'ioredis';
import { InjectRedis } from '@liaoliaots/nestjs-redis';
import { DatabaseRedisError } from '@/Errors/redisErrors/redisErrors';
import { Injectable } from '@nestjs/common';
import { RefreshTokenDTO } from '@/Modules/redis/dto/tokensDTO';

@Injectable()
export default class TokensRepo {
  constructor(@InjectRedis() private readonly redis: Redis) {}

  async setRefreshToken(
    refreshToken: string,
    fingerprint: string,
    userId: number | string,
  ) {
    //создаем транзакцию
    const pipeline = this.redis.pipeline();
    //добавляем отпечаток айпи и айди пользователя
    pipeline.hset(refreshToken, { fingerprint, userId });
    //и даем ему время жизни в трое суток
    pipeline.expire(refreshToken, 86400 * 3);
    //отправляем трназакцию
    return await pipeline.exec().catch(() => {
      throw new DatabaseRedisError('REDIS_ERROR');
    });
  }

  async getRefreshToken(refreshToken: string) {
    //Получаем данные для токена
    const refreshData = await this.redis.hgetall(refreshToken);
    //Если нет - undefined
    if (!refreshData) return undefined;
    return refreshData as unknown as RefreshTokenDTO;
  }
}
