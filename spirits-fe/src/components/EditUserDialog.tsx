import { useState, useEffect, useRef } from "react";
import { ClipLoader } from "react-spinners";
import toast from "react-hot-toast";
import axios from "axios";
import { FaGlobe, FaPhone } from "react-icons/fa";

// Shadcn Components
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { UserProfile } from "@/types/api.types";
import { useUpdateUser } from "@/services/api/userApi";
import { useGetCountries } from "@/services/api/countryApi";

interface EditUserDialogProps {
  isOpen: boolean;
  onClose: () => void;
  user: UserProfile | null;
}

const EditUserDialog = ({ isOpen, onClose, user }: EditUserDialogProps) => {
  const updateUser = useUpdateUser();
  const { data: countriesData, isLoading: countriesLoading } = useGetCountries();

  const [localPhone, setLocalPhone] = useState("");
  const phoneInitialized = useRef(false);

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

  useEffect(() => {
    if (user) {
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
      phoneInitialized.current = false;
    }
  }, [user]);

  useEffect(() => {
    if (user && countriesData?.data && !phoneInitialized.current) {
      let phone = user.phone_number || "";
      const userCountry = user.country || "";
      const code = countriesData.data.find((c) => c.name === userCountry)?.phoneCode || "";
      
      if (code && phone.startsWith(code)) {
        phone = phone.slice(code.length).trim();
      }
      setLocalPhone(phone);
      phoneInitialized.current = true;
    } else if (user && !phoneInitialized.current) {
      setLocalPhone(user.phone_number || "");
    }
  }, [user, countriesData]);

  const currentCountryCode = countriesData?.data?.find((c) => c.name === formData.country)?.phoneCode || "";
  const computedPhoneNumber = currentCountryCode && localPhone ? `${currentCountryCode} ${localPhone}`.trim() : localPhone;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    try {
      await updateUser.mutateAsync({
        id: user.id,
        data: {
          name: formData.name,
          email: formData.email,
          role: formData.role,
          is_verified: formData.is_verified,
          is_active: formData.is_active,
          phone_number: computedPhoneNumber || undefined,
          country: formData.country || undefined,
          address: formData.address || undefined,
        },
      });
      toast.success("User updated successfully");
      onClose();
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

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-2xl min-w-2xl p-0 overflow-hidden bg-white sm:rounded-3xl">
        <DialogHeader className="p-6 border-b border-slate-100">
          <DialogTitle className="text-xl font-bold text-slate-800">
            Edit User
          </DialogTitle>
        </DialogHeader>

        <form
          onSubmit={handleSubmit}
          className="p-6 space-y-5 max-h-[75vh] overflow-y-auto"
        >
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                required
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                placeholder="John Doe"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                required
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                placeholder="john@example.com"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label>Role</Label>
            <Select
              value={formData.role}
              onValueChange={(value) =>
                setFormData({
                  ...formData,
                  role: value as "user" | "admin",
                })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="user">User</SelectItem>
                <SelectItem value="admin">Admin</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1.5">
            <Label className="text-sm font-medium leading-none">
              Country & Phone Number
            </Label>
            <div className="flex flex-col sm:flex-row border border-input rounded-md overflow-hidden focus-within:ring-3 focus-within:ring-ring/50 focus-within:border-ring transition-all duration-200">
              
              {/* Country Select */}
              <div className="relative w-full sm:w-2/5 bg-muted/30 border-b sm:border-b-0 sm:border-r border-input hover:bg-muted/50 transition-colors">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none z-10">
                  <FaGlobe className="h-4 w-4 text-muted-foreground" />
                </div>
                <Select
                  value={formData.country}
                  onValueChange={(value) =>
                    setFormData({ ...formData, country: value || "" })
                  }
                  disabled={countriesLoading}
                >
                  <SelectTrigger className="w-full h-full! pl-9 pr-3 bg-transparent border-0 rounded-none focus:ring-0 focus-visible:ring-0 shadow-none text-foreground font-medium">
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
              <div className="relative flex-1 flex items-center bg-background">
                <div className="pl-3 pr-2 flex items-center pointer-events-none text-muted-foreground font-medium bg-muted/10 border-r border-input h-full">
                  {currentCountryCode || <FaPhone className="h-4 w-4 text-muted-foreground" />}
                </div>
                <Input 
                  type="tel" 
                  id="phone" 
                  value={localPhone} 
                  onChange={(e) => setLocalPhone(e.target.value)}
                  className="w-full h-10 border-0 bg-transparent focus-visible:ring-0 rounded-none shadow-none text-foreground font-medium"
                  placeholder="Phone Number" 
                />
              </div>
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="address">Address</Label>
            <Textarea
              id="address"
              value={formData.address}
              onChange={(e) =>
                setFormData({ ...formData, address: e.target.value })
              }
              placeholder="123 Main St, City, State"
              rows={2}
              className="resize-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-4 pt-1">
            <div className="flex items-center p-3 space-x-3 transition-colors border rounded-xl border-slate-200 hover:bg-slate-50">
              <Checkbox
                id="is_verified"
                checked={formData.is_verified}
                onCheckedChange={(checked) =>
                  setFormData({
                    ...formData,
                    is_verified: checked === true,
                  })
                }
                className="data-[state=checked]:bg-orange-500 data-[state=checked]:border-orange-500"
              />
              <Label
                htmlFor="is_verified"
                className="font-medium cursor-pointer text-slate-700"
              >
                Verified Account
              </Label>
            </div>

            <div className="flex items-center p-3 space-x-3 transition-colors border rounded-xl border-slate-200 hover:bg-slate-50">
              <Checkbox
                id="is_active"
                checked={formData.is_active}
                onCheckedChange={(checked) =>
                  setFormData({
                    ...formData,
                    is_active: checked === true,
                  })
                }
                className="data-[state=checked]:bg-orange-500 data-[state=checked]:border-orange-500"
              />
              <Label
                htmlFor="is_active"
                className="font-medium cursor-pointer text-slate-700"
              >
                Active Status
              </Label>
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="flex-1 rounded-xl"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={updateUser.isPending}
              className="flex-1 text-white bg-orange-500 rounded-xl hover:bg-orange-600"
            >
              {updateUser.isPending ? (
                <ClipLoader color="#ffffff" size={20} />
              ) : (
                "Save Changes"
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditUserDialog;