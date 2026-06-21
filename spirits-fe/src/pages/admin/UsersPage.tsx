import { useState } from "react";
import {
  useGetUsers,
  useUpdateUser,
  useSoftDeleteUser,
  useHardDeleteUser,
} from "../../services/api/userApi";
import { UserProfile } from "../../types/api.types";
import {
  Edit2,
  Trash2,
  X,
  AlertCircle,
  UserCheck,
  UserX,
  ShieldCheck,
  Shield,
} from "lucide-react";
import { ClipLoader } from "react-spinners";
import toast from "react-hot-toast";
import axios from "axios";

// Shadcn UI Imports
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const roleBadge = (role: string) => {
  const isAdmin = role === "admin";
  return (
    <Badge
      variant="outline"
      className={`gap-1 px-2.5 py-0.5 text-xs font-semibold border-0 ${
        isAdmin
          ? "bg-purple-100 text-purple-700 hover:bg-purple-100"
          : "bg-slate-100 text-slate-600 hover:bg-slate-100"
      }`}
    >
      {isAdmin ? <ShieldCheck size={12} /> : <Shield size={12} />}
      <span className="capitalize">{role}</span>
    </Badge>
  );
};

const statusBadge = (active: boolean, label: string) => {
  return (
    <Badge
      variant="outline"
      className={`px-2.5 py-0.5 text-xs font-semibold border-0 ${
        active
          ? "bg-green-100 text-green-700 hover:bg-green-100"
          : "bg-red-100 text-red-600 hover:bg-red-100"
      }`}
    >
      {label}
    </Badge>
  );
};

const boolBadge = (value: boolean | null, t: string, f: string) => {
  return (
    <Badge
      variant="outline"
      className={`gap-1 px-2.5 py-0.5 text-xs font-semibold border-0 ${
        value
          ? "bg-emerald-100 text-emerald-700 hover:bg-emerald-100"
          : "bg-slate-100 text-slate-500 hover:bg-slate-100"
      }`}
    >
      {value ? t : f}
    </Badge>
  );
};

const UsersPage = () => {
  const { data: usersData, isLoading, isError } = useGetUsers();
  const updateUser = useUpdateUser();
  const softDeleteUser = useSoftDeleteUser();
  const hardDeleteUser = useHardDeleteUser();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<UserProfile | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    role: "user" as "user" | "admin",
    is_verified: false,
    is_active: false,
    phone_number: "",
    country: "",
    address: "",
  });

  const users = usersData?.data || [];

  const handleOpenModal = (user: UserProfile) => {
    setEditingUser(user);
    setFormData({
      name: user.name,
      email: user.email,
      role: user.role,
      is_verified: user.is_verified,
      is_active: user.is_active,
      phone_number: user.phone_number || "",
      country: user.country || "",
      address: user.address || "",
    });
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingUser(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingUser) return;

    try {
      await updateUser.mutateAsync({
        id: editingUser.id,
        data: {
          name: formData.name,
          email: formData.email,
          role: formData.role,
          is_verified: formData.is_verified,
          is_active: formData.is_active,
          phone_number: formData.phone_number || undefined,
          country: formData.country || undefined,
          address: formData.address || undefined,
        },
      });
      toast.success("User updated successfully");
      handleCloseModal();
    } catch (err: unknown) {
      let errorMessage = "Failed to update user";
      if (axios.isAxiosError(err)) {
        errorMessage = err.response?.data?.message || errorMessage;
      } else if (err instanceof Error) {
        errorMessage = err.message;
      }
      toast.error(errorMessage);
    }
  };

  const handleToggleActive = async (user: UserProfile) => {
    try {
      if (user.is_active) {
        await softDeleteUser.mutateAsync(user.id);
        toast.success("User deactivated");
      } else {
        await updateUser.mutateAsync({
          id: user.id,
          data: { is_active: true },
        });
        toast.success("User activated");
      }
    } catch (err: unknown) {
      let errorMessage = "Failed to update user status";
      if (axios.isAxiosError(err)) {
        errorMessage = err.response?.data?.message || errorMessage;
      } else if (err instanceof Error) {
        errorMessage = err.message;
      }
      toast.error(errorMessage);
    }
  };

  const handleHardDelete = async (user: UserProfile) => {
    if (
      !window.confirm(
        `Permanently delete ${user.name}? This cannot be undone.\nThe user must be deactivated first.`
      )
    )
      return;

    try {
      await hardDeleteUser.mutateAsync(user.id);
      toast.success("User permanently deleted");
    } catch (err: unknown) {
      let errorMessage = "Failed to delete user";
      if (axios.isAxiosError(err)) {
        errorMessage = err.response?.data?.message || errorMessage;
      } else if (err instanceof Error) {
        errorMessage = err.message;
      }
      toast.error(errorMessage);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full min-h-[400px]">
        <ClipLoader color="#f97316" size={50} />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center h-full min-h-[400px] text-red-500 gap-4">
        <AlertCircle size={48} />
        <h2 className="text-xl font-semibold">Failed to load users</h2>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <h1 className="text-2xl font-bold text-slate-800">Users Management</h1>
        <p className="text-slate-500 text-sm mt-1">
          View and manage all registered users.
        </p>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader className="bg-slate-50 border-b border-slate-100">
              <TableRow>
                <TableHead className="font-semibold text-slate-600">Name</TableHead>
                <TableHead className="font-semibold text-slate-600">Email</TableHead>
                <TableHead className="font-semibold text-slate-600">Role</TableHead>
                <TableHead className="font-semibold text-slate-600">Verified</TableHead>
                <TableHead className="font-semibold text-slate-600">Active</TableHead>
                <TableHead className="font-semibold text-slate-600">Password</TableHead>
                <TableHead className="font-semibold text-slate-600 text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody className="divide-y divide-slate-100">
              {users.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="h-24 text-center text-slate-500">
                    No users found.
                  </TableCell>
                </TableRow>
              ) : (
                users.map((user) => (
                  <TableRow
                    key={user.id}
                    className="hover:bg-slate-50 transition-colors border-none"
                  >
                    <TableCell className="py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center text-sm font-bold">
                          {user.name.charAt(0).toUpperCase()}
                        </div>
                        <span className="font-semibold text-slate-800">
                          {user.name}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="py-4 text-slate-600">{user.email}</TableCell>
                    <TableCell className="py-4">{roleBadge(user.role)}</TableCell>
                    <TableCell className="py-4">
                      {boolBadge(user.is_verified, "Verified", "Unverified")}
                    </TableCell>
                    <TableCell className="py-4">
                      {statusBadge(user.is_active, user.is_active ? "Active" : "Inactive")}
                    </TableCell>
                    <TableCell className="py-4">
                      {boolBadge(user.has_password, "Set", "Not Set")}
                    </TableCell>
                    <TableCell className="py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Tooltip>
                          <TooltipTrigger
                            onClick={() => handleOpenModal(user)}
                            className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors focus:outline-none"
                          >
                            <Edit2 size={18} />
                          </TooltipTrigger>
                          <TooltipContent side="top">
                            <p className="text-xs font-medium">Edit User</p>
                          </TooltipContent>
                        </Tooltip>

                        <Tooltip>
                          <TooltipTrigger
                            onClick={() => handleToggleActive(user)}
                            className={`p-2 rounded-lg transition-colors focus:outline-none ${
                              user.is_active
                                ? "text-slate-400 hover:text-red-600 hover:bg-red-50"
                                : "text-green-500 hover:text-green-600 hover:bg-green-50"
                            }`}
                          >
                            {user.is_active ? <UserX size={18} /> : <UserCheck size={18} />}
                          </TooltipTrigger>
                          <TooltipContent side="top">
                            <p className="text-xs font-medium">
                              {user.is_active ? "Deactivate User" : "Activate User"}
                            </p>
                          </TooltipContent>
                        </Tooltip>

                        <Tooltip>
                          <TooltipTrigger
                            onClick={() => handleHardDelete(user)}
                            disabled={hardDeleteUser.isPending}
                            className="p-2 text-slate-400 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-40 focus:outline-none"
                          >
                            <Trash2 size={18} />
                          </TooltipTrigger>
                          <TooltipContent side="top">
                            <p className="text-xs font-medium">Permanently Delete</p>
                          </TooltipContent>
                        </Tooltip>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Edit User Modal - Preserved Original Styling */}
      {isModalOpen && editingUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center p-6 border-b border-slate-100">
              <h2 className="text-xl font-bold text-slate-800">Edit User</h2>
              <button
                onClick={handleCloseModal}
                className="text-slate-400 hover:text-slate-600 transition-colors p-1"
              >
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Name
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Role
                </label>
                <select
                  value={formData.role}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      role: e.target.value as "user" | "admin",
                    })
                  }
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all bg-white"
                >
                  <option value="user">User</option>
                  <option value="admin">Admin</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Phone Number
                  </label>
                  <input
                    type="text"
                    value={formData.phone_number}
                    onChange={(e) =>
                      setFormData({ ...formData, phone_number: e.target.value })
                    }
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Country
                  </label>
                  <input
                    type="text"
                    value={formData.country}
                    onChange={(e) =>
                      setFormData({ ...formData, country: e.target.value })
                    }
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Address
                </label>
                <textarea
                  value={formData.address}
                  onChange={(e) =>
                    setFormData({ ...formData, address: e.target.value })
                  }
                  rows={2}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all resize-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4 pt-2">
                <label className="flex items-center gap-3 p-3 rounded-xl border border-slate-200 cursor-pointer hover:bg-slate-50 transition-colors">
                  <input
                    type="checkbox"
                    checked={formData.is_verified}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        is_verified: e.target.checked,
                      })
                    }
                    className="w-4 h-4 rounded border-slate-300 text-orange-500 focus:ring-orange-500"
                  />
                  <span className="text-sm font-medium text-slate-700">
                    Verified
                  </span>
                </label>
                <label className="flex items-center gap-3 p-3 rounded-xl border border-slate-200 cursor-pointer hover:bg-slate-50 transition-colors">
                  <input
                    type="checkbox"
                    checked={formData.is_active}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        is_active: e.target.checked,
                      })
                    }
                    className="w-4 h-4 rounded border-slate-300 text-orange-500 focus:ring-orange-500"
                  />
                  <span className="text-sm font-medium text-slate-700">
                    Active
                  </span>
                </label>
              </div>

              <div className="pt-4 flex gap-3">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 text-slate-600 font-medium hover:bg-slate-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={updateUser.isPending}
                  className="flex-1 px-4 py-2.5 rounded-xl bg-orange-500 text-white font-medium hover:bg-orange-600 transition-colors disabled:opacity-50 flex justify-center items-center"
                >
                  {updateUser.isPending ? (
                    <ClipLoader color="#ffffff" size={20} />
                  ) : (
                    "Save Changes"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default UsersPage;