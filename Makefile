.PHONY: help install-api install-web dev-api dev-web build up down logs test lint ci

help:
	@echo "Lysergic Control Plane — make targets"
	@echo ""
	@echo "  install-api   Install Python API dependencies"
	@echo "  install-web   Install frontend dependencies"
	@echo "  dev-api       Run the API with hot reload (port 8000)"
	@echo "  dev-web       Run the web dashboard with hot reload (port 3000)"
	@echo "  build         Build all Docker images"
	@echo "  up            Start all services (docker compose up)"
	@echo "  down          Stop all services"
	@echo "  logs          Tail service logs"
	@echo "  test          Run API tests"
	@echo "  lint          Lint API and build web"
	@echo "  ci            Run lint, tests, and web build"

install-api:
	cd apps/api && pip install -r requirements.txt -r requirements-dev.txt

install-web:
	cd apps/web && npm install

dev-api:
	cd apps/api && uvicorn app.main:app --reload --host 0.0.0.0 --port 8000

dev-web:
	cd apps/web && npm run dev

build:
	docker compose build

up:
	docker compose up

down:
	docker compose down

logs:
	docker compose logs -f

test:
	cd apps/api && pytest

lint:
	cd apps/api && ruff check app
	cd apps/web && npm run build

ci: lint test build
