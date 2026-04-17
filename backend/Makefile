.PHONY: install dev migrate migrate-new seed lint test

install:
	pip install -r requirements.txt

dev:
	uvicorn app.main:app --reload --port 8000

migrate:
	alembic upgrade head

migrate-new:
	@read -p "Migration name: " name; alembic revision --autogenerate -m "$$name"

seed:
	python -m app.db.seeds.runner

lint:
	ruff check app/
	mypy app/

test:
	pytest tests/ -v --cov=app --cov-report=term-missing

services-up:
	docker-compose up -d

services-down:
	docker-compose down
