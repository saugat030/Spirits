import React, { useMemo, useState } from 'react';
import { 
  useGetNetSales, 
  useGetTotalProducts, 
  useGetProductSalesDetails,
  useGetRevenueTrends,
  useGetOrderStatusDistribution,
  useGetCategoryStats
} from '../../services/api/statsApi';
import { DollarSign, Package, TrendingUp, Calendar } from 'lucide-react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, Cell,
  AreaChart, Area, PieChart, Pie, Legend
} from 'recharts';
import { ClipLoader } from 'react-spinners';
import classNames from 'classnames';
import ErrorState from '../../components/shared/ErrorState';

const COLORS = ['#f97316', '#3b82f6', '#10b981', '#f43f5e', '#8b5cf6', '#eab308'];

const DashboardPage = () => {
  const [period, setPeriod] = useState<string>('all');

  const { data: netSalesData, isLoading: isLoadingSales, isError: isErrorSales } = useGetNetSales(period);
  const { data: totalProductsData, isLoading: isLoadingProducts, isError: isErrorProducts } = useGetTotalProducts(period);
  const { data: productDetailsData, isLoading: isLoadingDetails, isError: isErrorDetails } = useGetProductSalesDetails(period);
  const { data: revenueTrendsData, isLoading: isLoadingTrends, isError: isErrorTrends } = useGetRevenueTrends(period);
  const { data: orderStatusData, isLoading: isLoadingStatus, isError: isErrorStatus } = useGetOrderStatusDistribution(period);
  const { data: categoryStatsData, isLoading: isLoadingCategory, isError: isErrorCategory } = useGetCategoryStats();

  const isLoading = isLoadingSales || isLoadingProducts || isLoadingDetails || isLoadingTrends || isLoadingStatus || isLoadingCategory;
  const isError = isErrorSales || isErrorProducts || isErrorDetails || isErrorTrends || isErrorStatus || isErrorCategory;

    const trendsChartData = useMemo(() => {
     if(!revenueTrendsData?.data) return [];
     return revenueTrendsData.data.map(item => ({
       ...item,
       // format date for better display if needed e.g. "2023-10-01" -> "Oct 01"
       formattedDate: new Date(item.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
     }));
  }, [revenueTrendsData]);

  const pieChartData = useMemo(() => {
    if(!orderStatusData?.data) return [];
    return orderStatusData.data.map(item => ({
      name: item.status.charAt(0).toUpperCase() + item.status.slice(1),
      value: item.count
    }));
  }, [orderStatusData]);

  const categoryBarData = useMemo(() => {
    if(!categoryStatsData?.data) return [];
    return categoryStatsData.data.map(item => ({
      name: item.categoryName,
      Products: item.productCount
    }));
  }, [categoryStatsData]);

  const topSellingUnits = useMemo(() => {
    if (!productDetailsData?.data) return [];
    return [...productDetailsData.data]
      .sort((a, b) => Number(b.totalQuantitySold) - Number(a.totalQuantitySold))
      .slice(0, 5);
  }, [productDetailsData]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full w-full min-h-[400px]">
        <ClipLoader color="#f97316" size={50} />
      </div>
    );
  }

  if (isError) {
    return <ErrorState title="Failed to load dashboard statistics" message="Please try refreshing the page." />;
  }

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'NPR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const netSales = Number(netSalesData?.netSales || 0);
  const totalProducts = Number(totalProductsData?.totalProducts || 0);

  const StatCard = ({ title, value, icon: Icon, bgClass }: { title: string; value: string; icon: React.ComponentType<React.SVGProps<SVGSVGElement> & { size?: string | number }>; bgClass: string }) => (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 flex flex-col hover:shadow-md transition-shadow duration-300 relative overflow-hidden group">
      <div className={classNames("absolute -right-6 -top-6 w-24 h-24 rounded-full opacity-10 transition-transform duration-500 group-hover:scale-150", bgClass)} />
      <div className="flex justify-between items-start mb-4 relative z-10">
        <div>
          <p className="text-slate-500 text-sm font-medium mb-1">{title}</p>
          <h3 className="text-3xl font-bold text-slate-800">{value}</h3>
        </div>
        <div className={classNames("p-3 rounded-xl text-white-500")}>
          <Icon size={24} />
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Dashboard Overview</h1>
          <p className="text-slate-500 text-sm mt-1">Welcome back, here's what's happening with your store.</p>
        </div>
        
        {/* Period Filter */}
        <div className="flex items-center bg-white border border-slate-200 rounded-lg p-1 shadow-sm">
          <Calendar size={16} className="text-slate-400 ml-2 mr-1" />
          <select 
            value={period}
            onChange={(e) => setPeriod(e.target.value)}
            className="bg-transparent border-none text-sm font-medium text-slate-700 focus:ring-0 cursor-pointer outline-none py-1.5 pr-8 pl-2"
          >
            <option value="7d">Last 7 Days</option>
            <option value="30d">Last 30 Days</option>
            <option value="90d">Last 90 Days</option>
            <option value="12m">Last 12 Months</option>
            <option value="all">All Time</option>
          </select>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <StatCard 
          title="Total Net Sales" 
          value={formatCurrency(netSales)} 
          icon={DollarSign}
          bgClass="bg-orange-500"
        />
        <StatCard 
          title="Total Products Sold" 
          value={totalProducts.toLocaleString()} 
          icon={Package}
          bgClass="bg-blue-500"
        />
        <StatCard 
          title="Avg. Revenue per Item" 
          value={totalProducts > 0 ? formatCurrency(netSales / totalProducts) : "NPR 0"} 
          icon={TrendingUp}
          bgClass="bg-emerald-500"
        />
      </div>

      {/* Main Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Area Chart: Revenue Trends */}
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col min-h-[400px]">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-bold text-slate-800">Revenue Trends</h2>
          </div>
          <div className="flex-1 w-full min-h-[300px]">
            {trendsChartData.length > 0 ? (
               <ResponsiveContainer width="100%" height="100%">
               <AreaChart data={trendsChartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                 <defs>
                   <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                     <stop offset="5%" stopColor="#f97316" stopOpacity={0.3}/>
                     <stop offset="95%" stopColor="#f97316" stopOpacity={0}/>
                   </linearGradient>
                 </defs>
                 <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                 <XAxis 
                   dataKey={period === '12m' ? 'date' : 'formattedDate'} 
                   axisLine={false} 
                   tickLine={false} 
                   tick={{ fill: '#64748b', fontSize: 12 }}
                   dy={10}
                 />
                 <YAxis 
                   axisLine={false} 
                   tickLine={false} 
                   tick={{ fill: '#64748b', fontSize: 12 }}
                    tickFormatter={(value) => `NPR ${value}`}
                 />
                 <RechartsTooltip 
                   cursor={{ stroke: '#cbd5e1', strokeWidth: 1, strokeDasharray: '3 3' }}
                   contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                   formatter={(value: number) => [formatCurrency(value), "Revenue"]}
                   labelStyle={{ color: '#475569', fontWeight: 'bold', marginBottom: '4px' }}
                 />
                 <Area 
                   type="monotone" 
                   dataKey="revenue" 
                   stroke="#f97316" 
                   strokeWidth={3}
                   fillOpacity={1} 
                   fill="url(#colorRevenue)" 
                 />
               </AreaChart>
             </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-full text-slate-400">No data available for this period.</div>
            )}
          </div>
        </div>

        {/* Pie Chart: Order Status Distribution */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col min-h-[400px]">
          <h2 className="text-lg font-bold text-slate-800 mb-6">Order Statuses</h2>
          <div className="flex-1 w-full min-h-[300px]">
            {pieChartData.length > 0 ? (
               <ResponsiveContainer width="100%" height="100%">
               <PieChart>
                 <Pie
                   data={pieChartData}
                   cx="50%"
                   cy="45%"
                   innerRadius={60}
                   outerRadius={80}
                   paddingAngle={5}
                   dataKey="value"
                 >
                   {pieChartData.map((_entry, index) => (
                     <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                   ))}
                 </Pie>
                 <RechartsTooltip 
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                 />
                 <Legend verticalAlign="bottom" height={36} iconType="circle" />
               </PieChart>
             </ResponsiveContainer>
            ) : (
               <div className="flex items-center justify-center h-full text-slate-400">No order data available.</div>
            )}
          </div>
        </div>
      </div>

      {/* Secondary Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Bar Chart: Products Per Category */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col min-h-[350px]">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-bold text-slate-800">Products per Category</h2>
          </div>
          <div className="flex-1 w-full min-h-[250px]">
             {categoryBarData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={categoryBarData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f5f9" />
                    <XAxis type="number" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }}/>
                    <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} width={100} />
                    <RechartsTooltip 
                      cursor={{ fill: '#f8fafc' }}
                      contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                    />
                    <Bar dataKey="Products" fill="#3b82f6" radius={[0, 4, 4, 0]} barSize={20}>
                      {categoryBarData.map((_entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[(index + 1) % COLORS.length]} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
             ) : (
                <div className="flex items-center justify-center h-full text-slate-400">No category data available.</div>
             )}
          </div>
        </div>

                {/* Top Selling Units List */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col">
          <h2 className="text-lg font-bold text-slate-800 mb-6">Top Selling Units</h2>
          <div className="space-y-4 overflow-y-auto pr-2 custom-scrollbar flex-1" style={{ maxHeight: '280px' }}>
            {topSellingUnits.length > 0 ? topSellingUnits.map((product, index) => (
              <div key={product.productId} className="flex items-center justify-between p-3 rounded-xl hover:bg-slate-50 transition-colors border border-transparent hover:border-slate-100">
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
                    <p className="font-semibold text-slate-800 text-sm max-w-[200px] truncate" title={product.productName}>
                      {product.productName}
                    </p>
                    <p className="text-xs text-slate-500 font-medium">{product.totalQuantitySold} units sold</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold text-slate-800 text-sm">{formatCurrency(Number(product.totalRevenue))}</p>
                </div>
              </div>
            )) : (
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
