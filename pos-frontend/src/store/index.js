import { configureStore } from '@reduxjs/toolkit';
import cartReducer from './slices/cartSlice';
import productsReducer from './slices/productsSlice';
import uiReducer from './slices/uiSlice';
import authReducer from './slices/authSlice';
import tablesReducer from './slices/tablesSlice';
import customersReducer from './slices/customerSlice';
import ordersReducer from './slices/ordersSlice';

export const store = configureStore({
    reducer: {
        cart: cartReducer,
        products: productsReducer,
        ui: uiReducer,
        auth: authReducer,
        tables: tablesReducer,
        customers: customersReducer,
        orders: ordersReducer,
    },
});

export default store;
