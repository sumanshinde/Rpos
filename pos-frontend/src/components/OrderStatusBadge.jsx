import React from 'react';
import { Clock, CheckCircle2, ChefHat, UtensilsCrossed } from 'lucide-react';

const ORDER_STATUSES = [
    { id: 'pending', label: 'Pending', icon: Clock, color: 'orange' },
    { id: 'preparing', label: 'Preparing', icon: ChefHat, color: 'blue' },
    { id: 'ready', label: 'Ready', icon: CheckCircle2, color: 'green' },
    { id: 'served', label: 'Served', icon: UtensilsCrossed, color: 'gray' },
];

const OrderStatusBadge = ({ status, onChange, showDropdown = false }) => {
    const currentStatus = ORDER_STATUSES.find(s => s.id === status) || ORDER_STATUSES[0];
    const Icon = currentStatus.icon;

    const colorClasses = {
        orange: 'bg-orange-100 text-orange-700 border-orange-200',
        blue: 'bg-blue-100 text-blue-700 border-blue-200',
        green: 'bg-green-100 text-green-700 border-green-200',
        gray: 'bg-gray-100 text-gray-700 border-gray-200',
    };

    if (!showDropdown) {
        return (
            <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full border ${colorClasses[currentStatus.color]}`}>
                <Icon size={14} />
                <span className="text-sm font-medium">{currentStatus.label}</span>
            </div>
        );
    }

    return (
        <div className="relative group">
            <button className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full border ${colorClasses[currentStatus.color]} hover:opacity-80 transition-opacity`}>
                <Icon size={14} />
                <span className="text-sm font-medium">{currentStatus.label}</span>
            </button>
            <div className="absolute top-full left-0 mt-2 bg-white rounded-xl shadow-lg border border-gray-200 p-2 hidden group-hover:block z-10 min-w-[150px]">
                {ORDER_STATUSES.map((s) => {
                    const StatusIcon = s.icon;
                    return (
                        <button
                            key={s.id}
                            onClick={() => onChange && onChange(s.id)}
                            className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-50 transition-colors ${s.id === status ? 'bg-gray-50' : ''
                                }`}
                        >
                            <StatusIcon size={16} className={`text-${s.color}-600`} />
                            <span className="text-sm font-medium">{s.label}</span>
                        </button>
                    );
                })}
            </div>
        </div>
    );
};

export default OrderStatusBadge;
