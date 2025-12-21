import React, { useState, useEffect } from 'react';
import { TrendingUp, DollarSign, ShoppingBag, Users, ArrowUp, ArrowDown } from 'lucide-react';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { getApiUrl } from '../api/config';

const AnalyticsPage = () => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchAnalytics = async () => {
            try {
                const response = await fetch(getApiUrl('analytics/dashboard/'));
                const jsonData = await response.json();
                if (response.ok) {
                    setData(jsonData.data);
                } else {
                    setError('Failed to load analytics data');
                }
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchAnalytics();
    }, []);

    if (loading) {
        return (
            <div className="h-full flex justify-center items-center bg-gray-50">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="h-full flex justify-center items-center bg-gray-50 text-red-600">
                <p>Error: {error}</p>
            </div>
        );
    }

    if (!data) return null;

    const stats = [
        {
            title: 'Total Revenue',
            value: `₹${data.totalRevenue?.toFixed(2) || '0.00'}`,
            change: '+0%', // Dynamic change % requires historical comparison
            trend: 'up',
            icon: DollarSign,
            color: 'blue',
        },
        {
            title: 'Total Orders',
            value: data.totalOrders || 0,
            change: '+0%',
            trend: 'up',
            icon: ShoppingBag,
            color: 'green',
        },
        {
            title: 'Today Revenue',
            value: `₹${data.todayRevenue?.toFixed(2) || '0.00'}`,
            change: 'Today',
            trend: 'up',
            icon: TrendingUp,
            color: 'orange',
        },
        {
            title: 'Today Orders',
            value: data.todayOrders || 0,
            change: 'Today',
            trend: 'up', // Neutral
            icon: Users,
            color: 'purple',
        },
    ];

    return (
        <div className="h-screen overflow-y-auto bg-gray-50">
            <div className="p-8">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-800">Analytics Dashboard</h1>
                    <p className="text-gray-500 mt-2">Track your business performance</p>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-4 gap-6 mb-8">
                    {stats.map((stat, index) => (
                        <div key={index} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                            <div className="flex items-start justify-between mb-4">
                                <div className={`w-12 h-12 rounded-xl bg-${stat.color}-100 flex items-center justify-center`}>
                                    <stat.icon className={`text-${stat.color}-600`} size={24} />
                                </div>
                                <div className={`flex items-center gap-1 text-sm font-medium ${stat.trend === 'up' ? 'text-green-600' : 'text-red-600'
                                    }`}>
                                    {stat.trend === 'up' ? <ArrowUp size={16} /> : <ArrowDown size={16} />}
                                    {stat.change}
                                </div>
                            </div>
                            <div className="text-2xl font-bold text-gray-800 mb-1">{stat.value}</div>
                            <div className="text-sm text-gray-500">{stat.title}</div>
                        </div>
                    ))}
                </div>

                {/* Charts Row */}
                <div className="grid grid-cols-2 gap-6 mb-8">
                    {/* Sales Chart */}
                    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                        <h3 className="text-lg font-bold text-gray-800 mb-6">Sales Overview</h3>
                        <ResponsiveContainer width="100%" height={300}>
                            <LineChart data={data.revenueData || []}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                                <XAxis dataKey="name" stroke="#9ca3af" />
                                <YAxis stroke="#9ca3af" />
                                <Tooltip
                                    contentStyle={{
                                        backgroundColor: '#fff',
                                        border: '1px solid #e5e7eb',
                                        borderRadius: '8px'
                                    }}
                                />
                                <Legend />
                                <Line
                                    type="monotone"
                                    dataKey="value"
                                    stroke="#3b82f6"
                                    strokeWidth={3}
                                    dot={{ fill: '#3b82f6', r: 4 }}
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>

                    {/* Category Distribution */}
                    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                        <h3 className="text-lg font-bold text-gray-800 mb-6">Sales by Category (Mock)</h3>
                        <ResponsiveContainer width="100%" height={300}>
                            <PieChart>
                                <Pie
                                    data={data.topProducts || []} // Using topProducts as proxy for category for now or mock data
                                    cx="50%"
                                    cy="50%"
                                    labelLine={false}
                                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                                    outerRadius={100}
                                    fill="#8884d8"
                                    dataKey="value"
                                >
                                    {(data.topProducts || []).map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={['#3b82f6', '#10b981', '#f59e0b', '#ef4444'][index % 4]} />
                                    ))}
                                </Pie>
                                <Tooltip />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Top Items Table */}
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                    <h3 className="text-lg font-bold text-gray-800 mb-6">Recent Orders</h3>
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-gray-200">
                                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Order ID</th>
                                    <th className="text-right py-3 px-4 text-sm font-semibold text-gray-600">Total</th>
                                    <th className="text-right py-3 px-4 text-sm font-semibold text-gray-600">Status</th>
                                    <th className="text-right py-3 px-4 text-sm font-semibold text-gray-600">Date</th>
                                </tr>
                            </thead>
                            <tbody>
                                {(data.recentSales || []).map((order, index) => (
                                    <tr key={order.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                                        <td className="py-4 px-4">
                                            <span className="font-medium text-gray-800">#{order.order_number}</span>
                                        </td>
                                        <td className="py-4 px-4 text-right font-bold text-green-600">₹{parseFloat(order.total_amount).toFixed(2)}</td>
                                        <td className="py-4 px-4 text-right">
                                            <span className={`px-2 py-1 rounded-full text-xs font-semibold ${order.status === 'completed' ? 'bg-green-100 text-green-800' :
                                                    order.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : 'bg-gray-100 text-gray-800'
                                                }`}>
                                                {order.status}
                                            </span>
                                        </td>
                                        <td className="py-4 px-4 text-right text-sm text-gray-500">
                                            {new Date(order.created_at).toLocaleDateString()}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AnalyticsPage;
