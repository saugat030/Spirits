import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaUser, FaEnvelope, FaPhone, FaMapMarkerAlt, FaGlobe, FaSave, FaCheck, FaLock, FaChevronDown } from "react-icons/fa";
import { useAuthStore } from "../store/useAuthStore";
import { useUpdateProfile } from "../services/api/userApi";
import { useChangePassword } from "../services/api/authApi";
import { useGetCountries } from "../services/api/countryApi";
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
  const { data: countriesData, isLoading: countriesLoading } = useGetCountries();

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
      onError: (error: any) => {
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
      onError: (error: any) => {
        const message = error.message || "Failed to change password";
        toast.error(message);
        setIsChangingPassword(false);
      }
    });
  };

  if (!userData) {
    return (
      <div className="font-Poppins min-h-screen bg-slate-50 flex justify-center items-center">
        <ClipLoader color="#f59e0b" size={50} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 font-Poppins pb-12">
      {!userData.is_verified && (
        <div className="bg-red-500 text-white px-4 py-3 flex items-center justify-center gap-4 shadow-sm">
          <span className="text-sm font-medium text-center">Your account is not fully verified. Some features may be restricted.</span>
          <button 
            onClick={() => navigate('/verify-account')}
            className="bg-white text-red-500 px-4 py-1.5 rounded-full font-bold text-xs hover:bg-red-50 hover:scale-105 transition-all shadow-sm"
          >
            Verify Now
          </button>
        </div>
      )}
      
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mt-10">
        <div className="mb-10">
          <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight">Account Settings</h1>
          <p className="text-slate-500 mt-2 text-lg">Manage your personal information and security preferences.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column: User Card */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-200 flex flex-col items-center text-center relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-br from-amber-400 to-orange-500"></div>
              <div className="relative mt-6 w-32 h-32 bg-white rounded-full p-1.5 shadow-lg">
                <div className="w-full h-full bg-slate-100 rounded-full flex items-center justify-center border-4 border-white overflow-hidden">
                  <span className="text-4xl font-black text-slate-400">
                    {userData.name?.slice(0, 2).toUpperCase() || "U"}
                  </span>
                </div>
              </div>
              <h2 className="text-2xl font-bold text-slate-900 mt-5">{userData.name}</h2>
              <p className="text-slate-500 text-sm mb-5 font-medium">{userData.email}</p>
              
              <div className="flex flex-wrap justify-center gap-2 w-full mt-2">
                {userData.is_verified ? (
                  <span className="inline-flex items-center gap-1.5 bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs px-3 py-1.5 rounded-full font-bold">
                    <FaCheck className="w-3 h-3" />
                    Verified
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1.5 bg-amber-50 text-amber-700 border border-amber-200 text-xs px-3 py-1.5 rounded-full font-bold">
                    Pending Verification
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Right Column: Forms */}
          <div className="lg:col-span-8 space-y-8">
            
            {/* Profile Form */}
            <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
              <div className="p-8">
                <h3 className="text-xl font-extrabold text-slate-900 mb-6 flex items-center gap-3">
                  <div className="p-2 bg-amber-100 text-amber-600 rounded-lg">
                    <FaUser className="w-5 h-5" />
                  </div>
                  Personal Information
                </h3>
                
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Name Input */}
                    <div className="space-y-2">
                      <label htmlFor="name" className="text-sm font-bold text-slate-700">Full Name</label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                          <FaUser className="h-4 w-4 text-slate-400" />
                        </div>
                        <input type="text" id="name" value={name} onChange={(e) => setName(e.target.value)}
                          className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all duration-200 text-slate-800 font-medium placeholder:text-slate-400 placeholder:font-normal"
                          placeholder="John Doe" />
                      </div>
                    </div>

                    {/* Email Input */}
                    <div className="space-y-2">
                      <label htmlFor="email" className="text-sm font-bold text-slate-700">Email Address</label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                          <FaEnvelope className="h-4 w-4 text-slate-400" />
                        </div>
                        <input type="email" id="email" value={userData.email} disabled
                          className="w-full pl-11 pr-4 py-3 bg-slate-100/70 border border-slate-200 rounded-xl text-slate-500 font-medium cursor-not-allowed" />
                      </div>
                    </div>

                    {/* Phone Input */}
                    <div className="space-y-2">
                      <label htmlFor="phone_number" className="text-sm font-bold text-slate-700">Phone Number</label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                          <FaPhone className="h-4 w-4 text-slate-400" />
                        </div>
                        <input type="tel" id="phone_number" value={phone_number} onChange={(e) => setPhoneNumber(e.target.value)}
                          className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all duration-200 text-slate-800 font-medium placeholder:text-slate-400 placeholder:font-normal"
                          placeholder="+1 234 567 890" />
                      </div>
                    </div>

                    {/* Country Input */}
                    <div className="space-y-2">
                      <label htmlFor="country" className="text-sm font-bold text-slate-700">Country</label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                          <FaGlobe className="h-4 w-4 text-slate-400" />
                        </div>
                        <select
                          id="country"
                          value={country}
                          onChange={(e) => setCountry(e.target.value)}
                          disabled={countriesLoading}
                          className="w-full pl-11 pr-10 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all duration-200 text-slate-800 font-medium appearance-none cursor-pointer"
                        >
                          <option value="">Select a country</option>
                          {countriesData?.data?.map((c) => (
                            <option key={c.id} value={c.name}>
                              {c.name}
                            </option>
                          ))}
                        </select>
                        <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
                          <FaChevronDown className="h-4 w-4 text-slate-400" />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Address Input */}
                  <div className="space-y-2">
                    <label htmlFor="address" className="text-sm font-bold text-slate-700">Shipping Address</label>
                    <div className="relative">
                      <div className="absolute top-4 left-0 pl-4 pointer-events-none">
                        <FaMapMarkerAlt className="h-4 w-4 text-slate-400" />
                      </div>
                      <textarea id="address" value={address} onChange={(e) => setAddress(e.target.value)} rows={3}
                        className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all duration-200 text-slate-800 font-medium placeholder:text-slate-400 placeholder:font-normal resize-none"
                        placeholder="123 Main St, City, State, ZIP" />
                    </div>
                  </div>

                  {/* Submit Button */}
                  <div className="flex items-center justify-end gap-4 pt-6 mt-6 border-t border-slate-100">
                    {hasChanges && (
                      <span className="text-sm font-bold text-amber-500 animate-pulse">
                        Unsaved changes
                      </span>
                    )}
                    <button type="submit" disabled={isSubmitting || !hasChanges}
                      className="flex items-center gap-2 px-8 py-3.5 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 disabled:from-slate-200 disabled:to-slate-200 disabled:text-slate-400 disabled:cursor-not-allowed text-white font-bold rounded-xl transition-all duration-200 shadow-md hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0">
                      {isSubmitting ? (
                        <><ClipLoader color="currentColor" size={18} /> Saving...</>
                      ) : (
                        <><FaSave className="w-4 h-4" /> Save Profile</>
                      )}
                    </button>
                  </div>
                </form>
              </div>
            </div>

            {/* Password Form */}
            <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
              <div className="p-8">
                <h3 className="text-xl font-extrabold text-slate-900 mb-6 flex items-center gap-3">
                  <div className="p-2 bg-slate-100 text-slate-700 rounded-lg">
                    <FaLock className="w-5 h-5" />
                  </div>
                  Security Settings
                </h3>
                
                <form onSubmit={handlePasswordChange} className="space-y-6">
                  <div className="space-y-6">
                    <div className="space-y-2">
                      <label htmlFor="currentPassword" className="text-sm font-bold text-slate-700">Current Password</label>
                      <input type="password" id="currentPassword" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)}
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-slate-500/20 focus:border-slate-500 transition-all duration-200 text-slate-800 font-medium placeholder:text-slate-400"
                        placeholder="••••••••" />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label htmlFor="newPassword" className="text-sm font-bold text-slate-700">New Password</label>
                        <input type="password" id="newPassword" value={newPassword} onChange={(e) => setNewPassword(e.target.value)}
                          className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-slate-500/20 focus:border-slate-500 transition-all duration-200 text-slate-800 font-medium placeholder:text-slate-400"
                          placeholder="••••••••" />
                      </div>

                      <div className="space-y-2">
                        <label htmlFor="confirmNewPassword" className="text-sm font-bold text-slate-700">Confirm Password</label>
                        <input type="password" id="confirmNewPassword" value={confirmNewPassword} onChange={(e) => setConfirmNewPassword(e.target.value)}
                          className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-slate-500/20 focus:border-slate-500 transition-all duration-200 text-slate-800 font-medium placeholder:text-slate-400"
                          placeholder="••••••••" />
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-end pt-6 mt-6 border-t border-slate-100">
                    <button type="submit" disabled={isChangingPassword || !currentPassword || !newPassword || !confirmNewPassword}
                      className="flex items-center gap-2 px-8 py-3.5 bg-slate-900 hover:bg-slate-800 disabled:bg-slate-200 disabled:text-slate-400 disabled:cursor-not-allowed text-white font-bold rounded-xl transition-all duration-200 shadow-md hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0">
                      {isChangingPassword ? (
                        <><ClipLoader color="currentColor" size={18} /> Updating...</>
                      ) : (
                        <><FaLock className="w-4 h-4" /> Update Password</>
                      )}
                    </button>
                  </div>
                </form>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
