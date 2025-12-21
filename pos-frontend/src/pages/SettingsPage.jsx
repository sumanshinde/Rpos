import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { User, Settings, Moon, Sun, DollarSign, Bell, Shield, LogOut } from 'lucide-react';
import CurrencyCard from '../components/CurrencyCard';
import { setCurrency, selectCurrency } from '../store/slices/uiSlice';
import { updateProfile, logout, selectUser, selectAuthLoading, selectAuthError } from '../store/slices/authSlice';

const SettingsPage = () => {
    const dispatch = useDispatch();
    const user = useSelector(selectUser);
    const loading = useSelector(selectAuthLoading);
    const error = useSelector(selectAuthError);
    const selectedCurrency = useSelector(selectCurrency);

    const [activeTab, setActiveTab] = useState('account');
    const [formData, setFormData] = useState({
        name: user?.name || '',
        email: user?.email || '',
    });
    const [successMessage, setSuccessMessage] = useState('');

    const handleUpdateProfile = async (e) => {
        e.preventDefault();
        setSuccessMessage('');

        const resultAction = await dispatch(updateProfile({
            id: user._id,
            ...formData
        }));

        if (updateProfile.fulfilled.match(resultAction)) {
            setSuccessMessage('Profile updated successfully!');
            setTimeout(() => setSuccessMessage(''), 3000);
        }
    };

    const handleLogout = () => {
        if (window.confirm('Are you sure you want to logout?')) {
            dispatch(logout());
        }
    };

    return (
        <div className="h-full flex flex-col bg-gray-50">
            {/* Header */}
            <div className="p-6 bg-white shadow-sm border-b border-gray-200">
                <h1 className="text-2xl font-bold text-gray-800">Settings</h1>
                <p className="text-gray-500">Manage your account and preferences</p>
            </div>

            <div className="flex-1 p-6 overflow-auto">
                <div className="max-w-4xl mx-auto flex flex-col md:flex-row gap-6">
                    {/* Sidebar Navigation */}
                    <div className="w-full md:w-64 bg-white rounded-xl shadow-sm border border-gray-200 h-fit">
                        <nav className="p-2 space-y-1">
                            <button
                                onClick={() => setActiveTab('account')}
                                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${activeTab === 'account'
                                    ? 'bg-blue-50 text-blue-600'
                                    : 'text-gray-600 hover:bg-gray-50'
                                    }`}
                            >
                                <User size={18} />
                                Account
                            </button>
                            <button
                                onClick={() => setActiveTab('preferences')}
                                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${activeTab === 'preferences'
                                    ? 'bg-blue-50 text-blue-600'
                                    : 'text-gray-600 hover:bg-gray-50'
                                    }`}
                            >
                                <Settings size={18} />
                                Preferences
                            </button>
                            <button
                                onClick={() => setActiveTab('security')}
                                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${activeTab === 'security'
                                    ? 'bg-blue-50 text-blue-600'
                                    : 'text-gray-600 hover:bg-gray-50'
                                    }`}
                            >
                                <Shield size={18} />
                                Security
                            </button>
                            <div className="pt-4 mt-4 border-t border-gray-100">
                                <button
                                    onClick={handleLogout}
                                    className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 transition-colors"
                                >
                                    <LogOut size={18} />
                                    Logout
                                </button>
                            </div>
                        </nav>
                    </div>

                    {/* Content Area */}
                    <div className="flex-1">
                        {activeTab === 'account' && (
                            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                                <h2 className="text-lg font-bold text-gray-800 mb-6">Profile Information</h2>

                                {successMessage && (
                                    <div className="mb-4 p-3 bg-green-50 text-green-700 rounded-lg text-sm font-medium">
                                        {successMessage}
                                    </div>
                                )}

                                {error && (
                                    <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-lg text-sm font-medium">
                                        {error}
                                    </div>
                                )}

                                <form onSubmit={handleUpdateProfile} className="space-y-6">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                                            <input
                                                type="text"
                                                value={formData.name}
                                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                                            <input
                                                type="email"
                                                value={formData.email}
                                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                                            <input
                                                type="text"
                                                value={user?.role || ''}
                                                disabled
                                                className="w-full px-4 py-2 border border-gray-200 bg-gray-50 text-gray-500 rounded-lg outline-none capitalize"
                                            />
                                            <p className="mt-1 text-xs text-gray-400">Role cannot be changed</p>
                                        </div>
                                    </div>

                                    <div className="pt-4 flex justify-end">
                                        <button
                                            type="submit"
                                            disabled={loading}
                                            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium disabled:opacity-50 transition-colors"
                                        >
                                            {loading ? 'Saving...' : 'Save Changes'}
                                        </button>
                                    </div>
                                </form>
                            </div>
                        )}

                        {activeTab === 'preferences' && (
                            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                                <h2 className="text-lg font-bold text-gray-800 mb-6">App Preferences</h2>

                                <div className="space-y-6">
                                    <div className="flex items-center justify-between py-4 border-b border-gray-100">
                                        <div className="flex items-center gap-3">
                                            <div className="p-2 bg-gray-100 rounded-lg">
                                                <Moon size={20} className="text-gray-600" />
                                            </div>
                                            <div>
                                                <p className="font-medium text-gray-900">Dark Mode</p>
                                                <p className="text-sm text-gray-500">Switch between light and dark themes</p>
                                            </div>
                                        </div>
                                        <label className="relative inline-flex items-center cursor-pointer">
                                            <input type="checkbox" className="sr-only peer" />
                                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                                        </label>
                                    </div>

                                    <div className="flex items-center justify-between py-4 border-b border-gray-100">
                                        <div className="flex items-center gap-3">
                                            <div className="p-2 bg-gray-100 rounded-lg">
                                                <DollarSign size={20} className="text-gray-600" />
                                            </div>
                                            <div>
                                                <p className="font-medium text-gray-900">Currency</p>
                                                <p className="text-sm text-gray-500">Select your preferred currency</p>
                                            </div>
                                        </div>
                                        <select
                                            className="px-3 py-2 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
                                            value={selectedCurrency}
                                            onChange={(e) => dispatch(setCurrency(e.target.value))}
                                        >
                                            <option value="INR">INR (₹)</option>
                                            <option value="USD">USD ($)</option>
                                            <option value="EUR">EUR (€)</option>
                                            <option value="GBP">GBP (£)</option>
                                        </select>
                                        {/* Display selected currency */}
                                        <CurrencyCard currency={selectedCurrency} />

                                    </div>

                                    <div className="flex items-center justify-between py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="p-2 bg-gray-100 rounded-lg">
                                                <Bell size={20} className="text-gray-600" />
                                            </div>
                                            <div>
                                                <p className="font-medium text-gray-900">Notifications</p>
                                                <p className="text-sm text-gray-500">Enable sound alerts for new orders</p>
                                            </div>
                                        </div>
                                        <label className="relative inline-flex items-center cursor-pointer">
                                            <input type="checkbox" defaultChecked className="sr-only peer" />
                                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                                        </label>
                                    </div>
                                </div>
                            </div>
                        )}

                        {activeTab === 'security' && (
                            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                                <h2 className="text-lg font-bold text-gray-800 mb-6">Security Settings</h2>
                                <div className="text-center py-12 text-gray-500">
                                    <Shield size={48} className="mx-auto mb-4 text-gray-300" />
                                    <p>Password change functionality coming soon.</p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div >
    );
};

export default SettingsPage;
