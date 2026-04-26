import { useState, useEffect } from "react";
import { FaUser, FaEnvelope, FaPhone, FaMapMarkerAlt, FaGlobe, FaSave, FaCheck } from "react-icons/fa";
import NavBar from "../components/NavBar";
import Footer from "../components/Footer";
import { useAuthStore } from "../store/useAuthStore";
import { useUpdateProfile } from "../services/api/userApi";
import { toast } from "react-toastify";
import ClipLoader from "react-spinners/ClipLoader";

const ProfilePage = () => {
  const userData = useAuthStore((state) => state.userData);
  const setProfileData = useAuthStore((state) => state.setProfileData);
  const getProfileData = useAuthStore((state) => state.getProfileData);

  const [name, setName] = useState("");
  const [phone_number, setPhoneNumber] = useState("");
  const [country, setCountry] = useState("");
  const [address, setAddress] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  const { mutate: updateProfile } = useUpdateProfile();

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

  if (!userData) {
    return (
      <div className="overflow-hidden font-Poppins">
        <NavBar page="notHome" />
        <div className="flex justify-center items-center h-[calc(100vh-80px)]">
          <ClipLoader color="#0D1B39" size={50} />
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="overflow-hidden font-Poppins">
      <NavBar page="notHome" />
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
      </div>
      <Footer />
    </div>
  );
};

export default ProfilePage;
