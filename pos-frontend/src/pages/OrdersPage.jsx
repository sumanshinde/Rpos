import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import OrderStatusBadge from '../components/OrderStatusBadge';
import { Clock, DollarSign, User, MapPin, Phone, Mail } from 'lucide-react';
import {
    fetchOrders,
    updateOrderStatus,
    selectAllOrders,
    selectOrdersLoading
} from '../store/slices/ordersSlice';

const OrdersPage = () => {
    const dispatch = useDispatch();
    const orders = useSelector(selectAllOrders);
    const loading = useSelector(selectOrdersLoading);
    const [filterStatus, setFilterStatus] = useState('all');
    const [filterType, setFilterType] = useState('all');

    useEffect(() => {
        dispatch(fetchOrders());
        // Refresh orders every 30 seconds
        const interval = setInterval(() => {
            dispatch(fetchOrders());
        }, 30000);
        return () => clearInterval(interval);
    }, [dispatch]);

    const filteredOrders = orders.filter(order => {
        const matchesStatus = filterStatus === 'all' || order.status === filterStatus;
        const matchesType = filterType === 'all' || order.order_type === filterType;
        return matchesStatus && matchesType;
    });

    const handleStatusChange = (orderId, newStatus) => {
        dispatch(updateOrderStatus({ id: orderId, status: newStatus }));
    };

    const stats = {
        total: orders.length,
        pending: orders.filter(o => o.status === 'pending').length,
        preparing: orders.filter(o => o.status === 'preparing').length,
        ready: orders.filter(o => o.status === 'ready').length,
    };

    const getTimeAgo = (createdAt) => {
        const now = new Date();
        const orderTime = new Date(createdAt);
        const diffMs = now - orderTime;
        const diffMins = Math.floor(diffMs / 60000);

        if (diffMins < 1) return 'Just now';
        if (diffMins < 60) return `${diffMins} min ago`;
        const diffHours = Math.floor(diffMins / 60);
        return `${diffHours}h ${diffMins % 60}m ago`;
    };

    return (
        <div className="h-screen flex flex-col bg-gray-50">
            {/* Header */}
            <div className="bg-white border-b border-gray-200 px-8 py-6">
                <div className="mb-6">
                    <h1 className="text-2xl font-bold text-gray-800">Orders Management</h1>
                    <p className="text-gray-500 text-sm mt-1">Track and manage all orders</p>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-4 gap-4">
                    <div className="bg-gray-50 rounded-xl p-4">
                        <div className="text-2xl font-bold text-gray-800">{stats.total}</div>
                        <div className="text-sm text-gray-500 mt-1">Total Orders</div>
                    </div>
                    <div className="bg-orange-50 rounded-xl p-4">
                        <div className="text-2xl font-bold text-orange-700">{stats.pending}</div>
                        <div className="text-sm text-orange-600 mt-1">Pending</div>
                    </div>
                    <div className="bg-blue-50 rounded-xl p-4">
                        <div className="text-2xl font-bold text-blue-700">{stats.preparing}</div>
                        <div className="text-sm text-blue-600 mt-1">Preparing</div>
                    </div>
                    <div className="bg-green-50 rounded-xl p-4">
                        <div className="text-2xl font-bold text-green-700">{stats.ready}</div>
                        <div className="text-sm text-green-600 mt-1">Ready</div>
                    </div>
                </div>
            </div>

            {/* Filters */}
            <div className="px-8 py-4 bg-white border-b border-gray-100">
                <div className="flex gap-6">
                    <div className="flex gap-2">
                        <span className="text-sm font-medium text-gray-700 self-center">Status:</span>
                        {['all', 'pending', 'preparing', 'ready', 'served'].map((status) => (
                            <button
                                key={status}
                                onClick={() => setFilterStatus(status)}
                                className={`px-3 py-1.5 rounded-lg text-sm font-medium capitalize transition-all ${filterStatus === status
                                    ? 'bg-blue-600 text-white'
                                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                    }`}
                            >
                                {status}
                            </button>
                        ))}
                    </div>
                    <div className="flex gap-2">
                        <span className="text-sm font-medium text-gray-700 self-center">Type:</span>
                        {['all', 'dine-in', 'takeaway', 'delivery'].map((type) => (
                            <button
                                key={type}
                                onClick={() => setFilterType(type)}
                                className={`px-3 py-1.5 rounded-lg text-sm font-medium capitalize transition-all ${filterType === type
                                    ? 'bg-blue-600 text-white'
                                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                    }`}
                            >
                                {type}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Orders List */}
            <div className="flex-1 overflow-y-auto px-8 py-6">
                {loading ? (
                    <div className="flex items-center justify-center h-full">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                    </div>
                ) : filteredOrders.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full text-gray-400">
                        <p className="text-lg font-medium">No orders found</p>
                        <p className="text-sm mt-2">Orders will appear here when tables are booked</p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {filteredOrders.map((order) => (
                            <div key={order.id} className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-md transition-shadow">
                                <div className="flex items-start justify-between mb-4">
                                    <div className="flex items-start gap-4">
                                        <div>
                                            <div className="flex items-center gap-3 mb-2">
                                                <h3 className="text-lg font-bold text-gray-800">#{order.order_number}</h3>
                                                <OrderStatusBadge
                                                    status={order.status}
                                                    onChange={(newStatus) => handleStatusChange(order.id, newStatus)}
                                                    showDropdown={true}
                                                />
                                                <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-medium capitalize">
                                                    {order.order_type}
                                                </span>
                                            </div>
                                            <div className="flex items-center gap-4 text-sm text-gray-500">
                                                <div className="flex items-center gap-1">
                                                    <Clock size={14} />
                                                    <span>{getTimeAgo(order.created_at)}</span>
                                                </div>
                                                <div className="flex items-center gap-1">
                                                    <User size={14} />
                                                    <span>{order.waiter_name || 'N/A'}</span>
                                                </div>
                                                <div className="flex items-center gap-1">
                                                    <MapPin size={14} />
                                                    <span>{order.table_number || 'N/A'}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <div className="text-2xl font-bold text-blue-600">₹{parseFloat(order.total_amount).toFixed(2)}</div>
                                        <div className="text-sm text-gray-500 mt-1">{order.items.length} items</div>
                                    </div>
                                </div>

                                {/* Order Items */}
                                <div className="space-y-2 pt-4 border-t border-gray-100">
                                    {order.items.map((item, index) => (
                                        <div key={index} className="flex justify-between text-sm">
                                            <span className="text-gray-700">
                                                <span className="font-medium">{item.quantity}x</span> {item.product_name}
                                            </span>
                                            <span className="font-medium text-gray-800">₹{(parseFloat(item.price) * item.quantity).toFixed(2)}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default OrdersPage;
