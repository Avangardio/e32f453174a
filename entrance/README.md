# BBlog API Сервер

## Навигация по проекту
• [Главная](https://github.com/Avangardio/blog/tree/master)


• [Апи-Сервер](https://github.com/Avangardio/blog/tree/master/nestjs/entrance) - [Вы здесь]

• [Почтовый микросервис](https://github.com/Avangardio/blog/tree/master/nestjs/mailMicroservice)

• [Микросервис пользователей](https://github.com/Avangardio/blog/tree/master/nestjs/authMicroservice)

• [Микросервис постов](https://github.com/Avangardio/blog/tree/master/nestjs/postsMicroservice)

• [Микросервис медиа](https://github.com/Avangardio/blog/tree/master/nestjs/mediaMicroservice)

• [Фронтэнд](https://github.com/Avangardio/blog/tree/master/blog-f)


## Описание
Сервер апи (входная точка) приложения BBlog, технодемо медиа блога, вдохновленный хабром и vc.

Сервер отвечает за связь с микросервисами, отправку, валидацию куки.
## Запуск
```
npm run start # Стандартный запуск
```

## Эндпоинты
### auth
```typescript
@Get('authenticate')

@Post('registration')
    name: string;
    language: string;
    password: string;
    email: string;
    
@Post('confirmation')
    confirmationToken: string;
    emailCode: string;
    
@Post('login')
    email: string;
    password: string;
@Get('logout')

@Post('restoration')
    email: string;

@Post('validateRequest')
    confirmationToken: string;
    emailCode: string;
    
@Post('setNewPassword')
    password: string;
    re_password: string;
    confirmationToken: string;
    emailCode: string;
```    
### posts
```typescript
@Get('findPosts/:page')
    query: { title: string; tags: string; authorId: string }

@Post('createPost')
    userId: number;
    newPostData: {
      title: string;
      description: string;
      texts: string;
      tags: string[];
      picture: string;
    };

@Get('findExactPost')
    query: { postId: string },

@Get('findPopularPosts')

@Delete('deletePost')
    postId: number;
    userId: number;
```

### media
```typescript
@Get('checkLike/:postId')
    param: 'postId'

@Patch('like')
    userId: number;
    postId: number;
    
@Get('getComments/:postId')
    param: 'postId'

@Post('createComment')
    userId: number;
    postId: number;
    text: string;
    
@Delete('deleteComment')
    commentId: number;
    userId: number;
    postId: number;
```
## Тесты
Сервер покрыт сквозными (е2е) тестами:
```
npm run test:e2e
```
<img class="no-click screenshot-image" src="https://img001.prntscr.com/file/img001/Ok-4AqROQSiUjhWNBKxNsQ.png" alt="Lightshot screenshot" id="screenshot-image" image-id="2c4rvsp">"/>
Интеграционными тестами:
