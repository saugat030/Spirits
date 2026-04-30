import {
  Package,
  Calendar,
  CheckCircle,
  XCircle,
  Clock,
  AlertCircle,
  Eye,
} from "lucide-react";
import OrderDetailsDialog from "../components/OrderDetailsDialog";
import OrdersSummary from "../components/OrdersSummary";
import { useGetMyOrders } from "../services/api/ordersApi";
import { OrderStatus } from "../types/api.types";
import {
  getStatusBadgeStyles,
  getStatusLabel,
  getProgressPercentage,
} from "../utils/userUtils";
import ClipLoader from "react-spinners/ClipLoader";
import { useState } from "react";
import EmptyState from "../components/shared/EmptyState";
import ErrorState from "../components/shared/ErrorState";

const getStatusIcon = (status: OrderStatus) => {
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

const OrdersPage = () => {
  const { data: ordersResponse, isLoading, error } = useGetMyOrders();
  const orders = ordersResponse?.data || [];
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [filterStatus, setFilterStatus] = useState<OrderStatus | "all">("all");
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);
  const handleRetry = (): void => {
    window.location.reload();
  };
  const statusCounts = {
    total: orders.length,
    pending: orders.filter((o) => o.status === "pending").length,
    processing: orders.filter((o) => o.status === "processing").length,
    shipped: orders.filter((o) => o.status === "shipped").length,
    delivered: orders.filter((o) => o.status === "delivered").length,
    cancelled: orders.filter((o) => o.status === "cancelled").length,
  };

  const filteredOrders = orders.filter((order) => {
    const orderDate = new Date(order.createdAt);
    const matchesDateFrom = !dateFrom || orderDate >= new Date(dateFrom);
    const matchesDateTo = !dateTo || orderDate <= new Date(dateTo);
    const matchesDateRange = matchesDateFrom && matchesDateTo;
    const matchesFilter =
      filterStatus === "all" || order.status === filterStatus;
    return matchesDateRange && matchesFilter;
  });

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-[calc(100vh-80px)]">
        <ClipLoader color="#0D1B39" size={50} />
      </div>
    );
  }

  if (error) {
    return (
      <ErrorState
        title="Oops! A bit of a spill."
        message={error.message}
        onRetry={handleRetry}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">My Orders</h1>
          <p className="text-gray-600">
            Track and manage your orders with ease
          </p>
        </div>

        {orders.length === 0 ? (
          <EmptyState
            title="Glass Empty!"
            description="You haven't placed any orders yet. Start shopping to see your orders here."
          />
        ) : (
          <>
            <OrdersSummary statusCounts={statusCounts} />

            {/* date and Status filter */}
            <div className="bg-white rounded-lg shadow-sm border p-4 mb-6">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-2">
                    From
                  </label>
                  <input
                    type="date"
                    value={dateFrom}
                    onChange={(e) => setDateFrom(e.target.value)}
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-900 focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-2">
                    To
                  </label>
                  <input
                    type="date"
                    value={dateTo}
                    onChange={(e) => setDateTo(e.target.value)}
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-900 focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-colors"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-xs font-medium text-gray-600 mb-2">
                    Status
                  </label>
                  <select
                    value={filterStatus}
                    onChange={(e) =>
                      setFilterStatus(e.target.value as OrderStatus | "all")
                    }
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-900 focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-colors"
                  >
                    <option value="all">All Status</option>
                    <option value="pending">Pending</option>
                    <option value="processing">Processing</option>
                    <option value="shipped">In Transit</option>
                    <option value="delivered">Delivered</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Orders List */}
            {filteredOrders.length === 0 ? (
              <EmptyState
                title="No Orders Found"
                description="We couldn't find any orders matching your filters. Try adjusting the date range or status to find your orders."
              />
            ) : (
              <div className="">
                {filteredOrders.map((order) => (
                  <div
                    key={order.id}
                    className="bg-white shadow-sm hover:shadow-md transition-shadow overflow-hidden"
                  >
                    {/* desktop view table like */}
                    <div className="hidden md:grid md:grid-cols-6 gap-4 items-start p-5 border-b border-gray-100 last:border-b-0">
                      <div>
                        <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">
                          Order ID
                        </p>
                        <p className="font-semibold text-gray-900">
                          #{order.id.slice(0, 8).toUpperCase()}
                        </p>
                      </div>

                      <div>
                        <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">
                          Date
                        </p>
                        <p className="text-sm text-gray-900">
                          {new Date(order.createdAt).toLocaleDateString(
                            "en-US",
                            {
                              year: "numeric",
                              month: "short",
                              day: "numeric",
                            },
                          )}
                        </p>
                      </div>

                      <div>
                        <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">
                          Total
                        </p>
                        <p className="font-semibold text-gray-900">
                          Rs. {order.totalAmount.toLocaleString()}
                        </p>
                      </div>

                      <div>
                        <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">
                          Status
                        </p>
                        <div className={getStatusBadgeStyles(order.status)}>
                          {getStatusIcon(order.status)}
                          <span>{getStatusLabel(order.status)}</span>
                        </div>
                      </div>

                      <div>
                        <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">
                          Payment
                        </p>
                        <p className="text-sm text-gray-900 capitalize">
                          {order.paymentMethod === "cod"
                            ? "Cash on Delivery"
                            : order.paymentMethod}
                        </p>
                      </div>

                      <div className="flex items-center justify-end">
                        <button
                          type="button"
                          onClick={() => setSelectedOrderId(order.id)}
                          className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-gray-200 bg-gray-50 text-gray-700 transition hover:bg-gray-100"
                          aria-label="View order details"
                        >
                          <Eye className="h-5 w-5" />
                        </button>
                      </div>
                    </div>

                    {/* mobile view card style */}
                    <div className="md:hidden p-5">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">
                            Order
                          </p>
                          <p className="font-semibold text-gray-900 text-lg">
                            #{order.id.slice(0, 8).toUpperCase()}
                          </p>
                        </div>
                        <div className={getStatusBadgeStyles(order.status)}>
                          {getStatusIcon(order.status)}
                          <span>{getStatusLabel(order.status)}</span>
                        </div>
                      </div>

                      <div className="space-y-3 mb-4">
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-600">
                            <Calendar className="w-4 h-4 inline mr-2" />
                            {new Date(order.createdAt).toLocaleDateString(
                              "en-US",
                              {
                                year: "numeric",
                                month: "short",
                                day: "numeric",
                              },
                            )}
                          </span>
                          <span className="text-sm font-semibold text-gray-900">
                            Rs. {order.totalAmount.toLocaleString()}
                          </span>
                        </div>
                        <div className="flex justify-between text-sm text-gray-600">
                          <span>
                            Payment:{" "}
                            {order.paymentMethod === "cod"
                              ? "Cash on Delivery"
                              : order.paymentMethod}
                          </span>
                        </div>
                      </div>

                      {/* Progress Bar */}
                      {order.status !== "cancelled" && (
                        <div className="mb-4">
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div
                              className={`h-2 rounded-full transition-all ${
                                order.status === "delivered"
                                  ? "bg-green-500"
                                  : order.status === "shipped"
                                    ? "bg-blue-500"
                                    : order.status === "processing"
                                      ? "bg-yellow-500"
                                      : "bg-orange-500"
                              }`}
                              style={{
                                width: `${getProgressPercentage(order.status)}%`,
                              }}
                            ></div>
                          </div>
                        </div>
                      )}

                      <button
                        type="button"
                        onClick={() => setSelectedOrderId(order.id)}
                        className="w-full rounded-xl bg-gray-100 px-4 py-3 text-sm font-semibold text-gray-700 transition hover:bg-gray-200"
                      >
                        View Details
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* results count */}
            <div className="mt-6 text-center text-sm text-gray-600">
              Showing {filteredOrders.length} of {orders.length} orders
            </div>
          </>
        )}
      </div>
      <OrderDetailsDialog
        orderId={selectedOrderId}
        onClose={() => setSelectedOrderId(null)}
      />
    </div>
  );
};

export default OrdersPage;
