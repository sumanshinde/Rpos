import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    items: [],
    discount: 0,
    paymentMethod: 'card',
};

const cartSlice = createSlice({
    name: 'cart',
    initialState,
    reducers: {
        addToCart: (state, action) => {
            const { id, quantity = 1, notes } = action.payload;
            const existingItem = state.items.find(item => item.id === id);

            if (existingItem) {
                existingItem.quantity += quantity;
                if (notes) existingItem.notes = notes;
            } else {
                state.items.push({ ...action.payload, quantity });
            }
        },
        updateQuantity: (state, action) => {
            const { id, quantity } = action.payload;
            const item = state.items.find(item => item.id === id);

            if (item) {
                if (quantity < 1) {
                    state.items = state.items.filter(item => item.id !== id);
                } else {
                    item.quantity = quantity;
                }
            }
        },
        removeItem: (state, action) => {
            state.items = state.items.filter(item => item.id !== action.payload);
        },
        clearCart: (state) => {
            state.items = [];
            state.discount = 0;
        },
        setDiscount: (state, action) => {
            state.discount = action.payload;
        },
        setPaymentMethod: (state, action) => {
            state.paymentMethod = action.payload;
        },
    },
});

export const {
    addToCart,
    updateQuantity,
    removeItem,
    clearCart,
    setDiscount,
    setPaymentMethod,
} = cartSlice.actions;

// Selectors
export const selectCartItems = (state) => state.cart.items;
export const selectCartCount = (state) =>
    state.cart.items.reduce((sum, item) => sum + item.quantity, 0);
export const selectCartSubtotal = (state) =>
    state.cart.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
export const selectDiscount = (state) => state.cart.discount;
export const selectPaymentMethod = (state) => state.cart.paymentMethod;

export default cartSlice.reducer;
