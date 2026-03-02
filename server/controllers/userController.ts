// export const greetAdmin = async (req: Request, res: Response) => {
//   res.json({
//     success: true,
//     message: "Welcome to the Admin dashboard.",
//   });
// };

import { type Request, type Response } from "express";
import { getAllUsersService, updateUserService } from "../service/UserService.js";
import type { UserUpdateData } from "../db/schema/User.js";

export const getUsers = async (req: Request, res: Response): Promise<void> => {
  try {
    const usersList = await getAllUsersService();
    res.status(200).json({
      success: true,
      data: usersList
    });

  } catch (error: any) {
    if (error.message === "NO_USERS_FOUND") {
      res.status(404).json({
        success: false,
        message: "Unable to fetch any records."
      });
      return;
    }
    console.error("Fetch Users Error:", error);
    res.status(500).json({
      success: false,
      message: "Server error while fetching users."
    });
  }
};

interface UpdateUserRequestBody {
  name?: string;
  email?: string;
  role?: "admin" | "user";
  is_verified?: boolean | string | null;
  is_active?: boolean | string | null;
}

type UpdateUserRequest = Request<{ id: string }, any, UpdateUserRequestBody>;

export const updateUsers = async (req: UpdateUserRequest, res: Response): Promise<void> => {
  const userId = req.params.id;

  if (!userId) {
    res.status(400).json({
      success: false,
      message: "Invalid user ID format."
    });
    return;
  }

  const { name, email, role, is_verified, is_active } = req.body;
  const payload: UserUpdateData = {};

  if (name !== undefined) {
    payload.name = name.trim();
  }

  if (email !== undefined) {
    payload.email = email.toLowerCase();
  }

  if (role !== undefined) {
    payload.role = role;
  }

  if (is_verified !== undefined) {
    payload.is_verified =
      typeof is_verified === "string" ? is_verified === "true" : Boolean(is_verified);
  }

  if (is_active !== undefined) {
    payload.is_active =
      typeof is_active === "string" ? is_active === "true" : Boolean(is_active);
  }

  try {
    const updatedUser = await updateUserService(userId as string, payload);
    res.status(200).json({
      success: true,
      message: "User updated successfully.",
      data: updatedUser
    });

  } catch (error: any) {
    if (error.message === "USER_NOT_FOUND") {
      res.status(404).json({
        success: false,
        message: `Unable to find user with the ID: ${userId}`
      });
      return;
    }
    console.error("Update User Error:", error);
    res.status(500).json({
      success: false,
      message: "Server error while trying to update the user."
    });
  }
};