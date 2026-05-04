import React, { useMemo } from 'react';
import { useGetNetSales, useGetTotalProducts, useGetProductSalesDetails } from '../../services/api/statsApi';
import { DollarSign, Package, TrendingUp, AlertCircle } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { ClipLoader } from 'react-spinners';
import classNames from 'classnames';

const DashboardPage = () => {
  const { data: netSalesData, isLoading: isLoadingSales, isError: isErrorSales } = useGetNetSales();
  const { data: totalProductsData, isLoading: isLoadingProducts, isError: isErrorProducts } = useGetTotalProducts();
  const { data: productDetailsData, isLoading: isLoadingDetails, isError: isErrorDetails } = useGetProductSalesDetails();

  const isLoading = isLoadingSales || isLoadingProducts || isLoadingDetails;
  const isError = isErrorSales || isErrorProducts || isErrorDetails;

  const chartData = useMemo(() => {
    if (!productDetailsData?.data) return [];
    // Sort by revenue to show top selling products
    return [...productDetailsData.data]
      .sort((a, b) => Number(b.totalRevenue) - Number(a.totalRevenue))
      .slice(0, 10) // Top 10 products
      .map(item => ({
        name: item.productName,
        Revenue: Number(item.totalRevenue),
        Quantity: Number(item.totalQuantitySold),
      }));
  }, [productDetailsData]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full w-full min-h-[400px]">
        <ClipLoader color="#f97316" size={50} />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center h-full w-full min-h-[400px] text-red-500 gap-4">
        <AlertCircle size={48} />
        <h2 className="text-xl font-semibold">Failed to load dashboard statistics</h2>
        <p className="text-sm text-slate-500">Please try refreshing the page.</p>
      </div>
    );
  }

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const netSales = Number(netSalesData?.netSales || 0);
  const totalProducts = Number(totalProductsData?.totalProducts || 0);

  const StatCard = ({ title, value, icon: Icon, colorClass, bgClass, trend }: any) => (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 flex flex-col hover:shadow-md transition-shadow duration-300 relative overflow-hidden group">
      <div className={classNames("absolute -right-6 -top-6 w-24 h-24 rounded-full opacity-10 transition-transform duration-500 group-hover:scale-150", bgClass)} />
      <div className="flex justify-between items-start mb-4 relative z-10">
        <div>
          <p className="text-slate-500 text-sm font-medium mb-1">{title}</p>
          <h3 className="text-3xl font-bold text-slate-800">{value}</h3>
        </div>
        <div className={classNames("p-3 rounded-xl", bgClass, colorClass)}>
          <Icon size={24} />
        </div>
      </div>
      {trend && (
        <div className="flex items-center text-sm font-medium text-emerald-500 relative z-10">
          <TrendingUp size={16} className="mr-1" />
          <span>{trend}</span>
          <span className="text-slate-400 ml-2 font-normal">vs last month</span>
        </div>
      )}
    </div>
  );

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <h1 className="text-2xl font-bold text-slate-800">Dashboard Overview</h1>
        <p className="text-slate-500 text-sm mt-1">Welcome back, here's what's happening with your store today.</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <StatCard 
          title="Total Net Sales" 
          value={formatCurrency(netSales)} 
          icon={DollarSign}
          colorClass="text-orange-600"
          bgClass="bg-orange-500"
          trend="+12.5%"
        />
        <StatCard 
          title="Total Products Sold" 
          value={totalProducts.toLocaleString()} 
          icon={Package}
          colorClass="text-blue-600"
          bgClass="bg-blue-500"
          trend="+5.2%"
        />
        <StatCard 
          title="Avg. Revenue per Item" 
          value={totalProducts > 0 ? formatCurrency(netSales / totalProducts) : "$0"} 
          icon={TrendingUp}
          colorClass="text-emerald-600"
          bgClass="bg-emerald-500"
        />
      </div>

      {/* Charts & Tables Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Chart */}
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col min-h-[400px]">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-bold text-slate-800">Top Products by Revenue</h2>
          </div>
          <div className="flex-1 w-full min-h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis 
                  dataKey="name" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: '#64748b', fontSize: 12 }}
                  dy={10}
                  tickFormatter={(value) => value.length > 15 ? `${value.substring(0, 15)}...` : value}
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: '#64748b', fontSize: 12 }}
                  tickFormatter={(value) => `$${value}`}
                />
                <Tooltip 
                  cursor={{ fill: '#f8fafc' }}
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                />
                <Bar dataKey="Revenue" fill="#f97316" radius={[4, 4, 0, 0]} maxBarSize={40}>
                  {chartData.map((_entry, index) => (
                    <Cell key={`cell-${index}`} fill={index === 0 ? '#ea580c' : '#f97316'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Top Products List */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col">
          <h2 className="text-lg font-bold text-slate-800 mb-6">Top Selling Units</h2>
          <div className="space-y-4 overflow-y-auto pr-2 custom-scrollbar flex-1" style={{ maxHeight: '350px' }}>
            {productDetailsData?.data && [...productDetailsData.data]
              .sort((a, b) => Number(b.totalQuantitySold) - Number(a.totalQuantitySold))
              .slice(0, 5)
              .map((product, index) => (
              <div key={product.productId} className="flex items-center justify-between p-3 rounded-xl hover:bg-slate-50 transition-colors">
                <div className="flex items-center gap-4">
                  <div className={classNames(
                    "w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm",
                    index === 0 ? "bg-amber-100 text-amber-600" : 
                    index === 1 ? "bg-slate-200 text-slate-600" : 
                    index === 2 ? "bg-amber-50 text-amber-700" : "bg-slate-100 text-slate-500"
                  )}>
                    #{index + 1}
                  </div>
                  <div>
                    <p className="font-semibold text-slate-800 text-sm max-w-[120px] truncate" title={product.productName}>
                      {product.productName}
                    </p>
                    <p className="text-xs text-slate-500">{product.totalQuantitySold} units sold</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold text-slate-800 text-sm">{formatCurrency(Number(product.totalRevenue))}</p>
                </div>
              </div>
            ))}
            {(!productDetailsData?.data || productDetailsData.data.length === 0) && (
              <div className="text-center text-slate-500 py-8">
                No sales data available yet.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
