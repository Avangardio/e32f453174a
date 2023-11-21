import { INestApplication } from '@nestjs/common';
import Redis from 'ioredis';
import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '@/app.module';
import * as cookieParser from 'cookie-parser';

import { Pool } from 'pg';
import * as request from 'supertest';

describe('[Entrance] Posts - (e2e)', () => {
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
    //Создаем клиента
    const client = await pool.connect();
    //Инициаилизируем нестжс

    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.use(cookieParser());
    await app.init();
    await app.listen(5556);
  });

  it('[NEST] - Логин тестового пользователя', async () => {
    const loginPayload = {
      email: 'admin@test.com',
      password: 'Avangardio1007',
    };
    const loginNewResponse = await request(app.getHttpServer())
      .post('/auth/login')
      .send(loginPayload)
      .expect(200);
    cookies = loginNewResponse.headers['set-cookie'];
  });
  it('[NEST] - аутентификация', async () => {
    const authPostResponse = await request(app.getHttpServer())
      .get('/auth/authenticate')
      .set('Cookie', cookies)
      .expect(200);
    cookies = authPostResponse.headers['set-cookie'];
  });
  let newPostId: number;
  it('[NEST] - Создание поста', async () => {
    const createPostBody = {
      newPostData: {
        title: 'Ну типа тайтл',
        description: 'Тесты тесты тестыыыы',
      },
    };
    const createPostResponse = await request(app.getHttpServer())
      .post('/posts/createPost')
      .send(createPostBody)
      .set('Cookie', cookies)
      .expect(201);
    newPostId = createPostResponse.body.payload.postId;
  });
  it('[NEST] - Поиск этого самого поста', async () => {
    const findPostResponse = await request(app.getHttpServer())
      .get('/posts/findExactPost' + `?postId=${newPostId}`)
      .set('Cookie', cookies)
      .expect(200);
  });
  it('[NEST] - Поиск постов фида - страница есть', async () => {
    const findPostResponse = await request(app.getHttpServer())
      .get('/posts/findPosts/' + 1)
      .set('Cookie', cookies)
      .expect(200);
  });
  it('[NEST] - Поиск постов фида - страницы нет', async () => {
    const findPostResponse = await request(app.getHttpServer())
      .get('/posts/findPosts/' + 420420)
      .set('Cookie', cookies)
      .expect(404);
  });
  it('[NEST] - Изменение поста', async () => {
    const changePayload = {
      postId: newPostId,
      payload: {
        title: 'title1',
        description: 'desc1',
      },
    };
    const changePostResponse = await request(app.getHttpServer())
      .patch('/posts/updatePost')
      .send(changePayload)
      .set('Cookie', cookies)
      .expect(201);
  });
  it('[NEST] - Поиск всех постов', async () => {
    const findPostResponse = await request(app.getHttpServer())
      .get('/posts/getAllPosts/')
      .set('Cookie', cookies)
      .expect(200);
  });
});
