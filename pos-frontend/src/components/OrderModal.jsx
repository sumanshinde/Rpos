import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { X, Minus, Plus, ShoppingBag } from 'lucide-react';
import { addToCart } from '../store/slices/cartSlice';
import { closeOrderModal, selectIsOrderModalOpen, selectSelectedProduct, selectCurrency } from '../store/slices/uiSlice';
import { formatCurrency } from '../utils/formatCurrency';

const OrderModal = () => {
    const dispatch = useDispatch();
    const [quantity, setQuantity] = useState(1);
    const [notes, setNotes] = useState('');

    // Redux selectors
    const isOpen = useSelector(selectIsOrderModalOpen);
    const product = useSelector(selectSelectedProduct);
    const currency = useSelector(selectCurrency);

    // Reset state when modal opens with a new product
    useEffect(() => {
        if (isOpen) {
            setQuantity(1);
            setNotes('');
        }
    }, [isOpen, product]);

    if (!isOpen || !product) return null;

    const handleQuantityChange = (delta) => {
        const newQuantity = quantity + delta;
        if (newQuantity >= 1) {
            setQuantity(newQuantity);
        }
    };

    const handleConfirm = () => {
        dispatch(addToCart({
            ...product,
            quantity,
            notes
        }));
        dispatch(closeOrderModal());
    };

    const handleClose = () => {
        dispatch(closeOrderModal());
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity"
                onClick={handleClose}
            />

            {/* Modal Content */}
            <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                {/* Header Image */}
                <div className="h-48 relative">
                    <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />

                    <button
                        onClick={handleClose}
                        className="absolute top-4 right-4 w-8 h-8 rounded-full bg-black/20 hover:bg-black/40 text-white flex items-center justify-center backdrop-blur-md transition-colors"
                    >
                        <X size={18} />
                    </button>

                    <div className="absolute bottom-4 left-6 text-white">
                        <h2 className="text-2xl font-bold mb-1">{product.name}</h2>
                        <p className="text-white/90 font-medium">{formatCurrency(product.price, currency)}</p>
                    </div>
                </div>

                {/* Body */}
                <div className="p-6 space-y-6">
                    {/* Quantity Control */}
                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-100">
                        <span className="font-medium text-gray-700">Quantity</span>
                        <div className="flex items-center gap-4">
                            <button
                                onClick={() => handleQuantityChange(-1)}
                                className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${quantity <= 1
                                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                    : 'bg-white border border-gray-200 text-gray-600 hover:border-blue-500 hover:text-blue-500 shadow-sm'
                                    }`}
                                disabled={quantity <= 1}
                            >
                                <Minus size={18} />
                            </button>
                            <span className="text-xl font-bold text-gray-800 w-8 text-center">{quantity}</span>
                            <button
                                onClick={() => handleQuantityChange(1)}
                                className="w-10 h-10 rounded-full bg-white border border-gray-200 text-gray-600 hover:border-blue-500 hover:text-blue-500 shadow-sm flex items-center justify-center transition-colors"
                            >
                                <Plus size={18} />
                            </button>
                        </div>
                    </div>

                    {/* Special Instructions */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Special Instructions
                        </label>
                        <textarea
                            value={notes}
                            onChange={(e) => setNotes(e.target.value)}
                            placeholder="e.g. No onions, extra sauce..."
                            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-100 focus:border-blue-400 outline-none transition-all resize-none h-24 text-sm"
                        />
                    </div>

                    {/* Footer Actions */}
                    <div className="pt-2">
                        <button
                            onClick={handleConfirm}
                            className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold text-lg shadow-lg shadow-blue-200 flex items-center justify-center gap-2 transition-all active:scale-[0.98]"
                        >
                            <ShoppingBag size={20} />
                            Add to Order - {formatCurrency(product.price * quantity, currency)}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OrderModal;
