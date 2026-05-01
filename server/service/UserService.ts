import { fetchAllUsers, updateUserById, hardDeleteUserById } from "../db/repository/user.repo.js";
import { getUserById } from "../db/repository/auth.repo.js";
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
    if (data.phone_number !== undefined) {
        payload.phone_number = data.phone_number;
    }
    if (data.country !== undefined) {
        payload.country = data.country;
    }
    if (data.address !== undefined) {
        payload.address = data.address;
    }

    const updatedUser = await updateUserById(id, payload);

    if (!updatedUser) {
        throw new Error("USER_NOT_FOUND");
    }

    return updatedUser;
};

export const softDeleteUserService = async (id: string) => {
    const updatedUser = await updateUserById(id, { is_active: false });
    if (!updatedUser) {
        throw new Error("USER_NOT_FOUND");
    }
    return updatedUser;
};

export const hardDeleteUserService = async (id: string) => {
    const user = await getUserById(id);
    if (!user) {
        throw new Error("USER_NOT_FOUND");
    }
    if (user.is_active !== false) {
        throw new Error("CANNOT_HARD_DELETE_ACTIVE_USER");
    }
    await hardDeleteUserById(id);
};