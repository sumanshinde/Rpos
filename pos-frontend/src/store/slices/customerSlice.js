import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getApiUrl } from '../../api/config';

export const fetchCustomers = createAsyncThunk(
    'customers/fetchCustomers',
    async (_, { rejectWithValue }) => {
        try {
            const response = await fetch(getApiUrl('customers/'));
            const data = await response.json();
            if (!response.ok) throw new Error(data.message || 'Failed to fetch customers');
            return data;
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

export const createCustomer = createAsyncThunk(
    'customers/createCustomer',
    async (customerData, { rejectWithValue }) => {
        try {
            const response = await fetch(getApiUrl('customers/'), {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(customerData)
            });
            const data = await response.json();
            if (!response.ok) throw new Error(data.message || 'Failed to create customer');
            return data;
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

export const updateCustomer = createAsyncThunk(
    'customers/updateCustomer',
    async ({ id, data }, { rejectWithValue }) => {
        try {
            const response = await fetch(getApiUrl(`customers/${id}/`), {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });
            const responseData = await response.json();
            if (!response.ok) throw new Error(responseData.message || 'Failed to update customer');
            return responseData;
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

export const deleteCustomer = createAsyncThunk(
    'customers/deleteCustomer',
    async (id, { rejectWithValue }) => {
        try {
            const response = await fetch(getApiUrl(`customers/${id}/`), {
                method: 'DELETE'
            });
            if (!response.ok) throw new Error('Failed to delete customer');
            return id;
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

const initialState = {
    customers: [],
    loading: false,
    error: null,
    success: false
};

const customerSlice = createSlice({
    name: 'customers',
    initialState,
    reducers: {
        clearError: (state) => {
            state.error = null;
        },
        resetSuccess: (state) => {
            state.success = false;
        }
    },
    extraReducers: (builder) => {
        builder
            // Fetch Customers
            .addCase(fetchCustomers.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchCustomers.fulfilled, (state, action) => {
                state.loading = false;
                state.customers = action.payload;
            })
            .addCase(fetchCustomers.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // Create Customer
            .addCase(createCustomer.pending, (state) => {
                state.loading = true;
                state.error = null;
                state.success = false;
            })
            .addCase(createCustomer.fulfilled, (state, action) => {
                state.loading = false;
                state.customers.unshift(action.payload);
                state.success = true;
            })
            .addCase(createCustomer.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // Update Customer
            .addCase(updateCustomer.pending, (state) => {
                state.loading = true;
                state.error = null;
                state.success = false;
            })
            .addCase(updateCustomer.fulfilled, (state, action) => {
                state.loading = false;
                const index = state.customers.findIndex(c => c.id === action.payload.id);
                if (index !== -1) {
                    state.customers[index] = action.payload;
                }
                state.success = true;
            })
            .addCase(updateCustomer.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // Delete Customer
            .addCase(deleteCustomer.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(deleteCustomer.fulfilled, (state, action) => {
                state.loading = false;
                state.customers = state.customers.filter(c => c.id !== action.payload);
            })
            .addCase(deleteCustomer.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    }
});

export const { clearError, resetSuccess } = customerSlice.actions;
export default customerSlice.reducer;
