import { useEffect, useState } from "react";
import { IoTrashOutline } from "react-icons/io5";
import { MdEdit } from "react-icons/md";
import Modal from "react-modal";
import EditForm from "./EditForm";
import axios from "axios";
import ClipLoader from "react-spinners/ClipLoader";

export type usersData = {
  id: number;
  name: string;
  email: string;
  role: string;
  isverified: boolean;
};

Modal.setAppElement("#root");
const Users = () => {
  const [usersData, setUsersData] = useState<usersData[]>();
  const [loading, setLoading] = useState<boolean>(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<usersData | null>(null);
  const fetchUsers = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_BASE_URL}/admin/get-users`
      );
      if (response.data.statistics) {
        setUsersData(response.data.statistics);
        setLoading(false);
      } else {
        console.log(response.data.message);
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [selectedUser]);

  const openModal = (user: any) => {
    setSelectedUser(user);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedUser(null);
  };

  const handleDelete = (id: number) => {
    console.log("Delete user:", id);
    // setUsers(users.filter((user) => user.id !== user_id));
  };
  if (loading) {
    return (
      <div className="h-screen w-screen flex justify-center items-center">
        <ClipLoader color="brown" size={100} />
      </div>
    );
  } else {
    return (
      <div className="p-10 min-h-screen">
        <h2 className="text-2xl font-semibold text-slate-700 mb-6">Users</h2>
        <div className="overflow-x-auto rounded-xl border border-slate-200">
          <table className="min-w-full table-auto">
            <thead className="bg-slate-100 text-slate-600 text-left text-sm uppercase font-medium">
              <tr>
                {[
                  "User ID",
                  "Username",
                  "Email",
                  "Role",
                  "Verified",
                  "Created At",
                  "Actions",
                ].map((item) => (
                  <th key={item} className="p-4">
                    {item}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="text-slate-700 text-sm">
              {usersData?.map((user) => (
                <tr
                  key={user.id}
                  className="even:bg-slate-50 hover:bg-slate-100 transition-colors"
                >
                  <td className="p-4">{user.id}</td>
                  <td className="p-4">{user.name}</td>
                  <td className="p-4">{user.email}</td>
                  <td className="p-4">{user.role}</td>
                  <td className="p-4">
                    {user.isverified ? (
                      <span className="text-green-600 font-medium">Yes</span>
                    ) : (
                      <span className="text-red-500 font-medium">No</span>
                    )}
                  </td>
                  <td className="p-4">1st April 2025</td>
                  <td className="p-4 flex gap-3">
                    <button
                      onClick={() => openModal(user)}
                      className="text-indigo-600 hover:text-indigo-800"
                      title="Edit"
                    >
                      <MdEdit size={18} />
                    </button>
                    <button
                      onClick={() => handleDelete(user.id)}
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
            className="bg-white p-6 max-w-md mx-auto mt-20 border-2 border-green-500 rounded shadow-md outline-none font-Poppins"
            overlayClassName="fixed inset-0 bg-black bg-opacity-30"
          >
            <EditForm closeModal={closeModal} selectedUser={selectedUser} />
          </Modal>
        </div>
      </div>
    );
  }
};

export default Users;
