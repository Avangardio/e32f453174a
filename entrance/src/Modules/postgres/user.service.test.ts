import { ModuleMocker, MockFunctionMetadata } from 'jest-mock';
import UserService from '@/Modules/postgres/user.service';
import { Test } from '@nestjs/testing';
import UserRepo from '@/Modules/postgres/repositories/userRepo';

const moduleMocker = new ModuleMocker(global);

describe('UserService', () => {
  let userService: UserService;
  const userRepoMock = {
    findUserByUserId: jest.fn().mockResolvedValue({ userid: 1 }),
    findUserByEmail: jest.fn().mockResolvedValue({ userid: 1 }),
    setNewUser: jest.fn().mockResolvedValue({ userid: 1 }),
    updateUserPassword: jest.fn().mockResolvedValue(undefined),
    getUserPassword: jest.fn().mockResolvedValue({
      userid: 1,
      hash: '$2a$12$cG4QZmER2/AvZbPLuq9uLum4bN/UgZC73ZXu7doxcTpfZ2cE16C8m',
      username: 1,
    }),
  };
  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [UserService],
    })
      .useMocker((token) => {
        if (token === UserRepo) {
          return userRepoMock;
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

    userService = moduleRef.get(UserService);
  });
  it('Должен инициализироваться', function () {
    expect(userService).toBeDefined();
  });
  it('checkUserByEmail - юзер есть', async () => {
    const result = await userService.checkUserByEmail('test@test.ru', true);
    expect(result.userid).toBe(1);
  });
  it('checkUserByEmail - юзера нет', async () => {
    userRepoMock.findUserByEmail = jest.fn().mockResolvedValue(null);
    await expect(
      userService.checkUserByEmail('test@test.ru', true),
    ).rejects.toThrow('USER_NOT_EXISTS');
    userRepoMock.findUserByEmail = jest.fn().mockResolvedValue({ userid: 1 });
  });
  it('checkUserById - юзер есть', async () => {
    const result = await userService.checkUserById(1);
    expect(result).toBe(true);
  });
  it('checkUserById - юзера нет', async () => {
    userRepoMock.findUserByUserId = jest.fn().mockResolvedValue(undefined);
    const result = await userService.checkUserById(1);
    expect(result).toBe(false);
    userRepoMock.findUserByUserId = jest.fn().mockResolvedValue({ userid: 1 });
  });
  it('findUserByEmail - юзер есть', async () => {
    const result = await userService.findUserByEmail('test@test.ru');
    expect(result.userid).toBe(1);
  });
  it('findUserByEmail - юзера нет', async () => {
    userRepoMock.findUserByEmail = jest.fn().mockResolvedValue(null);
    const result = await userService.findUserByEmail('test@test.ru');
    expect(result).toBe(null);
    userRepoMock.findUserByEmail = jest.fn().mockResolvedValue({ userid: 1 });
  });
});
