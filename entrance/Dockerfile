# Этап 1: Установка зависимостей и сборка проекта
FROM node:20-alpine AS build

WORKDIR /usr/src/app

# Копируем файлы package.json и package-lock.json для установки зависимостей
COPY package*.json ./

# Устанавливаем зависимости
RUN npm install

# Копируем исходный код приложения
COPY . .

# Собираем приложение
RUN npm run build


# Этап 2: Создание продакшен-образа
FROM node:20-alpine

WORKDIR /usr/src/app

# Копируем зависимости и собранный код из первого этапа
COPY --from=build /usr/src/app/node_modules ./node_modules
COPY --from=build /usr/src/app/dist ./dist
COPY package*.json ./
COPY .env .env

# Запускаем приложение
CMD ["npm", "run", "start:prod"]
