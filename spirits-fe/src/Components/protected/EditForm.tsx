import axios from "axios";
import { usersData } from "./Users";
import { useState } from "react";

type EditFormType = {
  selectedUser: usersData | null;
  closeModal: () => void;
};

const EditForm = ({ selectedUser, closeModal }: EditFormType) => {
  const [username, setUsername] = useState<string | undefined>(
    selectedUser?.name
  );
  const [email, setEmail] = useState<string | undefined>(selectedUser?.email);
  const [userRole, setUserRole] = useState<string | undefined>(
    selectedUser?.role
  );
  const [error, setError] = useState<string>("");

  const updateUser = async () => {
    axios.defaults.withCredentials = true;
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/admin/update-user/${
          selectedUser?.id
        }`,
        {
          name: username,
          email: email,
          userRole: userRole,
          isVerified: false,
        }
      );
      if (response.data.statistics) {
        console.log(response.data.statistics);
      }
    } catch (error: any) {
      console.log(error.message);
    }
  };
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!username || !email || !userRole) {
      setError("Fields cannot be empty");
      return;
    }
    console.log("Form submitting...");
    await updateUser();
    closeModal();
  };
  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Edit User</h2>
      {selectedUser && (
        <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
          <label htmlFor="username" className="font-">
            Username
            <input
              type="text"
              defaultValue={selectedUser.name}
              onChange={(e) => {
                setUsername(e.target.value);
                setError("");
              }}
              id="username"
              className="border w-full border-black focus:border-blue-500 px-3 py-2 rounded block mt-1"
            />
          </label>
          <label htmlFor="email">
            Email
            <input
              type="email"
              defaultValue={selectedUser.email}
              onChange={(e) => {
                setEmail(e.target.value);
                setError("");
              }}
              id="email"
              className="border w-full  border-black focus:border-blue-500  px-3 py-2 rounded block mt-1"
            />
          </label>
          <label htmlFor="role">
            Role
            <select
              defaultValue={selectedUser.role}
              onChange={(e) => {
                setUserRole(e.target.value);
                setError("");
              }}
              className="border w-full border-black focus:border-blue-500  bg-white px-3 py-2 rounded block mt-1"
            >
              <option value="admin">admin</option>
              <option value="user">user</option>
            </select>
          </label>
          {error && <h1 className="text-sm text-red-500">{error}</h1>}
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
              className="px-4 py-2 bg-green-600 text-white rounded hover:bg-blue-700"
            >
              Save
            </button>
          </div>
        </form>
      )}
    </div>
  );
};
export default EditForm;
