import { AlertCircle, Clock, Truck, CheckCircle } from "lucide-react";

interface OrdersSummaryProps {
  statusCounts: {
    total: number;
    pending: number;
    processing: number;
    shipped: number;
    delivered: number;
    cancelled: number;
  };
}

const OrdersSummary = ({ statusCounts }: OrdersSummaryProps) => {
  return (
    <div className="mb-8 relative rounded-3xl bg-white p-8 border border-gray-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] overflow-hidden">
      {/* decorative backgrounds for coolness */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-full blur-3xl opacity-60 -translate-y-20 translate-x-20 pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 w-72 h-72 bg-gradient-to-tr from-amber-100 to-orange-100 rounded-full blur-3xl opacity-60 translate-y-20 -translate-x-10 pointer-events-none"></div>
      <div className="relative z-10 flex flex-col lg:flex-row gap-10 items-center">
        {/* total orders highlight */}
        <div className="flex-shrink-0 text-center lg:text-left lg:w-1/4 lg:border-r lg:border-gray-200 lg:pr-8">
          <h3 className="text-gray-500 text-sm font-medium uppercase tracking-wider">Total Orders</h3>
          <div className="mt-2 flex items-baseline justify-center lg:justify-start gap-2">
            <span className="text-5xl font-black text-gray-900 tracking-tight">{statusCounts.total}</span>
          </div>
        </div>

        {/* status breakdown */}
        <div className="flex-grow w-full">
          <div className="flex justify-between items-end mb-6">
            <h3 className="text-gray-500 text-sm font-medium uppercase tracking-wider text-center lg:text-left w-full lg:w-auto">Status Breakdown</h3>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {/* metric item */}
            <div className="flex flex-col items-center lg:items-start group">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 rounded-full bg-orange-50 text-orange-500 group-hover:scale-110 group-hover:bg-orange-100 transition-all duration-300">
                  <AlertCircle className="w-5 h-5" />
                </div>
                <span className="text-2xl font-bold text-gray-900">{statusCounts.pending}</span>
              </div>
              <span className="text-sm font-medium text-gray-500 group-hover:text-gray-900 transition-colors">Pending</span>
            </div>

            <div className="flex flex-col items-center lg:items-start group">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 rounded-full bg-yellow-50 text-yellow-600 group-hover:scale-110 group-hover:bg-yellow-100 transition-all duration-300">
                  <Clock className="w-5 h-5" />
                </div>
                <span className="text-2xl font-bold text-gray-900">{statusCounts.processing}</span>
              </div>
              <span className="text-sm font-medium text-gray-500 group-hover:text-gray-900 transition-colors">Processing</span>
            </div>

            <div className="flex flex-col items-center lg:items-start group">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 rounded-full bg-blue-50 text-blue-500 group-hover:scale-110 group-hover:bg-blue-100 transition-all duration-300">
                  <Truck className="w-5 h-5" />
                </div>
                <span className="text-2xl font-bold text-gray-900">{statusCounts.shipped}</span>
              </div>
              <span className="text-sm font-medium text-gray-500 group-hover:text-gray-900 transition-colors">In Transit</span>
            </div>

            <div className="flex flex-col items-center lg:items-start group">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 rounded-full bg-green-50 text-green-500 group-hover:scale-110 group-hover:bg-green-100 transition-all duration-300">
                  <CheckCircle className="w-5 h-5" />
                </div>
                <span className="text-2xl font-bold text-gray-900">{statusCounts.delivered}</span>
              </div>
              <span className="text-sm font-medium text-gray-500 group-hover:text-gray-900 transition-colors">Delivered</span>
            </div>
          </div>
          
          {/* proportion bar */}
          {statusCounts.total > 0 && (
            <div className="mt-8 flex w-full h-3 bg-gray-100 rounded-full overflow-hidden">
              <div className="bg-orange-400 hover:bg-orange-500 transition-all duration-500" style={{ width: `${(statusCounts.pending / statusCounts.total) * 100}%` }} title={`Pending: ${statusCounts.pending}`}></div>
              <div className="bg-yellow-400 hover:bg-yellow-500 transition-all duration-500" style={{ width: `${(statusCounts.processing / statusCounts.total) * 100}%` }} title={`Processing: ${statusCounts.processing}`}></div>
              <div className="bg-blue-400 hover:bg-blue-500 transition-all duration-500" style={{ width: `${(statusCounts.shipped / statusCounts.total) * 100}%` }} title={`In Transit: ${statusCounts.shipped}`}></div>
              <div className="bg-green-400 hover:bg-green-500 transition-all duration-500" style={{ width: `${(statusCounts.delivered / statusCounts.total) * 100}%` }} title={`Delivered: ${statusCounts.delivered}`}></div>
              <div className="bg-red-400 hover:bg-red-500 transition-all duration-500" style={{ width: `${(statusCounts.cancelled / statusCounts.total) * 100}%` }} title={`Cancelled: ${statusCounts.cancelled}`}></div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default OrdersSummary;
