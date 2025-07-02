#!/bin/bash

# Скрипт для остановки DevOps инфраструктуры

echo "🛑 Остановка DevOps инфраструктуры..."

# Остановка мониторинга
echo "📊 Остановка мониторинга..."
docker-compose -f docker-compose.monitoring.yml down

# Остановка основных сервисов
echo "🔄 Остановка основных сервисов..."
docker-compose down

# Остановка отдельных контейнеров (если запускались через make)
echo "🐳 Остановка отдельных контейнеров..."
docker stop frontend-app 2>/dev/null || true
docker rm frontend-app 2>/dev/null || true

echo "✅ Все сервисы остановлены!"

# Опциональная очистка
read -p "🗑️  Очистить Docker volumes и images? (y/N): " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo "🧹 Очистка..."
    docker-compose -f docker-compose.monitoring.yml down -v
    docker-compose down -v
    docker system prune -f
    docker volume prune -f
    echo "✅ Очистка завершена!"
fi

echo "📋 Для перезапуска используй:"
echo "   ./scripts/start-devops.sh"
echo "" 