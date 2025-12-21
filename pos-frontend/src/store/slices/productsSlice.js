import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getApiUrl } from '../../api/config';

export const fetchProducts = createAsyncThunk(
    'products/fetchProducts',
    async (_, { rejectWithValue }) => {
        try {
            const response = await fetch(getApiUrl('products/'));
            const data = await response.json();
            if (!response.ok) throw new Error(data.message || 'Failed to fetch products');
            return data; // Assuming DjangoViewSet returns list or paginated object. 
            // If using standard DRF ViewSet without pagination, it returns array directly or inside results if paginated.
            // My ViewSet uses default ModelViewSet, so usually returns array if no pagination set. 
            // Wait, standard DRF pagination is often PageNumberPagination.
            // Let's assume list for now or check data structure. 
            // To be safe, let's map data if it's paginated.
            // Actually, for simplicity let's handle list directly as per common practice in small apps.
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

const initialState = {
    products: [], // Empty initially
    activeCategory: 'all',
    searchQuery: '',
    loading: false,
    error: null,
};

const productsSlice = createSlice({
    name: 'products',
    initialState,
    reducers: {
        setActiveCategory: (state, action) => {
            state.activeCategory = action.payload;
        },
        setSearchQuery: (state, action) => {
            state.searchQuery = action.payload;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchProducts.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchProducts.fulfilled, (state, action) => {
                state.loading = false;
                // Handle DRF pagination if present (results key)
                state.products = Array.isArray(action.payload) ? action.payload : action.payload.results || [];
            })
            .addCase(fetchProducts.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    }
});

export const { setActiveCategory, setSearchQuery } = productsSlice.actions;

// Selectors
export const selectAllProducts = (state) => state.products.products;
export const selectActiveCategory = (state) => state.products.activeCategory;
export const selectSearchQuery = (state) => state.products.searchQuery;
export const selectProductsLoading = (state) => state.products.loading;

export const selectFilteredProducts = (state) => {
    const { products, activeCategory, searchQuery } = state.products;
    return products.filter(product => {
        // Handle category filter - matching by ID or name
        // The previous code expected 'burger', 'pizza' etc.
        // Now products have category objects or IDs.
        // Assuming category field in product is ID (from serializer PrimaryKeyRelatedField default).
        // Check ProductSerializer in backend.

        // Actually ProductSerializer had:
        // category_detail = CategorySerializer(source='category', read_only=True)
        // category = serializers.PrimaryKeyRelatedField(...)

        // So checking `product.category` will be ID.
        // But checking `product.category_detail.slug` (if exists) might be better if frontend uses slugs.

        // Let's rely on basic filtering for now.
        const matchesCategory = activeCategory === 'all' ||
            product.category === activeCategory ||
            (product.category_detail && product.category_detail.slug === activeCategory);

        const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesCategory && matchesSearch;
    });
};

export const selectCategoryCount = (categoryId) => (state) => {
    const { products } = state.products;
    if (categoryId === 'all') return products.length;
    return products.filter(p =>
        p.category === categoryId ||
        (p.category_detail && p.category_detail.slug === categoryId)
    ).length;
};

export default productsSlice.reducer;
