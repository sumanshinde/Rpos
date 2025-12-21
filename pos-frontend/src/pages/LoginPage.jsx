import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { LogIn, UserPlus, Mail, Lock, User, Users, ChefHat, Loader } from 'lucide-react';
import { loginUser, registerUser, selectAuthLoading, selectAuthError, clearError } from '../store/slices/authSlice';

const LoginPage = () => {
    const dispatch = useDispatch();
    const isLoading = useSelector(selectAuthLoading);
    const error = useSelector(selectAuthError);

    const [isLogin, setIsLogin] = useState(true);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        role: 'cashier'
    });
    const [formErrors, setFormErrors] = useState({});

    // Clear backend errors when switching modes
    useEffect(() => {
        dispatch(clearError());
        setFormErrors({});
    }, [isLogin, dispatch]);

    const validateForm = () => {
        const newErrors = {};

        if (!isLogin && !formData.name.trim()) {
            newErrors.name = 'Name is required';
        }

        if (!formData.email.trim()) {
            newErrors.email = 'Email is required';
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = 'Email is invalid';
        }

        if (!formData.password) {
            newErrors.password = 'Password is required';
        } else if (formData.password.length < 8) {
            newErrors.password = 'Password must be at least 8 characters';
        }

        setFormErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) return;

        if (isLogin) {
            dispatch(loginUser({
                username: formData.email,
                password: formData.password
            }));
        } else {
            dispatch(registerUser({
                username: formData.email, // Use email as username
                name: formData.name,
                email: formData.email,
                password: formData.password,
                role: formData.role
            }));
        }
    };

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
        if (formErrors[e.target.name]) {
            setFormErrors({ ...formErrors, [e.target.name]: '' });
        }
        if (error) dispatch(clearError());
    };

    return (
        <div
            className="min-h-screen flex items-center justify-center p-4 bg-cover bg-center relative"
            style={{
                backgroundImage: `url('https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=2070&auto=format&fit=crop')`
            }}
        >
            {/* Dark Overlay */}
            <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px]"></div>

            <div className="w-full max-w-md relative z-10">
                {/* Card */}
                <div className="bg-[#FDFBF7] rounded-3xl shadow-2xl overflow-hidden border-4 border-white/20">

                    {/* Wood-style Header */}
                    <div className="relative h-32 bg-[#5D4037] flex items-center justify-center overflow-hidden">
                        {/* Wood texture overlay effect */}
                        <div className="absolute inset-0 opacity-20"
                            style={{ backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 10px, #000 10px, #000 12px)' }}>
                        </div>

                        <div className="relative z-10 text-center">
                            <h1 className="text-4xl font-bold text-white font-serif tracking-wide drop-shadow-md">
                                {isLogin ? 'Login' : 'Join Us'}
                            </h1>
                            <div className="mt-2 flex justify-center">
                                <div className="h-1 w-16 bg-[#E65100] rounded-full"></div>
                            </div>
                        </div>

                        {/* Decorative bottom curve */}
                        <div className="absolute -bottom-6 left-0 right-0 h-12 bg-[#FDFBF7] rounded-t-[50%]"></div>
                    </div>

                    {/* Form Container */}
                    <div className="px-8 pb-8 pt-4">

                        {/* Toggle Switch */}
                        <div className="flex justify-center mb-8">
                            <div className="bg-gray-200 p-1 rounded-full flex relative">
                                <button
                                    onClick={() => setIsLogin(true)}
                                    className={`px-6 py-2 rounded-full text-sm font-bold transition-all duration-300 ${isLogin
                                        ? 'bg-white text-[#5D4037] shadow-md'
                                        : 'text-gray-500 hover:text-gray-700'
                                        }`}
                                >
                                    Login
                                </button>
                                <button
                                    onClick={() => setIsLogin(false)}
                                    className={`px-6 py-2 rounded-full text-sm font-bold transition-all duration-300 ${!isLogin
                                        ? 'bg-white text-[#5D4037] shadow-md'
                                        : 'text-gray-500 hover:text-gray-700'
                                        }`}
                                >
                                    Register
                                </button>
                            </div>
                        </div>

                        {/* Backend Error Message */}
                        {error && (
                            <div className="mb-6 p-3 bg-red-50 border border-red-200 text-red-600 rounded-xl text-sm text-center font-medium animate-in fade-in slide-in-from-top-2">
                                {error}
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-5">
                            {/* Name Field (Register only) */}
                            {!isLogin && (
                                <div className="animate-in fade-in slide-in-from-top-2 duration-300">
                                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1 ml-1">
                                        Full Name
                                    </label>
                                    <div className="relative group">
                                        <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#E65100] transition-colors" size={20} />
                                        <input
                                            type="text"
                                            name="name"
                                            value={formData.name}
                                            onChange={handleChange}
                                            className={`w-full pl-12 pr-4 py-3.5 bg-white border-2 rounded-2xl outline-none transition-all font-medium text-gray-700 ${formErrors.name
                                                ? 'border-red-400 focus:border-red-500'
                                                : 'border-gray-100 focus:border-[#E65100]/50 focus:bg-orange-50/30'
                                                }`}
                                            placeholder="John Doe"
                                        />
                                    </div>
                                    {formErrors.name && <p className="text-red-500 text-xs mt-1 ml-1 font-medium">{formErrors.name}</p>}
                                </div>
                            )}

                            {/* Email Field */}
                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1 ml-1">
                                    Email
                                </label>
                                <div className="relative group">
                                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#E65100] transition-colors" size={20} />
                                    <input
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        className={`w-full pl-12 pr-4 py-3.5 bg-white border-2 rounded-2xl outline-none transition-all font-medium text-gray-700 ${formErrors.email
                                            ? 'border-red-400 focus:border-red-500'
                                            : 'border-gray-100 focus:border-[#E65100]/50 focus:bg-orange-50/30'
                                            }`}
                                        placeholder="john@example.com"
                                    />
                                </div>
                                {formErrors.email && <p className="text-red-500 text-xs mt-1 ml-1 font-medium">{formErrors.email}</p>}
                            </div>

                            {/* Password Field */}
                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1 ml-1">
                                    Password
                                </label>
                                <div className="relative group">
                                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#E65100] transition-colors" size={20} />
                                    <input
                                        type="password"
                                        name="password"
                                        value={formData.password}
                                        onChange={handleChange}
                                        className={`w-full pl-12 pr-4 py-3.5 bg-white border-2 rounded-2xl outline-none transition-all font-medium text-gray-700 ${formErrors.password
                                            ? 'border-red-400 focus:border-red-500'
                                            : 'border-gray-100 focus:border-[#E65100]/50 focus:bg-orange-50/30'
                                            }`}
                                        placeholder="••••••••"
                                    />
                                </div>
                                {formErrors.password && <p className="text-red-500 text-xs mt-1 ml-1 font-medium">{formErrors.password}</p>}
                            </div>

                            {/* Role Selector (Register only) */}
                            {!isLogin && (
                                <div className="animate-in fade-in slide-in-from-top-2 duration-300">
                                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1 ml-1">
                                        Role
                                    </label>
                                    <div className="relative group">
                                        <ChefHat className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#E65100] transition-colors" size={20} />
                                        <select
                                            name="role"
                                            value={formData.role}
                                            onChange={handleChange}
                                            className="w-full pl-12 pr-4 py-3.5 bg-white border-2 border-gray-100 rounded-2xl focus:border-[#E65100]/50 focus:bg-orange-50/30 outline-none transition-all font-medium text-gray-700 appearance-none cursor-pointer"
                                        >
                                            <option value="cashier">Cashier</option>
                                            <option value="waiter">Waiter</option>
                                            <option value="kitchen">Kitchen Staff</option>
                                            <option value="admin">Admin</option>
                                        </select>
                                        <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                                            <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                                            </svg>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Submit Button */}
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full py-4 mt-4 bg-gradient-to-r from-[#FF7043] to-[#E64A19] text-white rounded-2xl font-bold text-lg shadow-lg shadow-orange-500/30 hover:shadow-orange-500/50 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 uppercase tracking-wide disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center"
                            >
                                {isLoading ? (
                                    <Loader className="animate-spin" size={24} />
                                ) : (
                                    isLogin ? 'Login' : 'Create Account'
                                )}
                            </button>
                        </form>
                    </div>
                </div>

                {/* Footer */}
                <p className="text-center text-white/80 mt-8 text-sm font-medium drop-shadow-md">

                </p>
            </div>
        </div>
    );
};

export default LoginPage;
