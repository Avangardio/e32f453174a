# Тест новости/блог

## Описание
Бекенд тестового веб приложения новостей/постов.

## Запуск
Лучше всего запускать в композере, либо, по-отдельности в соответствующих папках
```
docker-compose -f docker-compose-base.yml up -d
```

## Подробности

NestJS, при помощи баз данных PostgreSQL, Redis.

## Эндпоинты
## Аутентификация и Регистрация
# Регистрация пользователя
Метод: POST
Endpoint: /auth/registration

Body:
```ts
{
    "email": "email@mail.com",
    "password": "Avangardio1007"
}
```
#### Описание: Регистрация нового пользователя.

## Логин пользователя
Метод: POST
Endpoint: /auth/login

Body:
```ts
{
    "email": "email@mail.com",
    "password": "Avangardio1007"
}
```
#### Описание: Аутентификация пользователя.
## Проверка аутентификации
Метод: GET
Endpoint: /auth/authenticate
#### Описание: Проверка статуса аутентификации пользователя.

# Работа с постами
Поиск постов
Метод: GET
Endpoint: /posts/findPosts/:page - страница

#### Описание: Поиск постов.
## Поиск конкретного поста
Метод: GET
Endpoint: /posts/findExactPost
Query параметры:
```ts
postId: Идентификатор поста.
```
#### Описание: Поиск конкретного поста.
## Создание поста
Метод: POST

Endpoint: /posts/createPost

Body:
```ts
{
    "newPostData": {
        "title": "Тайтл",
        "description": "Описание",
    }
}
```
#### Описание: Создание нового поста.
## Удаление поста
Метод: DELETE
Endpoint: /posts/deletePost
Body:
```ts
{
    "postId": 5
}
```
#### Описание: Удаление поста по идентификатору.
## Обновление поста
Метод: PATCH
Endpoint: /posts/updatePost
Body:
```ts
{
    "postId": 14,
    "payload": {
        "title": "Новый тайтл",
        "description": "Новое описание"
    }
}
```
#### Описание: Обновление информации поста.
Получение всех постов
Метод: GET

Endpoint: /posts/getAllPosts
#### Описание: Получение списка всех постов.

## Тесты

Покрыт юнит тестами 
<p><img class="no-click screenshot-image" src="https://img001.prntscr.com/file/img001/k_A2rWCJTuSODGeckXYEag.png" alt="Lightshot screenshot" id="screenshot-image" image-id="2c8gt82">
<p>Покрыт сквозными тестами
<p></p><img src="https://img001.prntscr.com/file/img001/v0oTmlMkQRiNTRsvZk_UZQ.png">