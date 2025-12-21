import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Search, UtensilsCrossed, Pizza, Coffee, IceCream, Grid3x3 } from 'lucide-react';
import ProductCard from '../components/ProductCard';
import CartSidebar from '../components/CartSidebar';
import ReceiptModal from '../components/ReceiptModal';
import OrderModal from '../components/OrderModal';
import {
    selectFilteredProducts,
    selectActiveCategory,
    selectSearchQuery,
    selectCategoryCount,
    setActiveCategory,
    setSearchQuery,
    fetchProducts
} from '../store/slices/productsSlice';
import {
    openOrderModal,
    openReceiptModal,
    closeReceiptModal,
    selectIsReceiptModalOpen,
    selectReceiptData,
    selectOrderType,
    selectSelectedTable,
    selectSelectedWaiter,
    setOrderType,
    setSelectedTable,
    setSelectedWaiter
} from '../store/slices/uiSlice';
import { clearCart, selectCartItems, selectCartSubtotal, selectDiscount } from '../store/slices/cartSlice';
import { fetchTables, updateTable, selectAllTables } from '../store/slices/tablesSlice';

// Mock Data
const CATEGORIES = [
    { id: 'all', name: 'All Menu', icon: Grid3x3 },
    { id: 'burger', name: 'Burger', icon: UtensilsCrossed },
    { id: 'pizza', name: 'Pizza', icon: Pizza },
    { id: 'drinks', name: 'Drinks', icon: Coffee },
    { id: 'dessert', name: 'Dessert', icon: IceCream },
];

const POSPage = () => {
    const dispatch = useDispatch();

    // Redux selectors
    const filteredProducts = useSelector(selectFilteredProducts);
    const activeCategory = useSelector(selectActiveCategory);
    const searchQuery = useSelector(selectSearchQuery);
    const isReceiptModalOpen = useSelector(selectIsReceiptModalOpen);
    const receiptData = useSelector(selectReceiptData);
    const orderType = useSelector(selectOrderType);
    const selectedTable = useSelector(selectSelectedTable);
    const selectedWaiter = useSelector(selectSelectedWaiter);
    const cartItems = useSelector(selectCartItems);
    const subtotal = useSelector(selectCartSubtotal);
    const discount = useSelector(selectDiscount);
    const tables = useSelector(selectAllTables);

    // Fetch products and tables on mount
    React.useEffect(() => {
        dispatch(fetchProducts());
        dispatch(fetchTables());
    }, [dispatch]);

    const handleProductClick = (product) => {
        dispatch(openOrderModal(product));
    };

    const handleTableSelect = (tableId) => {
        if (!tableId) {
            dispatch(setSelectedTable(null));
            return;
        }

        const table = tables.find(t => t.id === tableId);
        if (table && table.status === 'available') {
            // Update table status to occupied
            dispatch(updateTable({
                id: tableId,
                status: 'occupied'
            }));
        }
        dispatch(setSelectedTable(table));
    };

    const handleCheckout = (orderData) => {
        const now = new Date();
        const receiptInfo = {
            ...orderData,
            orderNumber: String(Date.now()).slice(-5),
            date: now.toLocaleDateString(),
            time: now.toLocaleTimeString(),
        };
        dispatch(openReceiptModal(receiptInfo));
        dispatch(clearCart());
    };

    const handleCloseReceipt = () => {
        dispatch(closeReceiptModal());
    };

    return (
        <>
            <div className="flex h-screen overflow-hidden">
                {/* Main Content */}
                <div className="flex-1 flex flex-col h-full overflow-hidden">
                    {/* Header */}
                    <header className="px-8 py-6 bg-white border-b border-gray-100 shrink-0">
                        <div className="flex justify-between items-center mb-4">
                            <div>
                                <h1 className="text-2xl font-bold text-gray-800">Point of Sale</h1>
                                <p className="text-gray-500 text-sm mt-1">Thu, 04 Dec 2025</p>
                            </div>
                            <div className="relative w-96">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                                <input
                                    type="text"
                                    placeholder="Search for food, coffee, etc..."
                                    className="w-full pl-10 pr-4 py-3 bg-gray-50 rounded-xl border-none focus:ring-2 focus:ring-blue-100 outline-none transition-all"
                                    value={searchQuery}
                                    onChange={(e) => dispatch(setSearchQuery(e.target.value))}
                                />
                            </div>
                        </div>

                        {/* Order Metadata */}
                        <div className="flex gap-4">
                            <div className="flex-1">
                                <label className="text-xs font-medium text-gray-500 mb-1 block">Order Type</label>
                                <select
                                    value={orderType}
                                    onChange={(e) => dispatch(setOrderType(e.target.value))}
                                    className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm font-medium focus:ring-2 focus:ring-blue-100 outline-none"
                                >
                                    <option value="dine-in">Dine In</option>
                                    <option value="takeaway">Takeaway</option>
                                    <option value="delivery">Delivery</option>
                                </select>
                            </div>
                            <div className="flex-1">
                                <label className="text-xs font-medium text-gray-500 mb-1 block">Table</label>
                                <select
                                    value={selectedTable?.id || ''}
                                    onChange={(e) => handleTableSelect(e.target.value)}
                                    className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm font-medium focus:ring-2 focus:ring-blue-100 outline-none"
                                    disabled={orderType !== 'dine-in'}
                                >
                                    <option value="">Select Table</option>
                                    {tables.map((table) => (
                                        <option
                                            key={table.id}
                                            value={table.id}
                                            disabled={table.status === 'occupied' || table.status === 'reserved'}
                                        >
                                            Table {table.table_number} - {table.section} ({table.status})
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div className="flex-1">
                                <label className="text-xs font-medium text-gray-500 mb-1 block">Waiter</label>
                                <select
                                    value={selectedWaiter}
                                    onChange={(e) => dispatch(setSelectedWaiter(e.target.value))}
                                    className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm font-medium focus:ring-2 focus:ring-blue-100 outline-none"
                                >
                                    <option value="John">John</option>
                                    <option value="Sarah">Sarah</option>
                                    <option value="Mike">Mike</option>
                                    <option value="Emma">Emma</option>
                                </select>
                            </div>
                        </div>
                    </header >

                    {/* Categories */}
                    < div className="px-8 py-6 shrink-0" >
                        <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
                            {CATEGORIES.map(category => {
                                const CategoryIcon = category.icon;
                                const count = useSelector(selectCategoryCount(category.id));
                                return (
                                    <button
                                        key={category.id}
                                        onClick={() => dispatch(setActiveCategory(category.id))}
                                        className={`flex items-center gap-2 px-5 py-3 rounded-xl font-medium whitespace-nowrap transition-all duration-200
                                            ${activeCategory === category.id
                                                ? 'bg-blue-600 text-white shadow-lg shadow-blue-200 scale-105'
                                                : 'bg-white text-gray-600 border border-gray-200 hover:border-blue-300 hover:text-blue-600 hover:shadow-md'
                                            }
                                        `}
                                    >
                                        <CategoryIcon size={18} />
                                        <span>{category.name}</span>
                                        <span className={`px-2 py-0.5 rounded-full text-xs font-bold
                                            ${activeCategory === category.id
                                                ? 'bg-white/20 text-white'
                                                : 'bg-gray-100 text-gray-600'
                                            }
                                        `}>
                                            {count}
                                        </span>
                                    </button>
                                );
                            })}
                        </div>
                    </div >

                    {/* Product Grid */}
                    < div className="flex-1 overflow-y-auto px-8 pb-8" >
                        {
                            filteredProducts.length === 0 ? (
                                <div className="h-full flex flex-col items-center justify-center text-gray-400 py-20">
                                    <div className="w-24 h-24 rounded-full bg-gray-50 flex items-center justify-center mb-4">
                                        <Search size={40} className="opacity-30" />
                                    </div>
                                    <p className="font-medium text-gray-500 text-lg">No products found</p>
                                    <p className="text-sm text-center mt-2 max-w-sm">
                                        {searchQuery ? `No results for "${searchQuery}"` : 'Try selecting a different category'}
                                    </p>
                                </div>
                            ) : (
                                <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                                    {filteredProducts.map(product => (
                                        <ProductCard
                                            key={product.id}
                                            product={product}
                                            onAddToCart={handleProductClick}
                                        />
                                    ))}
                                </div>
                            )
                        }
                    </div >
                </div >

                {/* Cart Sidebar */}
                < div className="shrink-0 h-full" >
                    <CartSidebar onCheckout={handleCheckout} />
                </div >
            </div >

            {/* Receipt Modal */}
            {
                receiptData && (
                    <ReceiptModal
                        isOpen={isReceiptModalOpen}
                        onClose={handleCloseReceipt}
                        orderData={receiptData}
                    />
                )
            }

            {/* Order Modal */}
            <OrderModal />
        </>
    );
};

export default POSPage;
