import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    // Modal states
    isOrderModalOpen: false,
    isReceiptModalOpen: false,
    selectedProduct: null,
    receiptData: null,

    // Order metadata
    orderType: 'dine-in',
    selectedTable: 'T1',
    selectedWaiter: 'John',
    // Currency
    currency: 'INR',
};

const uiSlice = createSlice({
    name: 'ui',
    initialState,
    reducers: {
        openOrderModal: (state, action) => {
            state.isOrderModalOpen = true;
            state.selectedProduct = action.payload;
        },
        closeOrderModal: (state) => {
            state.isOrderModalOpen = false;
            state.selectedProduct = null;
        },
        openReceiptModal: (state, action) => {
            state.isReceiptModalOpen = true;
            state.receiptData = action.payload;
        },
        closeReceiptModal: (state) => {
            state.isReceiptModalOpen = false;
            state.receiptData = null;
        },
        setOrderType: (state, action) => {
            state.orderType = action.payload;
        },
        setSelectedTable: (state, action) => {
            state.selectedTable = action.payload;
        },
        setSelectedWaiter: (state, action) => {
            state.selectedWaiter = action.payload;
        },
        // Currency reducer
        setCurrency: (state, action) => {
            state.currency = action.payload;
        },
    },
});

export const {
    openOrderModal,
    closeOrderModal,
    openReceiptModal,
    closeReceiptModal,
    setOrderType,
    setSelectedTable,
    setSelectedWaiter,
    setCurrency,
} = uiSlice.actions;

// Selectors
export const selectIsOrderModalOpen = (state) => state.ui.isOrderModalOpen;
export const selectIsReceiptModalOpen = (state) => state.ui.isReceiptModalOpen;
export const selectSelectedProduct = (state) => state.ui.selectedProduct;
export const selectReceiptData = (state) => state.ui.receiptData;
export const selectOrderType = (state) => state.ui.orderType;
export const selectSelectedTable = (state) => state.ui.selectedTable;
export const selectSelectedWaiter = (state) => state.ui.selectedWaiter;
export const selectCurrency = (state) => state.ui.currency;

export default uiSlice.reducer;
