import { useState } from "react";
import { IoTrashOutline } from "react-icons/io5";
import { MdEdit } from "react-icons/md";
import Modal from "react-modal";

const dummyUsers = [
  {
    user_id: "U001",
    username: "rajeshdai",
    email: "rajeshdai@secks.com",
    role: "Admin",
    isverified: true,
    created_at: "2024-01-15",
  },
  {
    user_id: "U002",
    username: "lavizkokera",
    email: "lavizkokera@yahoo.com",
    role: "User",
    isverified: false,
    created_at: "2024-02-10",
  },
  {
    user_id: "U003",
    username: "admin",
    email: "admin@admin.com",
    role: "Admin",
    isverified: true,
    created_at: "2024-03-22",
  },
];

Modal.setAppElement("#root");
const Users = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<any>(null);

  const openModal = (user: any) => {
    setSelectedUser(user);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedUser(null);
  };
  const [users, setUsers] = useState(dummyUsers);

  const handleDelete = (user_id: string) => {
    console.log("Delete user:", user_id);
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
                    onClick={() => openModal(user)}
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
        <Modal
          isOpen={isModalOpen}
          onRequestClose={closeModal}
          contentLabel="Edit User"
          className="bg-white p-6 max-w-md mx-auto mt-20 rounded shadow-md outline-none"
          overlayClassName="fixed inset-0 bg-black bg-opacity-30"
        >
          <h2 className="text-xl font-semibold mb-4">Edit User</h2>
          {selectedUser && (
            <form className="flex flex-col gap-4">
              <input
                type="text"
                defaultValue={selectedUser.username}
                className="border px-3 py-2 rounded"
              />
              <input
                type="email"
                defaultValue={selectedUser.email}
                className="border px-3 py-2 rounded"
              />
              <select
                defaultValue={selectedUser.role}
                className="border px-3 py-2 rounded"
              >
                <option value="admin">Admin</option>
                <option value="user">User</option>
              </select>
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={closeModal}
                  className="px-4 py-2 bg-slate-300 rounded hover:bg-slate-400"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  Save
                </button>
              </div>
            </form>
          )}
        </Modal>
      </div>
    </div>
  );
};

export default Users;
