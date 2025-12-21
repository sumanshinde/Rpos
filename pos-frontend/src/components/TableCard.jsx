import React from 'react';
import { Users, Clock, CheckCircle, XCircle } from 'lucide-react';

const TableCard = ({ table, onSelectTable, isSelected }) => {
    const getStatusColor = () => {
        switch (table.status) {
            case 'available':
                return 'bg-green-50 border-green-200 text-green-700';
            case 'occupied':
                return 'bg-orange-50 border-orange-200 text-orange-700';
            case 'reserved':
                return 'bg-blue-50 border-blue-200 text-blue-700';
            default:
                return 'bg-gray-50 border-gray-200 text-gray-700';
        }
    };

    const getStatusIcon = () => {
        switch (table.status) {
            case 'available':
                return <CheckCircle size={16} className="text-green-600" />;
            case 'occupied':
                return <Clock size={16} className="text-orange-600" />;
            case 'reserved':
                return <Users size={16} className="text-blue-600" />;
            default:
                return <XCircle size={16} className="text-gray-600" />;
        }
    };

    return (
        <button
            onClick={() => onSelectTable(table)}
            className={`relative p-6 rounded-2xl border-2 transition-all hover:scale-105 ${getStatusColor()} ${isSelected ? 'ring-4 ring-blue-300 scale-105' : ''
                }`}
        >
            <div className="flex flex-col items-center gap-3">
                <div className="text-3xl font-bold">{table.number}</div>
                <div className="flex items-center gap-2 text-sm">
                    {getStatusIcon()}
                    <span className="capitalize font-medium">{table.status}</span>
                </div>
                {table.capacity && (
                    <div className="flex items-center gap-1 text-xs opacity-70">
                        <Users size={12} />
                        <span>{table.capacity} seats</span>
                    </div>
                )}
                {table.waiter && (
                    <div className="text-xs bg-white/50 px-2 py-1 rounded-full">
                        {table.waiter}
                    </div>
                )}
            </div>
            {table.orderTime && (
                <div className="absolute top-2 right-2 text-xs bg-white/80 px-2 py-1 rounded-full">
                    {table.orderTime}
                </div>
            )}
        </button>
    );
};

export default TableCard;
