import React from 'react';
import { useSelector } from 'react-redux';
import { X, Printer, Download, Check } from 'lucide-react';
import { selectCurrency } from '../store/slices/uiSlice';
import { formatCurrency } from '../utils/formatCurrency';

const ReceiptModal = ({ isOpen, onClose, orderData }) => {
    const currency = useSelector(selectCurrency);

    if (!isOpen) return null;

    const handlePrint = () => {
        window.print();
    };

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl">
                {/* Header */}
                <div className="p-6 border-b border-gray-100 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                            <Check className="text-green-600" size={24} />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-gray-800">Payment Successful</h2>
                            <p className="text-sm text-gray-500">Order #{orderData.orderNumber}</p>
                        </div>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                        <X size={20} />
                    </button>
                </div>

                {/* Receipt Content */}
                <div className="p-6 space-y-6">
                    {/* Store Info */}
                    <div className="text-center border-b border-gray-100 pb-4">
                        <h3 className="font-bold text-lg">POS Restaurant</h3>
                        <p className="text-sm text-gray-500">123 Main Street, City</p>
                        <p className="text-sm text-gray-500">Tel: (123) 456-7890</p>
                    </div>

                    {/* Order Details */}
                    <div className="space-y-3">
                        <div className="flex justify-between text-sm">
                            <span className="text-gray-500">Date:</span>
                            <span className="font-medium">{orderData.date}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                            <span className="text-gray-500">Time:</span>
                            <span className="font-medium">{orderData.time}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                            <span className="text-gray-500">Payment Method:</span>
                            <span className="font-medium capitalize">{orderData.paymentMethod}</span>
                        </div>
                    </div>

                    {/* Items */}
                    <div className="border-t border-b border-gray-100 py-4 space-y-3">
                        {orderData.items.map((item, index) => (
                            <div key={index} className="flex justify-between text-sm">
                                <div className="flex-1">
                                    <span className="font-medium">{item.name}</span>
                                    <span className="text-gray-500 ml-2">x{item.quantity}</span>
                                </div>
                                <span className="font-medium">{formatCurrency(item.price * item.quantity, currency)}</span>
                            </div>
                        ))}
                    </div>

                    {/* Totals */}
                    <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                            <span className="text-gray-500">Subtotal:</span>
                            <span className="font-medium">{formatCurrency(orderData.subtotal, currency)}</span>
                        </div>
                        {orderData.discount > 0 && (
                            <div className="flex justify-between text-sm text-green-600">
                                <span>Discount:</span>
                                <span>-{formatCurrency(orderData.discount, currency)}</span>
                            </div>
                        )}
                        <div className="flex justify-between text-sm">
                            <span className="text-gray-500">Tax (10%):</span>
                            <span className="font-medium">{formatCurrency(orderData.tax, currency)}</span>
                        </div>
                        <div className="flex justify-between text-lg font-bold pt-2 border-t border-gray-200">
                            <span>Total:</span>
                            <span>{formatCurrency(orderData.total, currency)}</span>
                        </div>
                    </div>

                    {/* Thank You Message */}
                    <div className="text-center text-sm text-gray-500 pt-4 border-t border-gray-100">
                        <p className="font-medium">Thank you for your purchase!</p>
                        <p>Please come again</p>
                    </div>
                </div>

                {/* Actions */}
                <div className="p-6 bg-gray-50 rounded-b-2xl flex gap-3">
                    <button
                        onClick={handlePrint}
                        className="flex-1 py-3 bg-white border border-gray-200 rounded-xl font-medium hover:bg-gray-50 transition-colors flex items-center justify-center gap-2"
                    >
                        <Printer size={18} />
                        Print
                    </button>
                    <button
                        onClick={onClose}
                        className="flex-1 py-3 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
                    >
                        <Check size={18} />
                        Done
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ReceiptModal;
