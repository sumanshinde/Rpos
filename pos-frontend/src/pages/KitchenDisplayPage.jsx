import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { ChefHat, Clock, CheckCircle2, Bell } from 'lucide-react';
import OrderStatusBadge from '../components/OrderStatusBadge';
import {
    fetchOrders,
    updateOrderStatus,
    selectAllOrders,
    selectOrdersLoading
} from '../store/slices/ordersSlice';
import {
    fetchTables,
    updateTableStatus,
    selectAllTables
} from '../store/slices/tablesSlice';

const KitchenDisplayPage = () => {
    const dispatch = useDispatch();
    const orders = useSelector(selectAllOrders);
    const tables = useSelector(selectAllTables);
    const loading = useSelector(selectOrdersLoading);

    useEffect(() => {
        dispatch(fetchOrders());
        dispatch(fetchTables());
        // Refresh orders every 10 seconds for kitchen (more frequent than orders page)
        const interval = setInterval(() => {
            dispatch(fetchOrders());
        }, 15000);
        return () => clearInterval(interval);
    }, [dispatch]);

    const handleCompleteOrder = (orderId) => {
        dispatch(updateOrderStatus({ id: orderId, status: 'ready' }));

        // Find the order to get the table number
        const order = orders.find(o => o.id === orderId);
        if (order && order.table_number) {
            // Find the table by table_number
            const table = tables.find(t => t.table_number === order.table_number);

            if (table) {
                dispatch(updateTableStatus({ id: table.id, status: 'available' }));
            }
        }
    };

    const handleStartOrder = (orderId) => {
        dispatch(updateOrderStatus({ id: orderId, status: 'preparing' }));
    };

    const getTimeAgo = (createdAt) => {
        const now = new Date();
        const orderTime = new Date(createdAt);
        const diffMs = now - orderTime;
        const diffMins = Math.floor(diffMs / 60000);

        if (diffMins < 1) return 'Just now';
        if (diffMins < 60) return `${diffMins} min`;
        const diffHours = Math.floor(diffMins / 60);
        return `${diffHours}h ${diffMins % 60}m`;
    };

    const pendingOrders = orders.filter(o => o.status === 'pending');
    const preparingOrders = orders.filter(o => o.status === 'preparing');
    const readyOrders = orders.filter(o => o.status === 'ready');

    return (
        <div className="h-screen flex flex-col bg-gray-900">
            {/* Header */}
            <div className="bg-gray-800 border-b border-gray-700 px-8 py-6">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-orange-600 rounded-xl flex items-center justify-center">
                            <ChefHat size={24} className="text-white" />
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold text-white">Kitchen Display System</h1>
                            <p className="text-gray-400 text-sm mt-1">Real-time order tracking</p>
                        </div>
                    </div>
                    <div className="flex gap-4">
                        <div className="bg-orange-900/50 rounded-xl px-6 py-3 border border-orange-700">
                            <div className="text-2xl font-bold text-orange-400">{pendingOrders.length}</div>
                            <div className="text-xs text-orange-300 mt-1">Pending</div>
                        </div>
                        <div className="bg-blue-900/50 rounded-xl px-6 py-3 border border-blue-700">
                            <div className="text-2xl font-bold text-blue-400">{preparingOrders.length}</div>
                            <div className="text-xs text-blue-300 mt-1">Preparing</div>
                        </div>
                        <div className="bg-green-900/50 rounded-xl px-6 py-3 border border-green-700">
                            <div className="text-2xl font-bold text-green-400">{readyOrders.length}</div>
                            <div className="text-xs text-green-300 mt-1">Ready</div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Orders Grid */}
            <div className="flex-1 overflow-y-auto p-6">
                <div className="grid grid-cols-3 gap-6">
                    {/* Pending Column */}
                    <div>
                        <div className="bg-orange-900/30 rounded-t-xl px-4 py-3 border-b-2 border-orange-600">
                            <h3 className="font-bold text-orange-400 flex items-center gap-2">
                                <Bell size={18} />
                                Pending ({pendingOrders.length})
                            </h3>
                        </div>
                        <div className="space-y-4 mt-4">
                            {pendingOrders.map(order => (
                                <KitchenOrderCard
                                    key={order.id}
                                    order={order}
                                    onStart={handleStartOrder}
                                    onComplete={handleCompleteOrder}
                                    getTimeAgo={getTimeAgo}
                                />
                            ))}
                        </div>
                    </div>

                    {/* Preparing Column */}
                    <div>
                        <div className="bg-blue-900/30 rounded-t-xl px-4 py-3 border-b-2 border-blue-600">
                            <h3 className="font-bold text-blue-400 flex items-center gap-2">
                                <ChefHat size={18} />
                                Preparing ({preparingOrders.length})
                            </h3>
                        </div>
                        <div className="space-y-4 mt-4">
                            {preparingOrders.map(order => (
                                <KitchenOrderCard
                                    key={order.id}
                                    order={order}
                                    onStart={handleStartOrder}
                                    onComplete={handleCompleteOrder}
                                    getTimeAgo={getTimeAgo}
                                />
                            ))}
                        </div>
                    </div>

                    {/* Ready Column */}
                    <div>
                        <div className="bg-green-900/30 rounded-t-xl px-4 py-3 border-b-2 border-green-600">
                            <h3 className="font-bold text-green-400 flex items-center gap-2">
                                <CheckCircle2 size={18} />
                                Ready ({readyOrders.length})
                            </h3>
                        </div>
                        <div className="space-y-4 mt-4">
                            {readyOrders.map(order => (
                                <KitchenOrderCard
                                    key={order.id}
                                    order={order}
                                    onStart={handleStartOrder}
                                    onComplete={handleCompleteOrder}
                                    getTimeAgo={getTimeAgo}
                                />
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

const KitchenOrderCard = ({ order, onStart, onComplete, getTimeAgo }) => {
    return (
        <div className="rounded-xl border-2 border-gray-700 bg-gray-800 p-4 shadow-lg">
            <div className="flex items-start justify-between mb-3">
                <div>
                    <div className="flex items-center gap-2 mb-1">
                        <span className="text-2xl font-bold text-white">#{order.order_number}</span>
                    </div>
                    <div className="text-sm text-gray-400">Table {order.table_number || 'N/A'}</div>
                    <div className="text-xs text-gray-500 mt-1">{order.waiter_name || 'N/A'}</div>
                </div>
                <div className="text-right">
                    <div className="flex items-center gap-1 text-orange-400">
                        <Clock size={16} />
                        <span className="font-bold">{getTimeAgo(order.created_at)}</span>
                    </div>
                </div>
            </div>

            <div className="space-y-3 mb-4">
                {order.items.map((item, index) => (
                    <div key={index} className="bg-gray-900/50 rounded-lg p-3">
                        <div className="flex items-start justify-between mb-2">
                            <div className="flex-1">
                                <div className="font-bold text-white">
                                    <span className="text-orange-400">{item.quantity}x</span> {item.product_name}
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {order.status === 'pending' && (
                <button
                    onClick={() => onStart(order.id)}
                    className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-bold transition-colors"
                >
                    Start Preparing
                </button>
            )}
            {order.status === 'preparing' && (
                <button
                    onClick={() => onComplete(order.id)}
                    className="w-full py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-bold transition-colors"
                >
                    Mark as Ready
                </button>
            )}
            {order.status === 'ready' && (
                <div className="w-full py-2 bg-green-900/50 text-green-400 rounded-lg font-bold text-center border border-green-600">
                    ✓ Ready for Serving
                </div>
            )}
        </div>
    );
};

export default KitchenDisplayPage;
