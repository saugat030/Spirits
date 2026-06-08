import { useState, useEffect } from 'react';
import { useGetAdminOrders, useUpdateOrderStatus } from '../../services/api/ordersApi';
import OrderDetailsDialog from '../../components/OrderDetailsDialog';
import Pagination from '../../components/Pagination';
import { OrderStatus } from '../../types/api.types';
import { format } from 'date-fns';
import classNames from 'classnames';
import { toast } from 'react-hot-toast';
import { useQueryClient } from '@tanstack/react-query';
import { Filter, Loader2, Eye, AlertCircle, Search } from 'lucide-react';
import { useDebounce } from '../../hooks/useDebounce';

const STATUS_COLORS: Record<OrderStatus, { bg: string; text: string }> = {
  pending: { bg: 'bg-yellow-100', text: 'text-yellow-800' },
  processing: { bg: 'bg-blue-100', text: 'text-blue-800' },
  shipped: { bg: 'bg-purple-100', text: 'text-purple-800' },
  delivered: { bg: 'bg-green-100', text: 'text-green-800' },
  cancelled: { bg: 'bg-red-100', text: 'text-red-800' },
};

const OrdersPage = () => {
  const queryClient = useQueryClient();
  const [page, setPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<'date' | 'status'>('date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const debouncedSearch = useDebounce(searchTerm, 500);

  const { data: ordersData, isLoading, isError } = useGetAdminOrders(
    page,
    10,
    statusFilter,
    debouncedSearch || undefined,
    sortBy,
    sortOrder
  );
  const { mutate: updateStatus, isPending: isUpdating } = useUpdateOrderStatus();

  const orders = ordersData?.data?.orders || [];
  const pagination = ordersData?.data?.pagination;

  useEffect(() => {
    setPage(1);
  }, [statusFilter, debouncedSearch, sortBy, sortOrder]);

  const handleStatusChange = (orderId: string, newStatus: OrderStatus) => {
    updateStatus(
      { orderId, status: newStatus },
      {
        onSuccess: () => {
          toast.success('Order status updated successfully');
          queryClient.invalidateQueries({ queryKey: ["admin-orders"] });
          queryClient.invalidateQueries({ queryKey: ["stats"] });
        },
        onError: (error) => {
          toast.error(error.response?.data?.message || 'Failed to update order status');
        }
      }
    );
  };

  const handleViewDetails = (id: string) => {
    setSelectedOrderId(id);
    setIsDetailsOpen(true);
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(value);
  };

  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center h-full min-h-[400px] text-red-500 gap-4">
        <AlertCircle size={48} />
        <h2 className="text-xl font-semibold">Failed to load orders</h2>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Order Management</h1>
          <p className="text-slate-500 text-sm mt-1">View and update customer orders.</p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-100">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search by order ID or customer..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 border border-slate-200 rounded-lg text-sm focus:ring-orange-500 focus:border-orange-500"
            />
          </div>
          <div className="flex items-center gap-2">
            <Filter size={20} className="text-slate-400 shrink-0" />
            <span className="text-sm font-medium text-slate-700 whitespace-nowrap">Status:</span>
            <select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setPage(1);
              }}
              className="w-full border-slate-200 rounded-lg text-sm focus:ring-orange-500 focus:border-orange-500"
            >
              <option value="all">All Orders</option>
              <option value="pending">Pending</option>
              <option value="processing">Processing</option>
              <option value="shipped">Shipped</option>
              <option value="delivered">Delivered</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-slate-700 whitespace-nowrap">Sort:</span>
            <select
              value={`${sortBy}-${sortOrder}`}
              onChange={(e) => {
                const [by, order] = e.target.value.split('-') as ['date' | 'status', 'asc' | 'desc'];
                setSortBy(by);
                setSortOrder(order);
              }}
              className="w-full border-slate-200 rounded-lg text-sm focus:ring-orange-500 focus:border-orange-500"
            >
              <option value="date-desc">Newest First</option>
              <option value="date-asc">Oldest First</option>
              <option value="status-asc">Status (Pending first)</option>
              <option value="status-desc">Status (Cancelled first)</option>
            </select>
          </div>
          {pagination && (
            <div className="flex items-center text-sm text-slate-500">
              {pagination.total} order{pagination.total !== 1 ? 's' : ''} found
            </div>
          )}
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100 text-slate-500 text-sm">
                <th className="p-4 font-semibold">Order ID</th>
                <th className="p-4 font-semibold">Date</th>
                <th className="p-4 font-semibold">Total Amount</th>
                <th className="p-4 font-semibold">Status</th>
                <th className="p-4 font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {isLoading ? (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-slate-500">
                    <Loader2 className="w-8 h-8 animate-spin mx-auto text-orange-500" />
                    <p className="mt-2">Loading orders...</p>
                  </td>
                </tr>
              ) : orders.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-slate-500">
                    No orders found matching your criteria.
                  </td>
                </tr>
              ) : (
                orders.map((order) => (
                  <tr key={order.id} className="hover:bg-slate-50 transition-colors">
                    <td className="p-4">
                      <span className="font-mono text-sm text-slate-700 font-medium">
                        {order.id.split('-')[0]}...
                      </span>
                    </td>
                    <td className="p-4 text-sm text-slate-600">
                      {format(new Date(order.createdAt), 'MMM dd, yyyy HH:mm')}
                    </td>
                    <td className="p-4 text-sm font-semibold text-slate-800">
                      {formatCurrency(order.totalAmount)}
                    </td>
                    <td className="p-4">
                      <select
                        value={order.status}
                        onChange={(e) => handleStatusChange(order.id, e.target.value as OrderStatus)}
                        disabled={isUpdating}
                        className={classNames(
                          "text-xs font-semibold px-2.5 py-1 rounded-full border-none cursor-pointer focus:ring-2 focus:ring-offset-1 focus:outline-none appearance-none pr-8",
                          STATUS_COLORS[order.status].bg,
                          STATUS_COLORS[order.status].text
                        )}
                        style={{ backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`, backgroundPosition: 'right 0.25rem center', backgroundRepeat: 'no-repeat', backgroundSize: '1.25em 1.25em' }}
                      >
                        <option value="pending">Pending</option>
                        <option value="processing">Processing</option>
                        <option value="shipped">Shipped</option>
                        <option value="delivered">Delivered</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                    </td>
                    <td className="p-4">
                      <button
                        onClick={() => handleViewDetails(order.id)}
                        className="text-slate-400 hover:text-orange-500 transition-colors p-1.5 rounded-lg hover:bg-orange-50"
                        title="View Details"
                      >
                        <Eye size={18} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {pagination && pagination.totalPages > 1 && (
          <div className="p-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
            <span className="text-sm text-slate-500">
              Showing page {pagination.page} of {pagination.totalPages}
            </span>
            <Pagination
              currentPage={page}
              totalPages={pagination.totalPages}
              isLoading={isLoading}
              onPageChange={setPage}
            />
          </div>
        )}
      </div>

      {isDetailsOpen && selectedOrderId && (
        <OrderDetailsDialog orderId={selectedOrderId} onClose={() => setIsDetailsOpen(false)} useAdminApi />
      )}
    </div>
  );
};

export default OrdersPage;
