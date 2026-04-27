import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaUser, FaEnvelope, FaPhone, FaMapMarkerAlt, FaGlobe, FaSave, FaCheck, FaLock } from "react-icons/fa";
import { useAuthStore } from "../store/useAuthStore";
import { useUpdateProfile } from "../services/api/userApi";
import { useChangePassword } from "../services/api/authApi";
import { toast } from "react-toastify";
import ClipLoader from "react-spinners/ClipLoader";

const ProfilePage = () => {
  const navigate = useNavigate();
  const userData = useAuthStore((state) => state.userData);
  const setProfileData = useAuthStore((state) => state.setProfileData);
  const getProfileData = useAuthStore((state) => state.getProfileData);

  const [name, setName] = useState("");
  const [phone_number, setPhoneNumber] = useState("");
  const [country, setCountry] = useState("");
  const [address, setAddress] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [isChangingPassword, setIsChangingPassword] = useState(false);

  const { mutate: updateProfile } = useUpdateProfile();
  const { mutate: changePassword } = useChangePassword();

  useEffect(() => {
    if (userData) {
      setName(userData.name || "");
      setPhoneNumber(userData.phone_number || "");
      setCountry(userData.country || "");
      setAddress(userData.address || "");
    }
  }, [userData]);

  useEffect(() => {
    if (userData) {
      const changed =
        name !== (userData.name || "") ||
        phone_number !== (userData.phone_number || "") ||
        country !== (userData.country || "") ||
        address !== (userData.address || "");
      setHasChanges(changed);
    }
  }, [name, phone_number, country, address, userData]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!hasChanges) {
      toast.info("No changes to save");
      return;
    }

    setIsSubmitting(true);

    const payload: Record<string, string> = {};
    if (name.trim()) payload.name = name.trim();
    if (phone_number.trim()) payload.phone_number = phone_number.trim();
    if (country.trim()) payload.country = country.trim();
    if (address.trim()) payload.address = address.trim();

    updateProfile(payload, {
      onSuccess: (response) => {
        if (response.success) {
          toast.success("Profile updated successfully!");
          setHasChanges(false);
          getProfileData();
          if (response.data) {
            setProfileData(response.data);
          }
        } else {
          toast.error(response.message || "Failed to update profile");
        }
        setIsSubmitting(false);
      },
      onError: (error) => {
        const message = error.response?.data?.message || error.message || "Failed to update profile";
        toast.error(message);
        setIsSubmitting(false);
      },
    });
  };

  const handlePasswordChange = (e: React.FormEvent) => {
    e.preventDefault();

    if (!currentPassword || !newPassword || !confirmNewPassword) {
      toast.error("Please fill in all password fields");
      return;
    }

    if (newPassword !== confirmNewPassword) {
      toast.error("New passwords do not match");
      return;
    }

    setIsChangingPassword(true);

    changePassword({ currentPassword, newPassword }, {
      onSuccess: () => {
        toast.success("Password changed successfully!");
        setCurrentPassword("");
        setNewPassword("");
        setConfirmNewPassword("");
        setIsChangingPassword(false);
      },
      onError: (error) => {
        const message = error.message || "Failed to change password";
        toast.error(message);
        setIsChangingPassword(false);
      }
    });
  };

  if (!userData) {
    return (
      <div className="font-Poppins">
        <div className="flex justify-center items-center h-[calc(100vh-80px)]">
          <ClipLoader color="#0D1B39" size={50} />
        </div>
      </div>
    );
  }

  return (
    <div className="font-Poppins">
      {!userData.is_verified && (
        <div className="bg-red-500 text-white px-4 py-3 flex items-center justify-between">
          <span>Your account is not fully verified. Some features may be restricted.</span>
          <button 
            onClick={() => navigate('/verify-account')}
            className="bg-white text-red-500 px-4 py-1 rounded-md font-semibold text-sm hover:bg-gray-100 transition"
          >
            Verify Now
          </button>
        </div>
      )}
      <div className="container mx-auto px-4 py-8 max-w-2xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">My Profile</h1>
          <p className="text-gray-600">Manage your account information</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
          <div className="bg-gradient-to-r from-amber-500 to-amber-600 p-6">
            <div className="flex items-center gap-4">
              <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center">
                <span className="text-3xl font-bold text-amber-600">
                  {userData.name?.slice(0, 2).toUpperCase() || "U"}
                </span>
              </div>
              <div className="text-white">
                <h2 className="text-2xl font-bold">{userData.name}</h2>
                <p className="text-amber-100">{userData.email}</p>
                <div className="flex items-center gap-2 mt-2">
                  {userData.is_verified ? (
                    <span className="inline-flex items-center gap-1 bg-green-500 text-white text-xs px-2 py-1 rounded-full">
                      <FaCheck className="w-3 h-3" />
                      Verified
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 bg-orange-500 text-white text-xs px-2 py-1 rounded-full">
                      Pending Verification
                    </span>
                  )}
                  <span className="inline-flex items-center bg-white/20 text-white text-xs px-2 py-1 rounded-full capitalize">
                    {userData.role}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Full Name
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaUser className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  placeholder="Enter your full name"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaEnvelope className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="email"
                  id="email"
                  value={userData.email}
                  disabled
                  className="block w-full pl-10 pr-3 py-3 border border-gray-200 rounded-lg bg-gray-50 text-gray-500 cursor-not-allowed"
                />
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Email cannot be changed
              </p>
            </div>

            <div>
              <label
                htmlFor="phone_number"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Phone Number
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaPhone className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="tel"
                  id="phone_number"
                  value={phone_number}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  placeholder="Enter your phone number"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="country"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Country
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaGlobe className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  id="country"
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                  className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  placeholder="Enter your country"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="address"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Shipping Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 pt-3 pointer-events-none">
                  <FaMapMarkerAlt className="h-5 w-5 text-gray-400" />
                </div>
                <textarea
                  id="address"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  rows={3}
                  className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent resize-none"
                  placeholder="Enter your full shipping address for faster checkout"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-4 pt-4 border-t">
              {hasChanges && (
                <span className="text-sm text-amber-600">
                  You have unsaved changes
                </span>
              )}
              <button
                type="submit"
                disabled={isSubmitting || !hasChanges}
                className="flex items-center gap-2 px-6 py-3 bg-amber-500 hover:bg-amber-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-semibold rounded-lg transition-colors shadow-lg hover:shadow-xl"
              >
                {isSubmitting ? (
                  <>
                    <ClipLoader color="#ffffff" size={16} />
                    Saving...
                  </>
                ) : (
                  <>
                    <FaSave className="w-4 h-4" />
                    Save Changes
                  </>
                )}
              </button>
            </div>
          </form>
        </div>

        <div className="mt-8 bg-white rounded-xl shadow-sm border overflow-hidden">
          <div className="bg-gray-50 px-6 py-4 border-b">
            <h3 className="text-xl font-semibold flex items-center gap-2 text-gray-800">
              <FaLock className="text-gray-500" />
              Change Password
            </h3>
          </div>
          
          <form onSubmit={handlePasswordChange} className="p-6 space-y-6">
            <div>
              <label
                htmlFor="currentPassword"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Current Password
              </label>
              <input
                type="password"
                id="currentPassword"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                className="block w-full px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                placeholder="Enter current password"
              />
            </div>

            <div>
              <label
                htmlFor="newPassword"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                New Password
              </label>
              <input
                type="password"
                id="newPassword"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="block w-full px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                placeholder="Enter new password"
              />
            </div>

            <div>
              <label
                htmlFor="confirmNewPassword"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Confirm New Password
              </label>
              <input
                type="password"
                id="confirmNewPassword"
                value={confirmNewPassword}
                onChange={(e) => setConfirmNewPassword(e.target.value)}
                className="block w-full px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                placeholder="Confirm new password"
              />
            </div>

            <div className="flex items-center justify-end pt-4 border-t">
              <button
                type="submit"
                disabled={isChangingPassword || !currentPassword || !newPassword || !confirmNewPassword}
                className="flex items-center gap-2 px-6 py-3 bg-gray-800 hover:bg-gray-900 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-semibold rounded-lg transition-colors shadow-md"
              >
                {isChangingPassword ? (
                  <>
                    <ClipLoader color="#ffffff" size={16} />
                    Updating...
                  </>
                ) : (
                  <>
                    <FaLock className="w-4 h-4" />
                    Update Password
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
