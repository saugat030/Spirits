import { eq } from "drizzle-orm";
import { db } from "../../config/dbConnect.js";
import type { DbClient } from "../../types/types.js";
import { users, type NewUser } from "../schema/index.js";
import type { UserUpdateData } from "../schema/User.js";

export const fetchAllUsers = async (tx: DbClient = db) => {
    return await tx.select({
        id: users.id,
        name: users.name,
        email: users.email,
        role: users.role,
        is_verified: users.is_verified,
        is_active: users.is_active
    }).from(users);
};

export const updateUserById = async (id: string, data: UserUpdateData, tx: DbClient = db) => {
    const result = await tx.update(users)
        .set(data)
        .where(eq(users.id, id))
        .returning({
            name: users.name,
            email: users.email,
            role: users.role,
            is_verified: users.is_verified,
            is_active: users.is_active
        });

    return result[0];
};