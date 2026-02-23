# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
pnpm run build              # Build
pnpm run start:dev          # Dev server with watch (NODE_ENV=development)
pnpm run start:debug        # Debug mode with watch
pnpm run start:prod         # Production (NODE_ENV=production)
pnpm run lint               # ESLint with auto-fix
pnpm run format             # Prettier
pnpm run test               # Unit tests (Jest)
pnpm run test:watch         # Watch mode
pnpm run test:cov           # Coverage
pnpm run test:e2e           # E2E tests (supertest)
```

Run a single test file: `npx jest --testPathPattern=<pattern>`

## Architecture

NestJS 11 + TypeScript (ES2023, `nodenext` module resolution). Path alias `@/*` maps to `src/*`.

### Module Structure

- **ConfigModule** (`src/config/`) — `@Global`, wraps `@nestjs/config`. Loads `.env.{NODE_ENV}` then `.env`. `ConfigService` exposes typed getters (`port`, `nodeEnv`, `isProduction`).
- **LoggerModule** — `nestjs-pino`. Dev uses `pino-pretty`, production uses JSON. Configured via `PinoConfig.getPinoHttpConfig()`.
- **AppModule** — Root module. Imports ConfigModule and LoggerModule. Spreads `globalProviders` into providers.

### Global Providers (`src/core/providers/`)

Registered via `APP_PIPE`/`APP_INTERCEPTOR`/`APP_FILTER` in order:
1. `ZodValidationPipe` — Auto-validates `@Body()`, `@Param()`, `@Query()` using `createZodDto` schemas
2. `ZodSerializerInterceptor` — Strips undeclared fields from responses via `@ZodSerializerDto()`
3. `ErrorFilter` — Catches unhandled `Error`, returns 500
4. `HttpExceptionFilter` — Catches `HttpException`, logs `ZodSerializationException` details

Filter registration order matters: later = higher priority. `HttpExceptionFilter` must be last to take precedence over `ErrorFilter` for HTTP exceptions.

### Bootstrap (`src/main.ts`)

`NestExpressApplication` with: trust proxy → helmet → compression → CORS → global prefix `api` → Pino logger → Swagger (dev only at `/api/swagger`).

### Validation Pattern (nestjs-zod v5 + Zod 4)

DTOs use `createZodDto(schema)`. No custom validation pipes needed — the global `ZodValidationPipe` handles everything automatically. Use `cleanupOpenApiDoc()` for Swagger integration (not the deprecated `patchNestJsSwagger`).

## Conventions

- Imports use `.js` extensions (required by `nodenext` module resolution)
- Barrel exports via `index.ts` in `filters/` and `providers/`
- Environment-specific behavior controlled by `NODE_ENV` (set via `cross-env` in scripts)
- Language: Korean for user-facing communication
