#!/bin/bash

# Скрипт для быстрого запуска DevOps инфраструктуры

echo "🚀 Запуск DevOps инфраструктуры..."

# Проверка Docker
if ! command -v docker &> /dev/null; then
    echo "❌ Docker не установлен! Установи Docker Desktop."
    exit 1
fi

if ! docker info &> /dev/null; then
    echo "❌ Docker не запущен! Запусти Docker Desktop."
    exit 1
fi

echo "✅ Docker готов"

# Сборка приложения
echo "📦 Сборка Frontend приложения..."
npm install
npm run build

# Сборка Docker образа
echo "🐳 Сборка Docker образа..."
docker build -t frontend-app .

# Запуск основных сервисов
echo "🔄 Запуск основных сервисов..."
docker-compose up -d

# Ожидание запуска
echo "⏳ Ожидание запуска сервисов..."
sleep 10

# Запуск мониторинга
echo "📊 Запуск стека мониторинга..."
docker-compose -f docker-compose.monitoring.yml up -d

echo "✅ Все сервисы запущены!"
echo ""
echo "🌐 Доступные сервисы:"
echo "   Frontend:     http://localhost:3000"
echo "   Grafana:      http://localhost:3001 (admin/admin)"
echo "   Prometheus:   http://localhost:9090"
echo "   Jaeger:       http://localhost:16686"
echo "   cAdvisor:     http://localhost:8080"
echo ""
echo "📋 Полезные команды:"
echo "   docker-compose logs -f           # Логи основных сервисов"
echo "   docker ps                        # Статус контейнеров"
echo "   docker stats                     # Использование ресурсов"
echo "   ./scripts/stop-devops.sh         # Остановить все"
echo "" 