import React from 'react';
import { useSelector } from 'react-redux';
import { Plus, Star, Sparkles, TrendingUp } from 'lucide-react';
import { selectCurrency } from '../store/slices/uiSlice';
import { formatCurrency } from '../utils/formatCurrency';

const BADGE_STYLES = {
    popular: { bg: 'bg-orange-500', icon: TrendingUp, text: 'Popular' },
    new: { bg: 'bg-green-500', icon: Sparkles, text: 'New' },
    featured: { bg: 'bg-purple-500', icon: Star, text: 'Featured' },
};

const CATEGORY_COLORS = {
    burger: 'bg-red-100 text-red-700',
    pizza: 'bg-yellow-100 text-yellow-700',
    drinks: 'bg-blue-100 text-blue-700',
    dessert: 'bg-pink-100 text-pink-700',
};

const ProductCard = ({ product, onAddToCart }) => {
    const currency = useSelector(selectCurrency);
    const badgeConfig = product.badge ? BADGE_STYLES[product.badge] : null;
    const BadgeIcon = badgeConfig?.icon;

    // Get category slug for color mapping, support both category string and category_detail object
    const categorySlug = product.category_detail?.slug || product.category;
    const categoryName = product.category_detail?.name || product.category;
    const categoryColor = CATEGORY_COLORS[categorySlug] || 'bg-gray-100 text-gray-700';

    return (
        <div
            onClick={() => onAddToCart(product)}
            className="bg-white rounded-xl p-4 shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer group border border-gray-100 hover:border-blue-200 hover:-translate-y-1"
        >
            {/* Image Container */}
            <div className="aspect-square rounded-lg bg-gray-100 mb-3 overflow-hidden relative">
                <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                {/* Badge */}
                {badgeConfig && (
                    <div className={`absolute top-2 left-2 ${badgeConfig.bg} text-white px-2 py-1 rounded-lg text-xs font-bold flex items-center gap-1 shadow-md animate-in fade-in slide-in-from-top-2 duration-300`}>
                        <BadgeIcon size={12} />
                        {badgeConfig.text}
                    </div>
                )}

                {/* Category Tag */}
                <div className={`absolute bottom-2 left-2 ${categoryColor} px-2 py-1 rounded-md text-xs font-medium backdrop-blur-sm bg-opacity-90`}>
                    {typeof categoryName === 'string' ? categoryName.charAt(0).toUpperCase() + categoryName.slice(1) : categoryName}
                </div>
            </div>

            {/* Product Info */}
            <div className="space-y-2">
                <h3 className="font-semibold text-gray-800 text-sm line-clamp-2 leading-tight group-hover:text-blue-600 transition-colors">
                    {product.name}
                </h3>
                <div className="flex items-center justify-between">
                    <span className="font-bold text-blue-600 text-lg">{formatCurrency(product.price, currency)}</span>
                    <button
                        className="w-9 h-9 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 hover:bg-blue-600 hover:text-white transition-all duration-200 hover:scale-110 shadow-sm group-hover:shadow-md"
                        onClick={(e) => {
                            e.stopPropagation();
                            onAddToCart(product);
                        }}
                    >
                        <Plus size={18} strokeWidth={2.5} />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ProductCard;
