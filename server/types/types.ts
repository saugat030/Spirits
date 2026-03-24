import type { PgTransaction } from "drizzle-orm/pg-core";
import type db from "../config/dbConnect.js";
import type { NodePgQueryResultHKT } from "drizzle-orm/node-postgres";
import type { JwtPayload } from "jsonwebtoken";

export type DbClient = typeof db | PgTransaction<NodePgQueryResultHKT, any, any>;

export interface RefreshTokenPayload extends JwtPayload {
    id: string;
    role: string;
}

export type Image = {
    url: string;
    alt_text: string;
};

export type AddProductDTO = {
    name: string;
    categoryId: string;
    thumbnail_url: string;
    images?: Image[];
    description?: string;
};

export type UpdateProductDTO = Partial<Omit<AddProductDTO, "categoryId">>;

export type AddVariantDTO = {
    size: string;
    price: number;
    inventoryQuantity: number;
    variantImage?: Image;
};

export type UpdateVariantDTO = Partial<AddVariantDTO>;

export type ProductFilters = {
    types: string[] | null;
    name: string | null;
    minPrice: number | null;
    maxPrice: number | null;
    limit: number;
    offset: number;
    includeInactive?: boolean;
};
