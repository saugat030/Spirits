# Spirits Server

This is the backend server for the Spirits application, built with Node.js, Express, and Drizzle ORM.

## 🛠️ Scripts Tutorial

Below are the available scripts you can run from the `server` directory.

### Development

#### `npm run dev`
The primary development command. It uses `tsx watch` to run the server and automatically restarts whenever you make changes to your code.
```bash
npm run dev
```

#### `npm run server`
An alternative development command that uses `nodemon` with `tsx`. Useful if you prefer nodemon's style of watching and restarting.
```bash
npm run server
```

### Production & Build

#### `npm run build`
Compiles the TypeScript source code into plain JavaScript using the TypeScript compiler (`tsc`).
```bash
npm run build
```

#### `npm start`
Starts the server using `tsx`. In a production-like environment (if not running the built JS directly), this command executes `server.ts`.
```bash
npm start
```

### Utilities

#### `npm run typecheck`
Runs the TypeScript compiler in `noEmit` mode to check for type errors throughout the project without generating any output files.
```bash
npm run typecheck
```

#### `npm run seed`
Inserts initial data (one admin, one regular user, and one sample product) into the database.

**Prerequisites:**
1. Ensure your `.env` file has a valid `DATABASE_URL`.
2. Ensure migrations have been applied.

**Usage:**
```bash
npm run seed
```

This will create:
- **Admin user**: `admin@spirits.test` / `Admin123!`
- **Regular user**: `user@spirits.test` / `User123!`
- **Sample Data**: Category `Whiskey` and product `Sample Whiskey`.


