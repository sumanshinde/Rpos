import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Home, UtensilsCrossed, LayoutGrid, History, Users as UsersIcon, Settings, ChefHat, BarChart3, LogOut } from 'lucide-react';
import { logout, selectUser } from '../store/slices/authSlice';

const Sidebar = ({ activeView, onViewChange }) => {
    const dispatch = useDispatch();
    const user = useSelector(selectUser);

    const navItems = [
        { id: 'pos', icon: UtensilsCrossed, label: 'POS', active: true },
        { id: 'tables', icon: LayoutGrid, label: 'Tables' },
        { id: 'orders', icon: History, label: 'Orders' },
        { id: 'kitchen', icon: ChefHat, label: 'Kitchen' },
        { id: 'analytics', icon: BarChart3, label: 'Analytics' },
        { id: 'customers', icon: UsersIcon, label: 'Customers' },
        { id: 'settings', icon: Settings, label: 'Settings' },
    ];

    const handleLogout = () => {
        if (window.confirm('Are you sure you want to logout?')) {
            dispatch(logout());
        }
    };

    return (
        <div className="h-screen w-20 bg-gray-900 flex flex-col items-center py-8 fixed left-0 top-0 z-50">
            <div className="mb-8">
                <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold text-xl">
                    R
                </div>
            </div>

            <nav className="flex-1 flex flex-col gap-6 w-full">
                {navItems.map((item) => (
                    <NavItem
                        key={item.id}
                        icon={<item.icon size={24} />}
                        active={activeView === item.id}
                        onClick={() => onViewChange && onViewChange(item.id)}
                        label={item.label}
                    />
                ))}
            </nav>

            <div className="mt-auto flex flex-col items-center gap-4">
                <button
                    onClick={handleLogout}
                    className="w-10 h-10 rounded-lg flex items-center justify-center text-gray-400 hover:text-red-400 hover:bg-gray-800 transition-colors"
                    title="Logout"
                >
                    <LogOut size={24} />
                </button>

                <button
                    onClick={() => onViewChange && onViewChange('settings')}
                    className="w-10 h-10 rounded-full bg-gray-700 overflow-hidden hover:ring-2 hover:ring-blue-500 transition-all cursor-pointer"
                    title="Account Settings"
                >
                    <img
                        src={`https://ui-avatars.com/api/?name=${user?.name || 'Admin'}&background=3b82f6&color=fff`}
                        alt="User"
                        className="w-full h-full object-cover"
                    />
                </button>
            </div>
        </div>
    );
};

const NavItem = ({ icon, active, onClick, label }) => {
    return (
        <button
            onClick={onClick}
            className={`w-full p-3 flex justify-center transition-all duration-200 relative group
        ${active ? 'text-blue-400' : 'text-gray-400 hover:text-white'}
      `}
            title={label}
        >
            {active && (
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-blue-400 rounded-r-full" />
            )}
            {icon}
            <span className="absolute left-full ml-4 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                {label}
            </span>
        </button>
    );
};

export default Sidebar;
