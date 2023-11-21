import { MockFunctionMetadata, ModuleMocker } from 'jest-mock';
import Tokens from '@fastify/csrf';
import { Test } from '@nestjs/testing';
import TokensRepo from '@/Modules/redis/classes/TokensRepo';

const moduleMocker = new ModuleMocker(global);

describe('TokensRepo', () => {
  let tokensRepo: TokensRepo;
  const redisMock = {
    pipeline: () => {
      return {
        hset: jest.fn().mockResolvedValue('OK'),
        expire: jest.fn().mockResolvedValue('OK'),
        exec: jest.fn().mockResolvedValue('OK'),
      };
    },
    hgetall: jest.fn().mockResolvedValue({fingerprint: '12.23.45.23', userId: '12'}),
  };
  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [TokensRepo],
    })
      .useMocker((token) => {
        if (token === 'RedisModule:default') {
          return redisMock;
        }
        if (typeof token === 'function') {
          const mockMetadata = moduleMocker.getMetadata(
            token,
          ) as MockFunctionMetadata<any, any>;
          const Mock = moduleMocker.generateFromMetadata(mockMetadata);
          return new Mock();
        }
      })
      .compile();

    tokensRepo = moduleRef.get(TokensRepo);
  });
  it('Должен инициализироваться', function () {
    expect(tokensRepo).toBeDefined();
  });
  it('setRefreshToken', async () => {
    const result = await tokensRepo.setRefreshToken(
      'testRefresh',
      '12.34.56.78',
      12,
    );
    expect(result).toBe('OK');
  });
  it('getRefreshToken - токена нет', async () => {
    const result = await tokensRepo.getRefreshToken('testRefresh');
    expect(result).toEqual({fingerprint: '12.23.45.23', userId: '12'});
  });
  it('getRefreshToken - токен есть', async () => {
    redisMock.hgetall = jest.fn().mockResolvedValue(null)
    const result = await tokensRepo.getRefreshToken('testRefresh');
    expect(result).toBe(undefined);
  })
});
