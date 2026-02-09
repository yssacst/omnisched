# OmniSched
High-performance scheduling API designed for high-concurrency environments. Implements Clean Architecture, Schema-based multi-tenancy, and resilient background workers for WhatsApp/Email alerts.

## Core API Stack
- _Fastify_: A highly efficient web framework focused on providing the best developer experience with the least overhead.

- _TypeScript_: Ensures end-to-end type safety, reducing runtime errors and improving maintainability.

- _Zod_: Used for schema definition and runtime validation, acting as a gatekeeper to ensure only valid data enters our business logic.

- _Fastify Type Provider Zod_: Bridges the gap between Zod and TypeScript, providing seamless type inference for all request properties (body, params, query).

## Data Persistence
- _PostgreSQL_: Our primary relational database, chosen for its reliability and advanced features.

- _Prisma ORM_: Modern database toolkit used for type-safe database access and automated migrations.

## Observability & Infrastructure
- _Docker & Docker Compose_: Orchestrates our services (API, DB, and Monitoring) into isolated, reproducible containers.

- _Prometheus_: Periodically scrapes metrics from our custom `/metrics` endpoint to monitor application health and performance.

- _Grafana_: Provides a visual dashboard to analyze the time-series data collected.

- _Pino_: A low-overhead logger that ensures we have detailed insights into application behavior without compromising speed.

## How to setup
`make setup`

## How to start
`make start`

## Prisma Studio
`npx prisma studio`
