import { XCircle, Package, Clock, AlertCircle, CheckCircle } from "lucide-react";
import ClipLoader from "react-spinners/ClipLoader";
import { useGetOrderById } from "../services/api/ordersApi";
import { OrderWithDetails } from "../types/api.types";
import { formatDate, getStatusBadgeStyles, getStatusLabel } from "../utils/userUtils";

type OrderDetailsDialogProps = {
  orderId: string | null;
  onClose: () => void;
};


const getStatusIcon = (status: string) => {
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

const OrderDetailsDialog = ({ orderId, onClose }: OrderDetailsDialogProps) => {
  const { data, isLoading, error } = useGetOrderById(orderId);
  const order = data?.data as OrderWithDetails | undefined;

  if (!orderId) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
      onClick={onClose}
    >
      <div
        className="w-full max-w-3xl overflow-hidden rounded-3xl bg-white shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Order Details</h2>
            <p className="text-sm text-gray-500">Full order information and items</p>
          </div>
          <button
            onClick={onClose}
            className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-gray-100 text-gray-700 transition hover:bg-gray-200"
            aria-label="Close order details"
          >
            <XCircle className="h-5 w-5" />
          </button>
        </div>

        <div className="max-h-[75vh] overflow-y-auto px-6 py-5">
          {isLoading ? (
            <div className="flex min-h-[220px] items-center justify-center">
              <ClipLoader color="#0D1B39" size={40} />
            </div>
          ) : error ? (
            <div className="rounded-2xl bg-red-50 p-6 text-center text-sm text-red-700">
              <p>Unable to load order details.</p>
              <p className="mt-2 text-xs text-red-500">{error.message}</p>
            </div>
          ) : !order ? (
            <div className="rounded-2xl bg-gray-50 p-6 text-center text-sm text-gray-700">
              <p>No order details available.</p>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="grid gap-4 md:grid-cols-3">
                <div className="rounded-2xl bg-gray-50 p-4">
                  <p className="text-xs uppercase tracking-wide text-gray-500">Order ID</p>
                  <p className="mt-2 break-all text-sm font-semibold text-gray-900">{order.id.slice(0, 8).toUpperCase()}</p>
                </div>
                <div className="rounded-2xl bg-gray-50 p-4">
                  <p className="text-xs uppercase tracking-wide text-gray-500">Status</p>
                  <div className={getStatusBadgeStyles(order.status)}>
                    {getStatusIcon(order.status)}
                    <span>{getStatusLabel(order.status)}</span>
                  </div>
                </div>
                <div className="rounded-2xl bg-gray-50 p-4">
                  <p className="text-xs uppercase tracking-wide text-gray-500">Total</p>
                  <p className="mt-2 text-lg font-semibold text-gray-900">Rs. {order.totalAmount.toLocaleString()}</p>
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-3">
                <div className="rounded-2xl bg-gray-50 p-4">
                  <p className="text-xs uppercase tracking-wide text-gray-500">Payment Method</p>
                  <p className="mt-2 text-sm text-gray-900 capitalize">
                    {order.paymentMethod === "cod" ? "Cash on Delivery" : order.paymentMethod}
                  </p>
                </div>
                <div className="rounded-2xl bg-gray-50 p-4">
                  <p className="text-xs uppercase tracking-wide text-gray-500">Payment Status</p>
                  <p className="mt-2 text-sm text-gray-900 capitalize">{order.paymentStatus}</p>
                </div>
                <div className="rounded-2xl bg-gray-50 p-4">
                  <p className="text-xs uppercase tracking-wide text-gray-500">Created</p>
                  <p className="mt-2 text-sm text-gray-900">{formatDate(order.createdAt)}</p>
                  <p className="mt-3 text-xs text-gray-500">Updated: {formatDate(order.updatedAt)}</p>
                </div>
              </div>

              <div className="rounded-3xl bg-gray-50 p-5">
                <p className="text-sm font-semibold text-gray-900">Shipping Address</p>
                <p className="mt-2 text-sm text-gray-700">{order.shippingAddress}</p>
              </div>

              <div className="rounded-3xl bg-white p-5 shadow-sm">
                <div className="mb-4 flex items-center justify-between">
                  <div>
                    <p className="text-sm font-semibold text-gray-900">Items</p>
                    <p className="text-xs text-gray-500">{order.items.length} item(s)</p>
                  </div>
                </div>
                <div className="space-y-3">
                  {order.items.map((item) => (
                    <div key={item.id} className="rounded-2xl border border-gray-200 p-4">
                      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                          <p className="text-sm font-semibold text-gray-900">Variant ID</p>
                          <p className="mt-1 text-sm text-gray-600 break-all">{item.variantId}</p>
                        </div>
                        <div className="text-sm text-gray-700">
                          Qty: {item.quantity}
                        </div>
                      </div>
                      <div className="mt-3 grid gap-2 sm:grid-cols-3">
                        <div>
                          <p className="text-xs uppercase tracking-wide text-gray-500">Price</p>
                          <p className="mt-1 text-sm text-gray-900">Rs. {item.priceAtPurchase.toLocaleString()}</p>
                        </div>
                        <div>
                          <p className="text-xs uppercase tracking-wide text-gray-500">Discount</p>
                          <p className="mt-1 text-sm text-gray-900">Rs. {item.discountAmount.toLocaleString()}</p>
                        </div>
                        <div>
                          <p className="text-xs uppercase tracking-wide text-gray-500">Line total</p>
                          <p className="mt-1 text-sm text-gray-900">Rs. {(item.priceAtPurchase * item.quantity).toLocaleString()}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default OrderDetailsDialog;
