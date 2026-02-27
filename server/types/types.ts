import type { PgTransaction } from "drizzle-orm/pg-core";
import type db from "../config/dbConnect.js";
import type { NodePgQueryResultHKT } from "drizzle-orm/node-postgres";
import type { JwtPayload } from "jsonwebtoken";

// tx ko type ko lagi we make a type that can represent both
export type DbClient = typeof db | PgTransaction<NodePgQueryResultHKT, any, any>;
export interface RefreshTokenPayload extends JwtPayload {
    id: string;
    role: string;
}