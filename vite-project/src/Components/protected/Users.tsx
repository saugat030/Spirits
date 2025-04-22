import { useState } from "react";
import { IoTrashOutline } from "react-icons/io5";
import { MdEdit } from "react-icons/md";

const dummyUsers = [
  {
    user_id: "U001",
    username: "johndoe",
    email: "johndoe@example.com",
    role: "Admin",
    isverified: true,
    created_at: "2024-01-15",
  },
  {
    user_id: "U002",
    username: "janedoe",
    email: "janedoe@example.com",
    role: "Customer",
    isverified: false,
    created_at: "2024-02-10",
  },
  {
    user_id: "U003",
    username: "adminpro",
    email: "adminpro@example.com",
    role: "Admin",
    isverified: true,
    created_at: "2024-03-22",
  },
];
const Users = () => {
  const [users, setUsers] = useState(dummyUsers);

  const handleEdit = (user_id: string) => {
    console.log("Edit user:", user_id);
    // Implement your edit logic here
  };

  const handleDelete = (user_id: string) => {
    console.log("Delete user:", user_id);
    // Example: remove user from state (for now)
    setUsers(users.filter((user) => user.user_id !== user_id));
  };

  return (
    <div className="p-10 h-screen">
      <h2 className="text-2xl font-semibold text-slate-700 mb-6">Users</h2>
      <div className="overflow-x-auto rounded-xl border border-slate-200">
        <table className="min-w-full table-auto">
          <thead className="bg-slate-100 text-slate-600 text-left text-sm uppercase font-medium">
            <tr>
              <th className="p-4">User ID</th>
              <th className="p-4">Username</th>
              <th className="p-4">Email</th>
              <th className="p-4">Role</th>
              <th className="p-4">Verified</th>
              <th className="p-4">Created At</th>
              <th className="p-4">Actions</th>
            </tr>
          </thead>
          <tbody className="text-slate-700 text-sm">
            {users.map((user) => (
              <tr
                key={user.user_id}
                className="even:bg-slate-50 hover:bg-slate-100 transition-colors"
              >
                <td className="p-4">{user.user_id}</td>
                <td className="p-4">{user.username}</td>
                <td className="p-4">{user.email}</td>
                <td className="p-4">{user.role}</td>
                <td className="p-4">
                  {user.isverified ? (
                    <span className="text-green-600 font-medium">Yes</span>
                  ) : (
                    <span className="text-red-500 font-medium">No</span>
                  )}
                </td>
                <td className="p-4">{user.created_at}</td>
                <td className="p-4 flex gap-3">
                  <button
                    onClick={() => handleEdit(user.user_id)}
                    className="text-indigo-600 hover:text-indigo-800"
                    title="Edit"
                  >
                    <MdEdit size={18} />
                  </button>
                  <button
                    onClick={() => handleDelete(user.user_id)}
                    className="text-red-500 hover:text-red-700"
                    title="Delete"
                  >
                    <IoTrashOutline size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Users;
