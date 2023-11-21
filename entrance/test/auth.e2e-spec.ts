import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import Redis from 'ioredis';
import { Pool } from 'pg';
import 'dotenv/config'
import * as cookieParser from "cookie-parser";

describe('[Entrance] Auth - (e2e)', () => {
  let app: INestApplication;
  let redis: Redis;
  let pool;
  const env = process.env;
  let cookies;

  beforeAll(async () => {
    //подключаемся к редису
    redis = new Redis({
      host: env.REDIS_HOST,
      port: +env.REDIS_PORT,
    });
    //подключаемся к постгресу
    pool = new Pool({
      host: env.POSTGRES_HOST,
      port: 5432,
      database: env.POSTGRES_DB,
      user: env.POSTGRES_USER,
      password: env.POSTGRES_PASSWORD,
    });
    //удаляем данные тестовые
    await redis.del('test1@test.com');
    //Создаем клиента
    const client = await pool.connect();
    //Удаляем пользователя
    await client.query('DELETE FROM users WHERE users.email = $1::text', [
      'test1@test.com',
    ]);
    //Инициаилизируем нестжс
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.use(cookieParser());
    await app.init();
    await app.listen(5555);
    client.release();
  });
  afterAll(async () => {
    //Выключаем редис подключение и нестжс
    await redis.quit();
    await pool.end();
    await app.close();
  }, 10000);

  it('[NEST] - Регистрация пользователя', async () => {
    //Этап 1: Начальная регистрация
    const registrationPayload = {
      email: 'test1@test.com',
      password: 'Avangardio1007',
    };

    const registrationResponse = await request(app.getHttpServer())
      .post('/auth/registration')
      .send(registrationPayload)
      .expect(201);
  });
  it('[PG]   - Зарегистрированный пользователь', async () => {
    //Создаем клиента
    const client = await pool.connect();
    //Получаем пользователя
    const user = await client.query(
      'SELECT * FROM users WHERE users.email = $1::text',
      ['test1@test.com'],
    );
    //пользователь должен сущестовать
    expect(user.rows[0].email === 'test1@test.com');
    await client.release();
  });
  it('[NEST] - Логин пользователя', async () => {
    const loginPayloadCorrect = {
      email: 'test1@test.com',
      password: 'Avangardio1007',
    };
    const loginPayloadWrong = {
      email: 'test1@test.com',
      password: 'Avangardio10071',
    };
    //Кейс 1: данные пользователя некорректные
    const loginWrongResponse = await request(app.getHttpServer())
      .post('/auth/login')
      .send(loginPayloadWrong)
      .expect(400);

    //Кейс 2: данные пользователя корректные
    const loginCorrectResponse = await request(app.getHttpServer())
      .post('/auth/login')
      .send(loginPayloadCorrect)
      .expect(200);
    cookies = loginCorrectResponse.headers['set-cookie'];
  });
  it('[NEST] - Выход из аккаунта', async () => {
    const logoutResponse = await request(app.getHttpServer())
      .get('/auth/logout')
      .expect(200);
  });
  it('[NEST] - Аутентификация', async () => {
    const authenticateResponse = await request(app.getHttpServer())
      .get('/auth/authenticate')
      .set('Cookie', cookies)
      .expect(200);
  });
});
