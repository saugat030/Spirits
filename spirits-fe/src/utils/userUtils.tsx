import {
  CheckCircle,
  Package,
  Clock,
  AlertCircle,
  XCircle,
} from "lucide-react";
import { OrderStatus } from "../types/api.types";

export const getStatusLabel = (status: OrderStatus) => {
  if (status === "shipped") return "In Transit";
  return status.charAt(0).toUpperCase() + status.slice(1);
};

export const getStatusBadgeStyles = (status: OrderStatus) => {
  const baseStyles =
    "inline-flex items-center space-x-1 px-3 py-1 rounded-full text-xs font-semibold";
  switch (status) {
    case "delivered":
      return `${baseStyles} bg-green-100 text-green-800`;
    case "shipped":
      return `${baseStyles} bg-blue-100 text-blue-800`;
    case "processing":
      return `${baseStyles} bg-yellow-100 text-yellow-800`;
    case "pending":
      return `${baseStyles} bg-orange-100 text-orange-800`;
    case "cancelled":
      return `${baseStyles} bg-red-100 text-red-800`;
    default:
      return `${baseStyles} bg-gray-100 text-gray-800`;
  }
};

export const getProgressPercentage = (status: OrderStatus): number => {
  switch (status) {
    case "pending":
      return 25;
    case "processing":
      return 50;
    case "shipped":
      return 75;
    case "delivered":
      return 100;
    case "cancelled":
      return 0;
    default:
      return 0;
  }
};

export const formatDate = (dateString: string) =>
  new Date(dateString).toLocaleString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });

export const getStatusIcon = (status: OrderStatus) => {
  switch (status) {
    case "delivered":
      return <CheckCircle className="w-5 h-5 text-green-500" />;
    case "shipped":
      return <Package className="w-5 h-5 text-blue-500" />;
    case "processing":
      return <Clock className="w-5 h-5 text-yellow-500" />;
    case "pending":
      return <AlertCircle className="w-5 h-5 text-orange-500" />;
    case "cancelled":
      return <XCircle className="w-5 h-5 text-red-500" />;
    default:
      return <AlertCircle className="w-5 h-5 text-gray-500" />;
  }
};
