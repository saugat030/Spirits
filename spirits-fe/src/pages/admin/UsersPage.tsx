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
  UserCheck,
  UserX,
} from "lucide-react";
import { ClipLoader } from "react-spinners";
import toast from "react-hot-toast";
import axios from "axios";
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
import { boolBadge, roleBadge, statusBadge } from "@/utils/adminUtils";
import EditUserDialog from "@/components/EditUserDialog";
import ErrorState from "../../components/shared/ErrorState";
import EmptyState from "../../components/shared/EmptyState";

const UsersPage = () => {
  const { data: usersData, isLoading, isError } = useGetUsers();
  const updateUser = useUpdateUser();
  const softDeleteUser = useSoftDeleteUser();
  const hardDeleteUser = useHardDeleteUser();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<UserProfile | null>(null);

  const users = usersData?.data || [];

  const handleOpenModal = (user: UserProfile) => {
    setEditingUser(user);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    // Add a tiny delay before clearing the user so the dialog doesn't flash empty data while it animates closed
    setTimeout(() => setEditingUser(null), 200);
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
    return <ErrorState title="Failed to load users" />;
  }

  return (
    <div className="space-y-6 duration-500 animate-in fade-in slide-in-from-bottom-4">
      <div>
        <h1 className="text-2xl font-bold text-slate-800">Users Management</h1>
        <p className="mt-1 text-sm text-slate-500">
          View and manage all registered users.
        </p>
      </div>

      {users.length === 0 ? (
        <EmptyState title="No users found" description="No users match the current filters." />
      ) : (
        <div className="overflow-hidden bg-white border shadow-sm rounded-2xl border-slate-100">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader className="border-b bg-slate-50 border-slate-100">
                <TableRow>
                  <TableHead className="font-semibold text-slate-600">Name</TableHead>
                  <TableHead className="font-semibold text-slate-600">Email</TableHead>
                  <TableHead className="font-semibold text-slate-600">Role</TableHead>
                  <TableHead className="font-semibold text-slate-600">Verified</TableHead>
                  <TableHead className="font-semibold text-slate-600">Active</TableHead>
                  <TableHead className="font-semibold text-slate-600">Password</TableHead>
                  <TableHead className="font-semibold text-right text-slate-600">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody className="divide-y divide-slate-100">
                {users.map((user) => (
                  <TableRow
                    key={user.id}
                    className="border-none transition-colors hover:bg-slate-50"
                  >
                    <TableCell className="py-4">
                      <div className="flex items-center gap-3">
                        <div className="flex items-center justify-center text-sm font-bold text-orange-600 bg-orange-100 rounded-full w-9 h-9">
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
                            className="p-2 transition-colors rounded-lg text-slate-400 hover:text-blue-600 hover:bg-blue-50 focus:outline-none"
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
                            className="p-2 transition-colors rounded-lg text-slate-400 hover:text-red-700 hover:bg-red-50 disabled:opacity-40 focus:outline-none"
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
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      )}

      <EditUserDialog 
        isOpen={isModalOpen} 
        onClose={handleCloseModal} 
        user={editingUser} 
      />
    </div>
  );
};

export default UsersPage;