-include .env
export 

DC=docker-compose

.PHONY: setup up down logs migrate seed dev start

setup:
	npm ci
	npx prisma generate
	npx prisma migrate dev
	cp .env.example .env
	$(DC) up -d

up:
	$(DC) up -d

down:
	$(DC) down

logs:
	$(DC) logs -f

migrate:
	npx prisma migrate dev

seed:
	npx prisma db seed

dev:
	npx tsx watch --env-file=.env src/main/server.ts

start: up dev

db-reset:
	docker-compose down -v
	docker-compose up -d
	@sleep 5
	npx prisma migrate dev