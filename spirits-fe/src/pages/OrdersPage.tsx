import { Calendar, Eye, Search } from "lucide-react";
import OrderDetailsDialog from "../components/OrderDetailsDialog";
import OrdersSummary from "../components/OrdersSummary";
import Pagination from "../components/Pagination";
import { useGetMyOrders } from "../services/api/ordersApi";
import { OrderStatus } from "../types/api.types";
import {
  getStatusBadgeStyles,
  getStatusLabel,
  getProgressPercentage,
  getStatusIcon,
} from "../utils/userUtils";
import ClipLoader from "react-spinners/ClipLoader";
import { useState, useEffect } from "react";
import { useDebounce } from "../hooks/useDebounce";
import EmptyState from "../components/shared/EmptyState";
import ErrorState from "../components/shared/ErrorState";

const OrdersPage = () => {
  const [page, setPage] = useState(1);
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [filterStatus, setFilterStatus] = useState<OrderStatus | "all">("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState<"date" | "status">("date");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);
  const debouncedSearch = useDebounce(searchTerm, 500);

  const { data: ordersResponse, isLoading, error } = useGetMyOrders(
    page,
    10,
    filterStatus,
    debouncedSearch || undefined,
    sortBy,
    sortOrder,
    dateFrom || undefined,
    dateTo || undefined
  );

  const orders = ordersResponse?.data?.orders || [];
  const pagination = ordersResponse?.data?.pagination;
  const summary = ordersResponse?.data?.summary;

  useEffect(() => {
    setPage(1);
  }, [filterStatus, debouncedSearch, sortBy, sortOrder, dateFrom, dateTo]);

  const handleRetry = (): void => {
    window.location.reload();
  };

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

        {ordersResponse?.data && ordersResponse.data.orders.length === 0 && !debouncedSearch && !dateFrom && !dateTo && filterStatus === "all" ? (
          <EmptyState
            title="Glass Empty!"
            description="You haven't placed any orders yet. Start shopping to see your orders here."
          />
        ) : (
          <>
            {summary && <OrdersSummary statusCounts={summary} />}

            {/* Filters */}
            <div className="bg-white rounded-lg shadow-sm border p-4 mb-6">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-2">
                    Search
                  </label>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search by order ID..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-9 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-900 focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-colors"
                    />
                  </div>
                </div>

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

                <div className="flex gap-2">
                  <div className="flex-1">
                    <label className="block text-xs font-medium text-gray-600 mb-2">
                      Status
                    </label>
                    <select
                      value={filterStatus}
                      onChange={(e) =>
                        setFilterStatus(e.target.value as OrderStatus | "all")
                      }
                      className="font-Poppins w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-900 focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-colors"
                    >
                      <option value="all">All Status</option>
                      <option value="pending">Pending</option>
                      <option value="processing">Processing</option>
                      <option value="shipped">In Transit</option>
                      <option value="delivered">Delivered</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </div>
                  <div className="flex-1">
                    <label className="block text-xs font-medium text-gray-600 mb-2">
                      Sort
                    </label>
                    <select
                      value={`${sortBy}-${sortOrder}`}
                      onChange={(e) => {
                        const [by, order] = e.target.value.split("-") as ["date" | "status", "asc" | "desc"];
                        setSortBy(by);
                        setSortOrder(order);
                      }}
                      className="font-Poppins w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-900 focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-colors"
                    >
                      <option value="date-desc">Newest First</option>
                      <option value="date-asc">Oldest First</option>
                      <option value="status-asc">Status (Pending first)</option>
                      <option value="status-desc">Status (Cancelled first)</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>

            {/* Orders List */}
            {orders.length === 0 ? (
              <EmptyState
                title="No Orders Found"
                description="We couldn't find any orders matching your criteria. Try adjusting your filters or search term."
              />
            ) : (
              <div className="">
                {orders.map((order) => (
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
                      {/* progress bar */}
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

            {/* pagination */}
            {pagination && pagination.totalPages > 1 && (
              <div className="mt-6 flex flex-col items-center gap-3">
                <div className="text-sm text-gray-600">
                  Showing page {pagination.page} of {pagination.totalPages} ({pagination.total} total orders)
                </div>
                <Pagination
                  currentPage={page}
                  totalPages={pagination.totalPages}
                  isLoading={isLoading}
                  onPageChange={setPage}
                />
              </div>
            )}
            {pagination && pagination.totalPages <= 1 && orders.length > 0 && (
              <div className="mt-6 text-center text-sm text-gray-600">
                Showing {orders.length} order{orders.length !== 1 ? "s" : ""}
              </div>
            )}
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
