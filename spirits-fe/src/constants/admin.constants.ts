import { LayoutDashboard, Users, Tags, Package, ShoppingCart, Gift, MoreHorizontal } from "lucide-react";

export const ADMIN_NAV_ITEMS = [
  { name: "Dashboard", path: "/admin", icon: LayoutDashboard, exact: true },
  { name: "Users", path: "/admin/users", icon: Users },
  { name: "Categories", path: "/admin/categories", icon: Tags },
  { name: "Products", path: "/admin/products", icon: Package },
  { name: "Orders", path: "/admin/orders", icon: ShoppingCart },
  { name: "Promotions", path: "/admin/promotions", icon: Gift },
  { name: "Others", path: "/admin/others", icon: MoreHorizontal },
];