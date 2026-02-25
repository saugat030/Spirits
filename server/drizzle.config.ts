import { defineConfig } from "drizzle-kit";

export default defineConfig({
  schema: "./db/schema.ts", // where to put schema
  out: "./db/migrations", // where to put migrations
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.DATABASE_URL!, 
  },
});