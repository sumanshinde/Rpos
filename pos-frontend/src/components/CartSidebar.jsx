import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Trash2, Minus, Plus, CreditCard, Banknote, QrCode, Tag, X, ShoppingCart } from 'lucide-react';
import {
    selectCartItems,
    selectCartCount,
    selectCartSubtotal,
    updateQuantity,
    removeItem,
    clearCart,
    setDiscount,
    setPaymentMethod,
    selectDiscount,
    selectPaymentMethod
} from '../store/slices/cartSlice';
import {
    selectOrderType,
    selectSelectedTable,
    selectSelectedWaiter,
    selectCurrency
} from '../store/slices/uiSlice';
import { createOrder } from '../store/slices/ordersSlice';
import { formatCurrency } from '../utils/formatCurrency';
import { getApiUrl } from '../api/config';

const PAYMENT_METHODS = [
    { id: 'cash', name: 'Cash', icon: Banknote },
    { id: 'card', name: 'Card', icon: CreditCard },
    { id: 'qr', name: 'QR Code', icon: QrCode },
];

const QUICK_DISCOUNTS = [5, 10, 15];

const CartSidebar = ({ onCheckout }) => {
    const dispatch = useDispatch();
    const [showDiscountInput, setShowDiscountInput] = useState(false);

    // Redux selectors
    const cartItems = useSelector(selectCartItems);
    const totalItems = useSelector(selectCartCount);
    const subtotal = useSelector(selectCartSubtotal);
    const discountPercent = useSelector(selectDiscount);
    const selectedPaymentMethod = useSelector(selectPaymentMethod);
    const orderType = useSelector(selectOrderType);
    const selectedTable = useSelector(selectSelectedTable);
    const selectedWaiter = useSelector(selectSelectedWaiter);
    const currency = useSelector(selectCurrency);

    const discountAmount = subtotal * (discountPercent / 100);
    const subtotalAfterDiscount = subtotal - discountAmount;
    const tax = subtotalAfterDiscount * 0.1; // 10% tax
    const total = subtotalAfterDiscount + tax;

    const handleApplyDiscount = (percent) => {
        const value = Math.max(0, Math.min(100, percent));
        dispatch(setDiscount(value));
        setShowDiscountInput(false);
    };

    const handleClearAll = () => {
        dispatch(clearCart());
    };

    const handlePayment = async () => {
        if (cartItems.length === 0) return;

        try {
            // Create order payload
            const orderPayload = {
                items_data: cartItems.map(item => ({
                    productId: item.id,
                    name: item.name,
                    price: parseFloat(item.price),
                    quantity: item.quantity,
                    notes: item.notes || ''
                })),
                payment_method: selectedPaymentMethod,
                order_type: orderType,
                table_number: selectedTable?.table_number || null, // Updated to use correct field
                waiter_name: selectedWaiter || null, // Updated: selectedWaiter is a string
                discount: parseFloat(discountAmount.toFixed(2))
            };

            // Dispatch createOrder thunk
            const data = await dispatch(createOrder(orderPayload)).unwrap();

            // Success
            alert(`Order #${data.order_number} created successfully!`);
            dispatch(clearCart());

            if (onCheckout) {
                onCheckout({
                    orderId: data.id,
                    orderNumber: data.order_number,
                    items: cartItems,
                    subtotal,
                    discount: discountAmount,
                    tax,
                    total,
                    paymentMethod: selectedPaymentMethod
                });
            }

        } catch (error) {
            console.error('Order Error:', error);
            alert('Failed to create order: ' + (error.message || error));
        }
    };

    return (
        <div className="w-96 bg-white border-l border-gray-200 h-full flex flex-col">
            {/* Header */}
            <div className="p-6 border-b border-gray-100">
                <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                        <h2 className="text-xl font-bold text-gray-800">Current Order</h2>
                        {totalItems > 0 && (
                            <span className="px-2.5 py-0.5 bg-blue-100 text-blue-600 rounded-full text-xs font-bold">
                                {totalItems}
                            </span>
                        )}
                    </div>
                    {cartItems.length > 0 && (
                        <button
                            onClick={handleClearAll}
                            className="text-xs text-red-500 hover:text-red-600 font-medium transition-colors"
                        >
                            Clear All
                        </button>
                    )}
                </div>
                <p className="text-sm text-gray-500">Order #{String(Date.now()).slice(-5)}</p>
            </div>

            {/* Cart Items */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {cartItems.length === 0 ? (
                    <div className="h-full flex flex-col items-center justify-center text-gray-400 px-8">
                        <div className="w-20 h-20 rounded-full bg-gray-50 flex items-center justify-center mb-4">
                            <ShoppingCart size={32} className="opacity-30" />
                        </div>
                        <p className="font-medium text-gray-500">Your cart is empty</p>
                        <p className="text-sm text-center mt-2">Add items from the menu to get started</p>
                    </div>
                ) : (
                    cartItems.map((item) => (
                        <div
                            key={item.id}
                            className="flex gap-3 p-3 bg-gray-50 rounded-xl relative group hover:bg-gray-100 transition-all duration-200 animate-in fade-in slide-in-from-top-2"
                        >
                            <button
                                onClick={() => dispatch(removeItem(item.id))}
                                className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-all duration-200 flex items-center justify-center hover:bg-red-600 hover:scale-110 shadow-md"
                            >
                                <X size={14} />
                            </button>

                            <img
                                src={item.image}
                                alt={item.name}
                                className="w-16 h-16 rounded-lg object-cover bg-white shadow-sm"
                            />

                            <div className="flex-1 flex flex-col justify-between min-w-0">
                                <div>
                                    <h4 className="font-medium text-gray-800 text-sm leading-tight">{item.name}</h4>
                                    {item.notes && (
                                        <p className="text-xs text-gray-500 mt-1 italic line-clamp-2">
                                            Note: {item.notes}
                                        </p>
                                    )}
                                </div>
                                <div className="flex items-center justify-between mt-2">
                                    <span className="font-bold text-blue-600 text-sm">
                                        {formatCurrency(item.price * item.quantity, currency)}
                                    </span>
                                    <div className="flex items-center gap-2 bg-white rounded-lg px-2 py-1 shadow-sm border border-gray-100">
                                        <button
                                            onClick={() => dispatch(updateQuantity({ id: item.id, quantity: item.quantity - 1 }))}
                                            className="p-1 hover:text-red-500 transition-colors"
                                        >
                                            <Minus size={14} />
                                        </button>
                                        <span className="text-sm font-medium w-5 text-center">{item.quantity}</span>
                                        <button
                                            onClick={() => dispatch(updateQuantity({ id: item.id, quantity: item.quantity + 1 }))}
                                            className="p-1 hover:text-green-500 transition-colors"
                                        >
                                            <Plus size={14} />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* Footer */}
            <div className="p-6 bg-gray-50 border-t border-gray-100 space-y-4">
                {/* Discount Section */}
                <div>
                    <div className="flex items-center justify-between mb-2">
                        <label className="text-sm font-medium text-gray-700">Discount</label>
                        <button
                            onClick={() => setShowDiscountInput(!showDiscountInput)}
                            className="text-xs text-blue-600 hover:text-blue-700 font-medium transition-colors"
                        >
                            {showDiscountInput ? 'Cancel' : 'Add Discount'}
                        </button>
                    </div>

                    {/* Quick Discount Presets */}
                    {!showDiscountInput && discountPercent === 0 && (
                        <div className="flex gap-2 mb-2">
                            {QUICK_DISCOUNTS.map(percent => (
                                <button
                                    key={percent}
                                    onClick={() => handleApplyDiscount(percent)}
                                    className="flex-1 px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium text-gray-600 hover:border-blue-400 hover:text-blue-600 hover:bg-blue-50 transition-all"
                                >
                                    {percent}%
                                </button>
                            ))}
                        </div>
                    )}

                    {showDiscountInput && (
                        <div className="flex gap-2 mb-3 animate-in fade-in slide-in-from-top-2 duration-200">
                            <input
                                type="number"
                                min="0"
                                max="100"
                                placeholder="Enter %"
                                className="flex-1 px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-100 focus:border-blue-400 outline-none"
                                onKeyPress={(e) => {
                                    if (e.key === 'Enter') {
                                        handleApplyDiscount(Number(e.target.value));
                                    }
                                }}
                                autoFocus
                            />
                            <button
                                onClick={(e) => {
                                    const input = e.target.parentElement.querySelector('input');
                                    handleApplyDiscount(Number(input.value));
                                }}
                                className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
                            >
                                Apply
                            </button>
                        </div>
                    )}

                    {discountPercent > 0 && (
                        <div className="flex items-center gap-2 px-3 py-2 bg-green-50 border border-green-200 rounded-lg animate-in fade-in slide-in-from-top-2 duration-200">
                            <Tag size={16} className="text-green-600" />
                            <span className="text-sm text-green-700 font-medium">{discountPercent}% discount applied</span>
                            <button
                                onClick={() => setDiscountPercent(0)}
                                className="ml-auto text-green-600 hover:text-green-700 transition-colors"
                            >
                                <X size={16} />
                            </button>
                        </div>
                    )}
                </div>

                {/* Payment Method */}
                <div>
                    <label className="text-sm font-medium text-gray-700 mb-2 block">Payment Method</label>
                    <div className="grid grid-cols-3 gap-2">
                        {PAYMENT_METHODS.map((method) => (
                            <button
                                key={method.id}
                                onClick={() => dispatch(setPaymentMethod(method.id))}
                                className={`flex flex-col items-center justify-center p-3 rounded-xl border transition-all duration-200
                                    ${selectedPaymentMethod === method.id
                                        ? 'bg-blue-50 border-blue-400 text-blue-600 shadow-sm'
                                        : 'bg-white border-gray-200 text-gray-400 hover:border-blue-300 hover:text-blue-600'
                                    }
                                `}
                            >
                                <method.icon size={20} className="mb-1" />
                                <span className="text-xs font-medium">{method.name}</span>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Totals */}
                <div className="space-y-2 pt-2 border-t border-gray-200">
                    <div className="flex justify-between text-gray-500 text-sm">
                        <span>Subtotal</span>
                        <span>{formatCurrency(subtotal, currency)}</span>
                    </div>
                    <div className="flex justify-between text-gray-500 text-sm">
                        <span>Tax (10%)</span>
                        <span>{formatCurrency(tax, currency)}</span>
                    </div>
                    {discountAmount > 0 && (
                        <div className="flex justify-between text-green-600 text-sm font-medium">
                            <span>Discount ({discountPercent}%)</span>
                            <span>-{formatCurrency(discountAmount, currency)}</span>
                        </div>
                    )}
                    <div className="flex justify-between text-gray-900 font-bold text-lg pt-2 border-t border-gray-200">
                        <span>Total</span>
                        <span className="text-blue-600">{formatCurrency(total, currency)}</span>
                    </div>
                </div>

                {/* Pay Button */}
                <button
                    onClick={handlePayment}
                    disabled={cartItems.length === 0}
                    className="w-full bg-blue-600 text-white py-4 rounded-xl font-bold text-lg hover:bg-blue-700 active:scale-[0.98] transition-all duration-200 flex items-center justify-center gap-2 shadow-lg shadow-blue-200 disabled:bg-gray-300 disabled:cursor-not-allowed disabled:shadow-none disabled:active:scale-100"
                >
                    {selectedPaymentMethod === 'cash' && <Banknote size={20} />}
                    {selectedPaymentMethod === 'card' && <CreditCard size={20} />}
                    {selectedPaymentMethod === 'qr' && <QrCode size={20} />}
                    Pay with {PAYMENT_METHODS.find(m => m.id === selectedPaymentMethod)?.name}
                </button>
            </div>
        </div>
    );
};

export default CartSidebar;
