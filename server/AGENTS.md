# Spirits Server - Agent Guidelines

## Project Overview

Express.js + TypeScript backend using Drizzle ORM with PostgreSQL. REST API serving a spirits/liquor e-commerce platform.

## Commands

```bash
# Development (with hot reload)
npm run dev

# Production
npm start

# Database seeding
npm run seed
```

**Note:** No linting or testing framework is currently configured. ESLint and a testing framework (e.g., Vitest) should be added.

## TypeScript Settings

The project uses strict TypeScript with `verbatimModuleSyntax`, which enforces explicit import/export types and `.js` extensions on local imports.

Key compiler options in `tsconfig.json`:
- `strict: true`
- `verbatimModuleSyntax: true` — all imports/exports must use `import type` or `import "module"`
- `noUncheckedIndexedAccess: true`
- `exactOptionalPropertyTypes: true`
- `moduleResolution: "bundler"`
- `module: "esnext"`
- `target: "esnext"`

## Import Conventions

**Mandatory `.js` extension** on all local imports due to `verbatimModuleSyntax`:

```typescript
// Correct
import authRoutes from "./routes/authRoutes.js";
import { addProductService } from "../service/ProductService.js";
import type { Image } from "../types/types.js";

// Wrong (will cause TS error)
import authRoutes from "./routes/authRoutes";
```

Group imports in this order:
1. Node/built-in modules (e.g., `express`, `jsonwebtoken`)
2. Third-party packages
3. Relative imports (using `.js` extension)
4. Type-only imports (`import type`)

## Naming Conventions

- **Files**: kebab-case (e.g., `productController.ts`, `auth.middleware.ts`)
- **Functions/variables**: camelCase (e.g., `getSpiritsService`, `uploadedImages`)
- **Types/interfaces/schemas**: PascalCase (e.g., `Image`, `NewLiquor`, `Liquor`)
- **Database tables/columns**: snake_case (handled by Drizzle column definitions)
- **Constants**: SCREAMING_SNAKE_CASE (e.g., `ACCESS_TOKEN_SECRET`)

## Architecture

```
routes/*.ts      → HTTP layer, input validation, delegates to controller
controllers/*.ts → Request/response handling, error mapping
service/*.ts     → Business logic, orchestration
db/repository/*. → Database queries, Drizzle operations
db/schema/*.ts   → Drizzle table definitions
```

### File Structure

```
server/
├── config/          # DB connection, app config
├── constants/      # Static values (secrets, enums)
├── controllers/    # Request handlers
├── db/
│   ├── migrations/ # Drizzle migration files
│   ├── repository/ # Data access layer
│   └── schema/     # Table definitions
├── middlewares/    # Auth, rate limiting, etc.
├── routes/         # Express route definitions
├── scripts/        # Standalone scripts (seed, etc.)
├── service/        # Business logic
├── types/          # Shared TypeScript types
└── utils/          # Helper functions (S3, auth, etc.)
```

## Error Handling

**Services throw string error codes:**

```typescript
// Service layer
export const getSpiritByIdService = async (id: string) => {
  const product = await getProductById(id);
  if (!product) {
    throw new Error("PRODUCT_NOT_FOUND");
  }
  return product;
};
```

**Controllers catch and return HTTP responses:**

```typescript
export const getSpiritsById = async (req: Request, res: Response): Promise<void> => {
  try {
    const data = await getSpiritByIdService(id);
    res.status(200).json({ success: true, message: "...", data });
  } catch (error: unknown) {
    if (error instanceof Error && error.message === "PRODUCT_NOT_FOUND") {
      res.status(404).json({ success: false, message: "..." });
      return;
    }
    console.error("Error fetching product:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};
```

**Common error codes:**
- `PRODUCT_NOT_FOUND`
- `INVALID_ID_FORMAT`
- `CATEGORY_NOT_CREATED`

## Response Format

All API responses follow this structure:

```typescript
// Success
{ success: true, message: "...", data?: ... }

// Error
{ success: false, message: "..." }
```

Status codes:
- `200` — Success (GET, PUT)
- `201` — Created (POST)
- `400` — Bad request (validation error)
- `401` — Unauthorized (no token)
- `403` — Forbidden (wrong role)
- `404` — Not found
- `500` — Internal server error

## Database Patterns

### Transactions

```typescript
import db from "../config/dbConnect.js";

await db.transaction(async (tx) => {
  const newProduct = await insertProduct(data, tx);
  await insertVariants(variants, tx);
  return newProduct;
});
```

### Repository Pattern

Repository functions accept an optional `tx` parameter to support transactions:

```typescript
export const getProductById = async (id: string, tx: DbClient = db) => {
  // ...
};
```

### Types

Use `InferSelectModel` and `InferInsertModel` from Drizzle for table types:

```typescript
import { type InferSelectModel, type InferInsertModel } from "drizzle-orm";

export type Liquor = InferSelectModel<typeof liquors>;
export type NewLiquor = InferInsertModel<typeof liquors>;
```

## Auth Patterns

JWT access tokens are verified synchronously in middleware. Refresh tokens are handled via cookies.

- `ACCESS_TOKEN_SECRET` — stored in `constants/auth.constants.ts`
- `req.user` is injected by `requireAuth` middleware: `{ id: string, role: string }`

Role-based access uses `requireRole()` higher-order function:

```typescript
app.get("/admin-only", requireAuth, requireRole(["admin"]), handler);
```

## File Upload

Images are uploaded to B2/S3 via `uploadToB2()`. Always implement rollback in controllers:

```typescript
try {
  uploadedThumbnail = await uploadToB2(thumbnailFile);
  // ... save to DB
} catch (error) {
  // Rollback uploaded files on failure
  if (uploadedThumbnail) {
    await deleteFromB2(uploadedThumbnail).catch(e => console.error("Rollback failed", e));
  }
  res.status(500).json({ success: false, message: "..." });
}
```

## Environment Variables

Required in `.env`:
- `DATABASE_URL` — PostgreSQL connection string
- `PORT` — Server port (default: 3001)
- `NODE_ENV` — production/development
- `ACCESS_TOKEN_SECRET` — JWT signing secret
- `REFRESH_TOKEN_SECRET` — Refresh token secret
- `AWS_*` / `B2_*` — S3/B2 credentials

## General Guidelines

- Always return from controller functions (`return` after `res.json()`)
- Use `Promise.all` / `Promise.allSettled` for parallel operations
- Validate and normalize user input in controllers before passing to services
- Use `Math.max(1, ...)` for pagination to prevent invalid offsets
- Check `err instanceof Error` before accessing `.message` on caught errors
