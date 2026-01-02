import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Search, Plus, Edit2, Trash2, X, Image as ImageIcon, DollarSign, Tag, Upload } from 'lucide-react';
import { fetchProducts, selectFilteredProducts, selectCategoryCount } from '../store/slices/productsSlice';
import { getApiUrl } from '../api/config';

// Temporary inline Product operations until slice is updated with CRUD
// Ideally these should be in productsSlice.js
const deleteProductApi = async (id) => {
    const token = localStorage.getItem('token');
    await fetch(getApiUrl(`products/${id}/`), {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
    });
};

const createProductApi = async (formData) => {
    const token = localStorage.getItem('token');
    const response = await fetch(getApiUrl('products/'), {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
    });
    return response.json();
};

const updateProductApi = async (id, formData) => {
    const token = localStorage.getItem('token');
    const response = await fetch(getApiUrl(`products/${id}/`), {
        method: 'PATCH',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
    });
    return response.json();
};

const MenuPage = () => {
    const dispatch = useDispatch();
    // Re-using the same selector from POS page, but we might want all products
    // For now, let's just fetch all and filter locally
    const products = useSelector(state => state.products.products);

    // We also need categories. Assuming they are in state or hardcoded for now.
    // In a real app we'd fetch categories from API.
    const [categories, setCategories] = useState([]);

    const [searchTerm, setSearchTerm] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingProduct, setEditingProduct] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    // Form State
    const [formData, setFormData] = useState({
        name: '',
        price: '',
        category: '',
        image: '',
        description: '',
        is_available: true
    });

    useEffect(() => {
        dispatch(fetchProducts());
        // Fetch categories separately since they are foreign keys
        fetch(getApiUrl('categories/'))
            .then(res => res.json())
            .then(data => setCategories(data))
            .catch(err => console.error("Failed to load categories", err));
    }, [dispatch]);

    const filteredProducts = products.filter(product =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            // Ensure category is sent as ID
            const payload = {
                ...formData,
                price: parseFloat(formData.price),
                // If the selected value is the category object (from edit), get ID, else it's the ID string
                category: typeof formData.category === 'object' ? formData.category.id : formData.category
            };

            if (editingProduct) {
                await updateProductApi(editingProduct.id, payload);
            } else {
                await createProductApi(payload);
            }
            // Refresh list
            dispatch(fetchProducts());
            setIsModalOpen(false);
            resetForm();
        } catch (error) {
            console.error('Operation failed', error);
            alert('Failed to save product');
        } finally {
            setIsLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this product?')) {
            try {
                await deleteProductApi(id);
                dispatch(fetchProducts());
            } catch (error) {
                console.error('Delete failed', error);
            }
        }
    };

    const resetForm = () => {
        setEditingProduct(null);
        setFormData({
            name: '',
            price: '',
            category: categories.length > 0 ? categories[0].id : '',
            image: '',
            description: '',
            is_available: true
        });
    };

    const openEditModal = (product) => {
        setEditingProduct(product);
        setFormData({
            name: product.name,
            price: product.price,
            category: product.category, // This comes as ID from serializer
            image: product.image || '',
            description: product.description || '',
            is_available: product.is_available
        });
        setIsModalOpen(true);
    };

    const openAddModal = () => {
        resetForm();
        setIsModalOpen(true);
    };

    // Error State
    const productsError = useSelector(state => state.products.error);

    if (productsError) {
        return (
            <div className="h-full flex flex-col items-center justify-center text-red-600 p-6">
                <div className="bg-red-50 p-6 rounded-full mb-4">
                    <X size={48} />
                </div>
                <h2 className="text-xl font-bold mb-2">Connection Error</h2>
                <p className="text-gray-600 text-center max-w-md mb-6">
                    {productsError === "Failed to fetch"
                        ? "Could not connect to the server. Please ensure the backend is running."
                        : productsError}
                </p>
                <button
                    onClick={() => window.location.reload()}
                    className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                >
                    Retry Connection
                </button>
            </div>
        );
    }

    return (
        <div className="h-full flex flex-col bg-gray-50">
            {/* Header */}
            <div className="p-6 bg-white shadow-sm border-b border-gray-200">
                <div className="flex justify-between items-center mb-4">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-800">Menu Management</h1>
                        <p className="text-gray-500">Add, edit, and organize your menu items</p>
                    </div>
                    <button
                        onClick={openAddModal}
                        className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                    >
                        <Plus size={20} />
                        Add Product
                    </button>
                </div>

                <div className="relative max-w-md">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                    <input
                        type="text"
                        placeholder="Search products..."
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            {/* Content */}
            <div className="flex-1 p-6 overflow-auto">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {filteredProducts.map((product) => (
                        <div key={product.id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden group hover:shadow-md transition-all">
                            <div className="aspect-square relative flex items-center justify-center bg-gray-100 overflow-hidden">
                                {product.image ? (
                                    <img src={product.image} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                                ) : (
                                    <ImageIcon className="text-gray-300" size={48} />
                                )}
                                <div className="absolute top-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button
                                        onClick={() => openEditModal(product)}
                                        className="p-2 bg-white/90 text-blue-600 rounded-lg hover:bg-white shadow-sm"
                                        title="Edit"
                                    >
                                        <Edit2 size={16} />
                                    </button>
                                    <button
                                        onClick={() => handleDelete(product.id)}
                                        className="p-2 bg-white/90 text-red-600 rounded-lg hover:bg-white shadow-sm"
                                        title="Delete"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                                <div className="absolute bottom-2 left-2">
                                    <span className={`px-2 py-1 rounded text-xs font-bold ${product.is_available ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                        {product.is_available ? 'Available' : 'Unavailable'}
                                    </span>
                                </div>
                            </div>
                            <div className="p-4">
                                <div className="flex justify-between items-start mb-2">
                                    <h3 className="font-semibold text-gray-800 line-clamp-1" title={product.name}>{product.name}</h3>
                                    <span className="font-bold text-blue-600">₹{parseFloat(product.price).toFixed(2)}</span>
                                </div>
                                <p className="text-xs text-gray-500 line-clamp-2 mb-3 h-8">
                                    {product.description || 'No description available'}
                                </p>
                                <div className="flex justify-between items-center text-xs text-gray-500 border-t pt-3">
                                    <span className="bg-gray-100 px-2 py-1 rounded">
                                        {categories.find(c => c.id === product.category)?.name || 'Unknown Category'}
                                    </span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Add/Edit Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh]">
                        <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center bg-gray-50">
                            <h3 className="text-lg font-bold text-gray-800">
                                {editingProduct ? 'Edit Product' : 'Add New Product'}
                            </h3>
                            <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                                <X size={20} />
                            </button>
                        </div>

                        <div className="p-6 overflow-y-auto">
                            <form id="productForm" onSubmit={handleSubmit} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Product Name</label>
                                    <div className="relative">
                                        <Tag className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                        <input
                                            type="text"
                                            required
                                            value={formData.name}
                                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                            placeholder="e.g. Cheese Burger"
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Price</label>
                                        <div className="relative">
                                            <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                            <input
                                                type="number"
                                                step="0.01"
                                                required
                                                value={formData.price}
                                                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                                                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                                placeholder="0.00"
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                                        <select
                                            required
                                            value={typeof formData.category === 'object' ? formData.category.id : formData.category}
                                            onChange={(e) => setFormData({ ...formData, category: parseInt(e.target.value) })}
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                        >
                                            <option value="">Select Category</option>
                                            {categories.map(cat => (
                                                <option key={cat.id} value={cat.id}>{cat.name}</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Image URL</label>
                                    <div className="relative">
                                        <Upload className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                        <input
                                            type="url"
                                            value={formData.image}
                                            onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                            placeholder="https://example.com/image.jpg"
                                        />
                                    </div>
                                    <p className="text-xs text-gray-500 mt-1">Provide a direct link to an image.</p>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                                    <textarea
                                        rows="3"
                                        value={formData.description}
                                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none resize-none"
                                        placeholder="Product description..."
                                    />
                                </div>

                                <div className="flex items-center gap-2">
                                    <input
                                        type="checkbox"
                                        id="isAvailable"
                                        checked={formData.is_available}
                                        onChange={(e) => setFormData({ ...formData, is_available: e.target.checked })}
                                        className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500 border-gray-300"
                                    />
                                    <label htmlFor="isAvailable" className="text-sm font-medium text-gray-700">Available for sale</label>
                                </div>
                            </form>
                        </div>

                        <div className="px-6 py-4 border-t border-gray-200 bg-gray-50 flex gap-3">
                            <button
                                type="button"
                                onClick={() => setIsModalOpen(false)}
                                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 font-medium transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                form="productForm"
                                disabled={isLoading}
                                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium transition-colors disabled:opacity-50"
                            >
                                {isLoading ? 'Saving...' : 'Save Product'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default MenuPage;
