.PHONY: help dev dev-frontend dev-backend build build-frontend build-backend lint typecheck format db-generate db-migrate db-seed db-studio db-reset docker-build docker-up docker-down docker-logs prod-build prod-deploy

# Default target
help:
	@echo "Personal IT Hub - Development Commands"
	@echo ""
	@echo "Development:"
	@echo "  make dev              Start all services (frontend + backend)"
	@echo "  make dev-frontend     Start frontend only"
	@echo "  make dev-backend      Start backend only"
	@echo ""
	@echo "Building:"
	@echo "  make build            Build all packages"
	@echo "  make build-frontend   Build frontend only"
	@echo "  make build-backend    Build backend only"
	@echo ""
	@echo "Code Quality:"
	@echo "  make lint             Run ESLint on all packages"
	@echo "  make typecheck        Run TypeScript check on all packages"
	@echo "  make format           Format code with Prettier"
	@echo ""
	@echo "Database:"
	@echo "  make db-generate      Generate Prisma client"
	@echo "  make db-migrate       Run database migrations"
	@echo "  make db-seed          Seed database with sample data"
	@echo "  make db-studio        Open Prisma Studio"
	@echo "  make db-reset         Reset database (careful!)"
	@echo ""
	@echo "Docker:"
	@echo "  make docker-build     Build all Docker images"
	@echo "  make docker-up        Start all containers"
	@echo "  make docker-down      Stop all containers"
	@echo "  make docker-logs      View container logs"
	@echo ""
	@echo "Production:"
	@echo "  make prod-build       Build for production"
	@echo "  make prod-deploy      Deploy to server"

# Development
dev:
	npm run dev

dev-frontend:
	npm run dev:frontend

dev-backend:
	npm run dev:backend

# Building
build:
	npm run build

build-frontend:
	npm run build:frontend

build-backend:
	npm run build:backend

# Code Quality
lint:
	npm run lint

typecheck:
	npm run typecheck

format:
	npm run format

# Database
db-generate:
	npm run db:generate

db-migrate:
	npm run db:migrate

db-seed:
	npm run db:seed

db-studio:
	npm run db:studio

db-reset:
	npm run db:reset

# Docker
docker-build:
	npm run docker:build

docker-up:
	npm run docker:up

docker-down:
	npm run docker:down

docker-logs:
	npm run docker:logs

# Production
prod-build:
	npm run build

prod-deploy:
	@echo "Deploy to server:"
	@echo "  1. ssh user@server"
	@echo "  2. cd /path/to/app"
	@echo "  3. git pull"
	@echo "  4. docker compose -f docker-compose.yml up -d --build"
	@echo "  5. docker compose exec backend npx prisma migrate deploy"