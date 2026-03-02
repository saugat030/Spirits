import { fetchAllUsers, updateUserById } from "../db/repository/user.repo.js";
import type { UserUpdateData } from "../db/schema/User.js";

export const getAllUsersService = async () => {
    const usersList = await fetchAllUsers();
    if (!usersList || usersList.length === 0) {
        throw new Error("NO_USERS_FOUND");
    }
    return usersList;
};


export const updateUserService = async (id: string, data: UserUpdateData) => {
    const payload: UserUpdateData = {};

    if (data.name !== undefined) {
        payload.name = data.name;
    }
    if (data.email !== undefined) {
        payload.email = data.email;
    }
    if (data.role !== undefined) {
        payload.role = data.role;
    }
    if (data.is_verified !== undefined) {
        payload.is_verified = data.is_verified;
    }
    if (data.is_active !== undefined) {
        payload.is_active = data.is_active;
    }

    const updatedUser = await updateUserById(id, payload);

    if (!updatedUser) {
        throw new Error("USER_NOT_FOUND");
    }

    return updatedUser;
};