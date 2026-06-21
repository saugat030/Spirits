import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { FaUser, FaEnvelope, FaPhone, FaMapMarkerAlt, FaGlobe, FaSave, FaCheck, FaLock } from "react-icons/fa";
import { useAuthStore } from "../store/useAuthStore";
import { useUpdateProfile } from "../services/api/userApi";
import { useChangePassword, useSetPassword } from "../services/api/authApi";
import { useGetCountries } from "../services/api/countryApi";
import axios from "axios";
import { toast } from "react-hot-toast";
import ClipLoader from "react-spinners/ClipLoader";

// Shadcn Components
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const ProfilePage = () => {
  const navigate = useNavigate();
  const userData = useAuthStore((state) => state.userData);
  const setProfileData = useAuthStore((state) => state.setProfileData);
  const getProfileData = useAuthStore((state) => state.getProfileData);
  const [name, setName] = useState("");
  const [localPhone, setLocalPhone] = useState("");
  const [country, setCountry] = useState("");
  const [address, setAddress] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  
  const phoneInitialized = useRef(false);
  
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [isChangingPassword, setIsChangingPassword] = useState(false);

  const { mutate: updateProfile } = useUpdateProfile();
  const { mutate: changePassword } = useChangePassword();
  const { mutate: setPasswordMutate } = useSetPassword();
  const { data: countriesData, isLoading: countriesLoading } = useGetCountries();

  const hasPassword = userData?.has_password ?? true;

  const currentCountryCode = countriesData?.data?.find((c) => c.name === country)?.phoneCode || "";
  const computedPhoneNumber = currentCountryCode && localPhone ? `${currentCountryCode} ${localPhone}`.trim() : localPhone;

  useEffect(() => {
    if (userData) {
      setName(userData.name || "");
      setCountry(userData.country || "");
      setAddress(userData.address || "");
    }
  }, [userData]);

  useEffect(() => {
    if (userData && countriesData?.data && !phoneInitialized.current) {
      let phone = userData.phone_number || "";
      const userCountry = userData.country || "";
      const code = countriesData.data.find((c) => c.name === userCountry)?.phoneCode || "";
      
      if (code && phone.startsWith(code)) {
        phone = phone.slice(code.length).trim();
      }
      setLocalPhone(phone);
      phoneInitialized.current = true;
    } else if (userData && !phoneInitialized.current) {
      setLocalPhone(userData.phone_number || "");
    }
  }, [userData, countriesData]);

  useEffect(() => {
    if (userData) {
      const changed =
        name !== (userData.name || "") ||
        computedPhoneNumber !== (userData.phone_number || "") ||
        country !== (userData.country || "") ||
        address !== (userData.address || "");
      setHasChanges(changed);
    }
  }, [name, localPhone, country, address, userData, computedPhoneNumber]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!hasChanges) {
      toast("No changes to save");
      return;
    }

    setIsSubmitting(true);

    const payload: Record<string, string> = {};
    if (name.trim()) payload.name = name.trim();
    if (computedPhoneNumber.trim()) payload.phone_number = computedPhoneNumber.trim();
    if (country.trim()) payload.country = country.trim();
    if (address.trim()) payload.address = address.trim();

    updateProfile(payload, {
      onSuccess: (response) => {
        if (response.success) {
          toast.success("Profile updated successfully!");
          setHasChanges(false);
          phoneInitialized.current = false;
          getProfileData();
          if (response.data) {
            setProfileData(response.data);
          }
        } else {
          toast.error(response.message || "Failed to update profile");
        }
        setIsSubmitting(false);
      },
      onError: (error: unknown) => {
        let message = "Failed to update profile";
        if (axios.isAxiosError(error)) {
          message = error.response?.data?.message || error.message || message;
        } else if (error instanceof Error) {
          message = error.message;
        }
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
      onError: (error: unknown) => {
        let message = "Failed to change password";
        if (axios.isAxiosError(error)) {
          message = error.response?.data?.message || error.message || message;
        } else if (error instanceof Error) {
          message = error.message;
        }
        toast.error(message);
        setIsChangingPassword(false);
      }
    });
  };

  const handleSetPassword = (e: React.FormEvent) => {
    e.preventDefault();

    if (!newPassword || !confirmNewPassword) {
      toast.error("Please fill in all password fields");
      return;
    }

    if (newPassword !== confirmNewPassword) {
      toast.error("Passwords do not match");
      return;
    }

    setIsChangingPassword(true);

    setPasswordMutate({ newPassword }, {
      onSuccess: () => {
        toast.success("Password set successfully!");
        setNewPassword("");
        setConfirmNewPassword("");
        setIsChangingPassword(false);
        // refresh profile so has_password updates in the UI
        getProfileData();
      },
      onError: (error: unknown) => {
        let message = "Failed to set password";
        if (axios.isAxiosError(error)) {
          message = error.response?.data?.message || error.message || message;
        } else if (error instanceof Error) {
          message = error.message;
        }
        toast.error(message);
        setIsChangingPassword(false);
      }
    });
  };

  if (!userData) {
    return (
      <div className="font-poppins min-h-screen bg-slate-50 flex justify-center items-center">
        <ClipLoader color="#f59e0b" size={50} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 font-poppins py-12">
      {!userData.is_verified && (
        <div className="bg-red-500 text-white px-4 py-3 flex items-center justify-center gap-4 shadow-sm">
          <span className="text-sm font-medium text-center">Your account is not fully verified. Some features may be restricted.</span>
          <button 
            onClick={() => navigate('/verify-account')}
            className="bg-white text-red-500 px-4 py-1.5 rounded-full font-normal text-xs hover:bg-red-50 hover:scale-105 transition-all shadow-sm"
          >
            Verify Now
          </button>
        </div>
      )}
      
      <div className="container mx-auto">
        <div className="mb-8">
          <h1 className="text-2xl md:text-3xl font-semibold text-slate-900 tracking-tight">Account Settings</h1>
          <p className="text-slate-500 text-sm">Manage your personal information and security preferences.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column: User Card */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-200 flex flex-col items-center text-center relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-32 bg-orange-500"></div>
              <div className="relative mt-6 w-32 h-32 bg-white rounded-full p-1.5 shadow-lg">
                <div className="w-full h-full bg-slate-100 rounded-full flex items-center justify-center border-4 border-white overflow-hidden">
                  <span className="text-4xl font-black text-slate-400">
                    {userData.name?.slice(0, 2).toUpperCase() || "U"}
                  </span>
                </div>
              </div>
              <h2 className="text-2xl font-normal text-slate-900 mt-5">{userData.name}</h2>
              <p className="text-slate-500 text-sm mb-5 font-medium">{userData.email}</p>
              
              <div className="flex flex-wrap justify-center gap-2 w-full mt-2">
                {userData.is_verified ? (
                  <span className="inline-flex items-center gap-1.5 bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs px-3 py-1.5 rounded-full font-normal">
                    <FaCheck className="w-3 h-3" />
                    Verified
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1.5 bg-amber-50 text-amber-700 border border-amber-200 text-xs px-3 py-1.5 rounded-full font-normal">
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
                <h3 className="text-xl font-semibold text-slate-900 mb-6 flex items-center gap-3">
                  <div className="p-2 bg-amber-100 text-amber-600 rounded-lg">
                    <FaUser className="w-5 h-5" />
                  </div>
                  Personal Information
                </h3>
                
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Name Input */}
                    <div className="space-y-2">
                      <Label htmlFor="name" className="text-sm font-normal text-slate-700">Full Name</Label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                          <FaUser className="h-4 w-4 text-slate-400" />
                        </div>
                        <Input type="text" id="name" value={name} onChange={(e) => setName(e.target.value)}
                          className="w-full pl-11 pr-4 h-[52px] bg-slate-50 border-slate-200 rounded-xl focus-visible:bg-white focus-visible:ring-2 focus-visible:ring-amber-500/20 focus-visible:border-amber-500 transition-all duration-200 text-slate-800 font-medium placeholder:text-slate-400 placeholder:font-normal shadow-none"
                          placeholder="John Doe" />
                      </div>
                    </div>

                    {/* Email Input */}
                    <div className="space-y-2">
                      <Label htmlFor="email" className="text-sm font-normal text-slate-700">Email Address</Label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                          <FaEnvelope className="h-4 w-4 text-slate-400" />
                        </div>
                        <Input type="email" id="email" value={userData.email} disabled
                          className="w-full pl-11 pr-4 h-[52px] bg-slate-100/70 border-slate-200 rounded-xl text-slate-500 font-medium cursor-not-allowed shadow-none" />
                      </div>
                    </div>

                    {/* Unified Country & Phone Input */}
                    <div className="space-y-2 md:col-span-2">
                      <Label className="text-sm font-normal text-slate-700">Country & Phone Number</Label>
                      <div className="flex flex-col sm:flex-row border border-slate-200 rounded-xl overflow-hidden focus-within:ring-2 focus-within:ring-amber-500/20 focus-within:border-amber-500 transition-all duration-200 bg-slate-50">
                        
                        {/* Country Select */}
                        <div className="relative w-full sm:w-2/5 bg-slate-100 border-b sm:border-b-0 sm:border-r border-slate-200 hover:bg-slate-200/50 transition-colors">
                          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none z-10">
                            <FaGlobe className="h-4 w-4 text-slate-400" />
                          </div>
                          <Select
                            value={country}
                            onValueChange={(value) => setCountry(value || "")}
                            disabled={countriesLoading}
                          >
                            <SelectTrigger className="w-full h-full! pl-11 pr-4 bg-transparent border-0 rounded-none focus:ring-0 focus-visible:ring-0 shadow-none text-slate-700 font-medium">
                              <SelectValue placeholder="Select Country" />
                            </SelectTrigger>
                            <SelectContent>
                              {countriesData?.data?.map((c) => (
                                <SelectItem key={c.name} value={c.name}>
                                  {c.name} ({c.phoneCode})
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>

                        {/* Phone Input */}
                        <div className="relative flex-1 flex items-center bg-white">
                          <div className="pl-4 pr-3 flex items-center pointer-events-none text-slate-500 font-semibold bg-slate-50/50 border-r border-slate-100 h-full">
                            {currentCountryCode || <FaPhone className="h-4 w-4 text-slate-400" />}
                          </div>
                          <Input 
                            type="tel" 
                            id="phone_number" 
                            value={localPhone} 
                            onChange={(e) => setLocalPhone(e.target.value)}
                            className="w-full h-[52px] pl-4 pr-4 border-0 bg-transparent focus-visible:ring-0 rounded-none shadow-none text-slate-800 font-medium placeholder:text-slate-400"
                            placeholder="Phone Number" 
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Address Input */}
                  <div className="space-y-2">
                    <Label htmlFor="address" className="text-sm font-normal text-slate-700">Shipping Address</Label>
                    <div className="relative">
                      <div className="absolute top-4 left-0 pl-4 pointer-events-none">
                        <FaMapMarkerAlt className="h-4 w-4 text-slate-400" />
                      </div>
                      <Textarea id="address" value={address} onChange={(e) => setAddress(e.target.value)} rows={3}
                        className="w-full pl-11 pr-4 py-3 bg-slate-50 border-slate-200 rounded-xl focus-visible:bg-white focus-visible:ring-2 focus-visible:ring-amber-500/20 focus-visible:border-amber-500 transition-all duration-200 text-slate-800 font-medium placeholder:text-slate-400 placeholder:font-normal resize-none shadow-none"
                        placeholder="123 Main St, City, State, ZIP" />
                    </div>
                  </div>

                  {/* Submit Button */}
                  <div className="flex items-center justify-end gap-4 pt-6 mt-6 border-t border-slate-100">
                    {hasChanges && (
                      <span className="text-sm font-normal text-red-500 animate-pulse">
                        You have unsaved changes
                      </span>
                    )}
                    <Button type="submit" disabled={isSubmitting || !hasChanges}
                      className="flex items-center gap-2 px-8 h-[52px] bg-orange-500 hover:bg-orange-600 disabled:bg-slate-200 disabled:text-slate-400 disabled:opacity-100 text-white font-normal rounded-xl transition-all duration-200 shadow-md hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0 text-base">
                      {isSubmitting ? (
                        <><ClipLoader color="currentColor" size={18} /> Saving...</>
                      ) : (
                        <><FaSave className="w-4 h-4" /> Save Profile</>
                      )}
                    </Button>
                  </div>
                </form>
              </div>
            </div>

            {/* Password Form */}
            <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
              <div className="p-8">
                <h3 className="text-xl font-semibold text-slate-900 mb-6 flex items-center gap-3">
                  <div className="p-2 bg-slate-100 text-slate-700 rounded-lg">
                    <FaLock className="w-5 h-5" />
                  </div>
                  {hasPassword ? "Security Settings" : "Set Up Password"}
                </h3>

                {!hasPassword && (
                  <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6">
                    <p className="text-blue-700 text-sm">
                      Your account was created with Google. Set a password to also sign in with your email and password.
                    </p>
                  </div>
                )}
                
                <form onSubmit={hasPassword ? handlePasswordChange : handleSetPassword} className="space-y-6">
                  <div className="space-y-6">
                    {hasPassword && (
                      <div className="space-y-2">
                        <Label htmlFor="currentPassword" className="text-sm font-normal text-slate-700">Current Password</Label>
                        <Input type="password" id="currentPassword" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)}
                          className="w-full px-4 h-[52px] bg-slate-50 border-slate-200 rounded-xl focus-visible:bg-white focus-visible:ring-2 focus-visible:ring-slate-500/20 focus-visible:border-slate-500 transition-all duration-200 text-slate-800 font-medium placeholder:text-slate-400 shadow-none"
                          placeholder="••••••••" />
                      </div>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="newPassword" className="text-sm font-normal text-slate-700">New Password</Label>
                        <Input type="password" id="newPassword" value={newPassword} onChange={(e) => setNewPassword(e.target.value)}
                          className="w-full px-4 h-[52px] bg-slate-50 border-slate-200 rounded-xl focus-visible:bg-white focus-visible:ring-2 focus-visible:ring-slate-500/20 focus-visible:border-slate-500 transition-all duration-200 text-slate-800 font-medium placeholder:text-slate-400 shadow-none"
                          placeholder="••••••••" />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="confirmNewPassword" className="text-sm font-normal text-slate-700">Confirm Password</Label>
                        <Input type="password" id="confirmNewPassword" value={confirmNewPassword} onChange={(e) => setConfirmNewPassword(e.target.value)}
                          className="w-full px-4 h-[52px] bg-slate-50 border-slate-200 rounded-xl focus-visible:bg-white focus-visible:ring-2 focus-visible:ring-slate-500/20 focus-visible:border-slate-500 transition-all duration-200 text-slate-800 font-medium placeholder:text-slate-400 shadow-none"
                          placeholder="••••••••" />
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-end pt-6 mt-6 border-t border-slate-100">
                    <Button type="submit" disabled={isChangingPassword || (!hasPassword ? (!newPassword || !confirmNewPassword) : (!currentPassword || !newPassword || !confirmNewPassword))}
                      className="flex items-center gap-2 px-8 h-[52px] bg-slate-900 hover:bg-slate-800 disabled:bg-slate-200 disabled:text-slate-400 disabled:opacity-100 text-white font-normal rounded-xl transition-all duration-200 shadow-md hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0 text-base">
                      {isChangingPassword ? (
                        <><ClipLoader color="currentColor" size={18} /> {hasPassword ? "Updating..." : "Setting..."}</>
                      ) : (
                        <><FaLock className="w-4 h-4" /> {hasPassword ? "Update Password" : "Set Password"}</>
                      )}
                    </Button>
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
