# DevOps проект Frontend

Современный React приложение с полным DevOps стеком для автоматизации разработки, тестирования и деплоя.

## 🚀 Технологический стек

### Frontend
- **React 19** с TypeScript
- **Vite** - сборщик
- **Redux Toolkit** - управление состоянием
- **Tailwind CSS** - стилизация
- **React Router** - маршрутизация

### DevOps инструменты
- **Docker** - контейнеризация
- **Docker Compose** - оркестрация
- **GitHub Actions** - CI/CD
- **Prometheus** - сбор метрик
- **Grafana** - визуализация метрик
- **Loki** - логирование
- **Jaeger** - трейсинг

## 📦 Быстрый старт

### Локальная разработка

```bash
# Установка зависимостей
make install

# Запуск сервера разработки
make dev

# Сборка для production
make build

# Проверка кода
make lint
```

### Docker разработка

```bash
# Сборка и запуск контейнера
make docker-build
make docker-run

# Или через docker-compose
make docker-compose-up

# Просмотр логов
make docker-compose-logs

# Остановка сервисов
make docker-compose-down
```

## 🔧 DevOps команды

### Основные команды
```bash
make help                # Показать все доступные команды
make install            # Установить зависимости
make dev                # Запустить сервер разработки
make build              # Собрать приложение
make test               # Запустить тесты
make lint               # Проверить код линтером
make clean              # Очистить временные файлы
```

### Docker команды
```bash
make docker-build       # Собрать Docker образ
make docker-run         # Запустить контейнер
make docker-stop        # Остановить контейнер
make docker-compose-up  # Запустить все сервисы
make docker-compose-down # Остановить все сервисы
```

### Мониторинг
```bash
# Запуск стека мониторинга
docker-compose -f docker-compose.monitoring.yml up -d

# Доступ к сервисам:
# Grafana: http://localhost:3001 (admin/admin)
# Prometheus: http://localhost:9090
# Jaeger: http://localhost:16686
# cAdvisor: http://localhost:8080
```

## 🏗️ Архитектура проекта

```
Frontend/
├── .github/workflows/     # CI/CD пайплайны
├── monitoring/           # Конфигурации мониторинга
├── src/                 # Исходный код приложения
├── Dockerfile           # Контейнеризация
├── docker-compose.yml   # Оркестрация сервисов
├── Makefile            # Команды управления
└── nginx.conf          # Конфигурация веб-сервера
```

## 🔄 CI/CD Pipeline

Pipeline автоматически запускается при:
- Push в ветки `main` или `develop`
- Создании Pull Request в `main`

### Этапы pipeline:
1. **Test** - линтинг и тесты
2. **Build** - сборка Docker образа
3. **Security** - проверка безопасности
4. **Deploy** - деплой в production (только для main)

## 📊 Мониторинг и метрики

### Grafana Dashboards
- **System Metrics** - метрики системы (CPU, память, диск)
- **Container Metrics** - метрики контейнеров
- **Application Metrics** - метрики приложения
- **Logs Dashboard** - централизованные логи

### Настройка алертов
Алерты настраиваются в Grafana для:
- Высокое использование CPU (>80%)
- Нехватка памяти (<100MB свободной)
- Недоступность сервиса
- Ошибки в логах

## 🛡️ Безопасность

### Implemented security measures:
- **Docker image scanning** с Trivy
- **Dependency vulnerability scanning** с npm audit
- **Security headers** в nginx
- **Non-root user** в Docker контейнерах
- **Secrets management** через GitHub Secrets

## 🚀 Деплой

### Staging деплой
```bash
make deploy-staging
```

### Production деплой
```bash
make deploy-prod
```

## 🔧 Конфигурация окружений

### Environment variables
```bash
# .env.local
NODE_ENV=development
VITE_API_URL=http://localhost:8000
VITE_APP_NAME="DevOps Frontend"
```

### Docker окружения
- **Development** - `docker-compose.yml`
- **Production** - `Dockerfile` с nginx
- **Monitoring** - `docker-compose.monitoring.yml`

## 📝 Следующие шаги

1. **Добавить тесты** - Jest, React Testing Library
2. **Настроить бэкенд** - API сервер с метриками
3. **Добавить Kubernetes** - для продакшн деплоя
4. **Настроить Alertmanager** - для уведомлений
5. **Добавить E2E тесты** - Playwright или Cypress
6. **Настроить Terraform** - Infrastructure as Code

## 🤝 Контрибьюция

1. Форкни репозиторий
2. Создай feature ветку (`git checkout -b feature/amazing-feature`)
3. Коммить изменения (`git commit -m 'Add amazing feature'`)
4. Пуш в ветку (`git push origin feature/amazing-feature`)
5. Создай Pull Request

## 📄 Лицензия

Этот проект лицензирован под MIT License - см. файл [LICENSE](LICENSE).