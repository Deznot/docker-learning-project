# Docker-окружение: PostgreSQL, Adminer, Backend (Node.js/Express), Frontend (React/Nginx)

Проект состоит из четырёх контейнеров, работающих в общей сети dbnet:
Сервис	Технология	Порт (хост)	Описание
postgres	PostgreSQL 18 (Alpine)	5432 (внутренний)	База данных mydata
adminer	Adminer	8080	Веб-интерфейс для управления БД
back-node	Node.js + Express	4000	REST API для получения данных из БД
frontend	React (Vite) + Nginx	80	Фронтенд с проксированием запросов к API

Все сервисы объединены в одну сеть dbnet, что позволяет им обращаться друг к другу по именам сервисов.

# Структура проекта
```
project/
├── BackendNode/          # Исходники API (Express)
│   ├── Dockerfile
│   ├── package.json
│   └── index.js
├── React/                # Исходники фронтенда
│   └── frontend/
│       ├── Dockerfile
│       ├── nginx.conf
│       └── src/
├── docker-compose.yml
└── README.md
```

# Запуск
Предварительные требования
    Установленный Docker Desktop (или Docker Engine + Docker Compose).

Запустить все сервисы командой
```bash
docker-compose up --build
```
Флаг --build заставляет пересобрать образы для сервисов с build: (back-node, frontend) при необходимости.

# Откройть в браузере

    Frontend: http://localhost
    Adminer (БД): http://localhost:8080

    В Adminer используйте:
        Система: PostgreSQL
        Сервер: db (алиас, указывающий на postgres)
        Пользователь: postgres
        Пароль: 1234
        База данных: mydata

# Описание сервисов
## 1. PostgreSQL (postgres)
    Образ: postgres:18.4-alpine3.24
    Данные сохраняются в именованном томе postgres-data (монтируется в /var/lib/postgresql), поэтому они не теряются при перезапуске контейнера.
    Healthcheck: pg_isready проверяет готовность БД.

## 2. Adminer
    Образ: adminer
    Линкуется к сервису postgres с алиасом db, чтобы стандартное поле "Сервер" (db) работало из коробки.
    Доступен на порту 8080.

## 3. Backend (Node.js/Express)
    Сборка из папки ./BackendNode.
    Подключается к PostgreSQL, используя переменные окружения:
        PGHOST=postgres
        PGUSER=postgres
        PGPASSWORD=1234
        PGDATABASE=mydata

    Имеет healthcheck, который проверяет доступность этого эндпоинта.
    Запускается только после того, как PostgreSQL станет здоровым (depends_on с condition: service_healthy).

## 4. Frontend (React + Nginx)
    Сборка в два этапа:
        node:22-bookworm собирает React-приложение (npm run build).
        nginx:stable-alpine раздаёт полученную статику.

    Конфигурация Nginx (nginx.conf) проксирует запросы, начинающиеся с /api, на http://back-node:4000. Это позволяет избежать проблем с CORS.
    Запускается после того, как back-node станет здоровым.
