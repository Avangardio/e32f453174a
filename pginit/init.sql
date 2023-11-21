-- Создание таблицы "users"
CREATE TABLE users
(
    userId        SERIAL PRIMARY KEY,
    email         TEXT UNIQUE NOT NULL,
    hash          TEXT        NOT NULL
);
-- Создание таблицы "posts"
CREATE TABLE posts
(
    postId      SERIAL PRIMARY KEY,
    title       TEXT   NOT NULL,
    description TEXT   NOT NULL,
    authorId    INT    REFERENCES users (userId) ON DELETE SET NULL
);