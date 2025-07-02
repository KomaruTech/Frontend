# Makefile для управления проектом

.PHONY: help install dev build test lint clean docker-build docker-run docker-stop deploy

# Переменные
APP_NAME := frontend-app
DOCKER_IMAGE := $(APP_NAME):latest
DOCKER_TAG := $(shell git rev-parse --short HEAD)

help:
	@echo "Доступные команды:"
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-20s\033[0m %s\n", $$1, $$2}'


install: 
	npm ci

dev:
	npm run dev

build: 
	npm run build

test: 
	@echo "Тесты будут добавлены позже"
	# npm test

lint: 
	npm run lint

lint-fix: 
	npm run lint -- --fix

clean: 
	rm -rf dist/ node_modules/ .cache/

docker-build: 
	docker build -t $(DOCKER_IMAGE) .
	docker tag $(DOCKER_IMAGE) $(APP_NAME):$(DOCKER_TAG)

docker-run: 
	docker run -d --name $(APP_NAME) -p 3000:80 $(DOCKER_IMAGE)

docker-stop: 
	docker stop $(APP_NAME) || true
	docker rm $(APP_NAME) || true

docker-compose-up: 
	docker-compose up -d

docker-compose-down: 
	docker-compose down

docker-compose-logs: 
	docker-compose logs -f

	npm audit

deploy-staging: 
	@echo "Деплой на staging..."
	# Здесь будут команды для деплоя

deploy-prod: 
	@echo "Деплой на production..."
	# Здесь будут команды для деплоя


logs: 
	docker logs -f $(APP_NAME)

status:
	docker ps | grep $(APP_NAME) || echo "Контейнер не запущен"


format: 
	npx prettier --write "src/**/*.{ts,tsx,js,jsx,css,md}"

analyze:
	npm run build && npx vite-bundle-analyzer dist/assets/*.js 