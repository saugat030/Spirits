import { Badge } from "@/components/ui/badge";
import { Shield, ShieldCheck } from "lucide-react";

export const roleBadge = (role: string) => {
  const isAdmin = role === "admin";
  return (
    <Badge
      variant="outline"
      className={`gap-1 px-2.5 py-0.5 text-xs font-semibold border-0 ${
        isAdmin
          ? "bg-purple-100 text-purple-700 hover:bg-purple-100"
          : "bg-slate-100 text-slate-600 hover:bg-slate-100"
      }`}
    >
      {isAdmin ? <ShieldCheck size={12} /> : <Shield size={12} />}
      <span className="capitalize">{role}</span>
    </Badge>
  );
};

export const statusBadge = (active: boolean, label: string) => {
  return (
    <Badge
      variant="outline"
      className={`px-2.5 py-0.5 text-xs font-semibold border-0 ${
        active
          ? "bg-green-100 text-green-700 hover:bg-green-100"
          : "bg-red-100 text-red-600 hover:bg-red-100"
      }`}
    >
      {label}
    </Badge>
  );
};

export const boolBadge = (value: boolean | null, t: string, f: string) => {
  return (
    <Badge
      variant="outline"
      className={`gap-1 px-2.5 py-0.5 text-xs font-semibold border-0 ${
        value
          ? "bg-emerald-100 text-emerald-700 hover:bg-emerald-100"
          : "bg-slate-100 text-slate-500 hover:bg-slate-100"
      }`}
    >
      {value ? t : f}
    </Badge>
  );
};
