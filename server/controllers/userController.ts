// export const greetAdmin = async (req: Request, res: Response) => {
//   res.json({
//     success: true,
//     message: "Welcome to the Admin dashboard.",
//   });
// };

import { type Request, type Response } from "express";
import { getAllUsersService, updateUserService, softDeleteUserService, hardDeleteUserService } from "../service/UserService.js";
import type { UserUpdateData } from "../db/schema/User.js";

export const getUsers = async (req: Request, res: Response): Promise<void> => {
  try {
    const usersList = await getAllUsersService();
    res.status(200).json({
      success: true,
      data: usersList
    });

  } catch (error: unknown) {
    if (error instanceof Error) {
      if (error.message === "NO_USERS_FOUND") {
        res.status(404).json({
          success: false,
          message: "Unable to fetch any records."
        });
        return;
      }
      console.error("Fetch Users Error:", error);
    }
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
  phone_number?: string;
  country?: string;
  address?: string;
}

interface UpdateProfileRequestBody {
  name?: string;
  phone_number?: string;
  country?: string;
  address?: string;
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

  const { name, email, role, is_verified, is_active, phone_number, country, address } = req.body;
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

  if (phone_number !== undefined) {
    payload.phone_number = phone_number.trim();
  }

  if (country !== undefined) {
    payload.country = country.trim();
  }

  if (address !== undefined) {
    payload.address = address.trim();
  }

  try {
    const updatedUser = await updateUserService(userId as string, payload);
    res.status(200).json({
      success: true,
      message: "User updated successfully.",
      data: updatedUser
    });

  } catch (error: unknown) {
    if (error instanceof Error) {
      if (error.message === "USER_NOT_FOUND") {
        res.status(404).json({
          success: false,
          message: `Unable to find user with the ID: ${userId}`
        });
        return;
      }
      console.error("Update User Error:", error);
    }
    res.status(500).json({
      success: false,
      message: "Server error while trying to update the user."
    });
  }
};

type UpdateProfileRequest = Request<any, any, UpdateProfileRequestBody>;

export const updateProfile = async (req: UpdateProfileRequest, res: Response): Promise<void> => {
  console.log("User profile patch hit");
  const userId = req.user?.id;

  if (!userId) {
    res.status(401).json({
      success: false,
      message: "Unauthorized. User not found."
    });
    return;
  }

  const { name, phone_number, country, address } = req.body;
  const payload: UserUpdateData = {};

  if (name !== undefined) {
    payload.name = name.trim();
  }

  if (phone_number !== undefined) {
    payload.phone_number = phone_number.trim();
  }

  if (country !== undefined) {
    payload.country = country.trim();
  }

  if (address !== undefined) {
    payload.address = address.trim();
  }

  if (Object.keys(payload).length === 0) {
    res.status(400).json({
      success: false,
      message: "No valid fields to update."
    });
    return;
  }

  try {
    const updatedUser = await updateUserService(userId, payload);
    console.log("Profile Updated")
    res.status(200).json({
      success: true,
      message: "Profile updated successfully.",
      data: updatedUser
    });
  } catch (error: unknown) {
    console.log("Error while updating profile", error);
    if (error instanceof Error && error.message === "USER_NOT_FOUND") {
      res.status(404).json({
        success: false,
        message: "User not found."
      });
      return;
    }
    console.error("Update Profile Error:", error);
    res.status(500).json({
      success: false,
      message: "Server error while updating profile."
    });
  }
};


export const softDeleteUser = async (req: Request, res: Response): Promise<void> => {
  const userId = req.params.id;

  if (!userId) {
    res.status(400).json({
      success: false,
      message: "Invalid user ID format."
    });
    return;
  }

  try {
    const deletedUser = await softDeleteUserService(userId as string);
    res.status(200).json({
      success: true,
      message: "User has been deactivated successfully.",
      data: deletedUser
    });
  } catch (error: unknown) {
    if (error instanceof Error) {
      if (error.message === "USER_NOT_FOUND") {
        res.status(404).json({
          success: false,
          message: `Unable to find user with the ID: ${userId}`
        });
        return;
      }
      console.error("Soft Delete User Error:", error);
    }
    res.status(500).json({
      success: false,
      message: "Server error while deactivating user."
    });
  }
};

export const hardDeleteUser = async (req: Request, res: Response): Promise<void> => {
  const userId = req.params.id;

  if (!userId) {
    res.status(400).json({
      success: false,
      message: "Invalid user ID format."
    });
    return;
  }

  try {
    await hardDeleteUserService(userId as string);
    res.status(200).json({
      success: true,
      message: "User has been permanently deleted."
    });
  } catch (error: unknown) {
    if (error instanceof Error) {
      if (error.message === "USER_NOT_FOUND") {
        res.status(404).json({
          success: false,
          message: `Unable to find user with the ID: ${userId}`
        });
        return;
      }
      if (error.message === "CANNOT_HARD_DELETE_ACTIVE_USER") {
        res.status(400).json({
          success: false,
          message: "Cannot delete an active user. User must be deactivated first."
        });
        return;
      }
      console.error("Hard Delete User Error:", error);
    }
    res.status(500).json({
      success: false,
      message: "Server error while deleting user."
    });
  }
};