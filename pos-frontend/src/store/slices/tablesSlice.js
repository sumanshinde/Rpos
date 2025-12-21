import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

import { getApiUrl } from '../../api/config';

// Async Thunks
export const fetchTables = createAsyncThunk(
    'tables/fetchTables',
    async (_, { rejectWithValue }) => {
        try {
            const response = await fetch(getApiUrl('tables/'));
            const data = await response.json();
            if (!response.ok) throw new Error(data.message || 'Failed to fetch tables');
            return data; // Django returns array directly, not data.data.tables
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

export const addTable = createAsyncThunk(
    'tables/addTable',
    async (tableData, { rejectWithValue }) => {
        try {
            const response = await fetch(getApiUrl('tables/'), {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(tableData)
            });
            const data = await response.json();
            if (!response.ok) throw new Error(data.message || 'Failed to add table');
            return data; // Django returns object directly
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

export const updateTable = createAsyncThunk(
    'tables/updateTable',
    async ({ id, ...updateData }, { rejectWithValue }) => {
        try {
            const response = await fetch(getApiUrl(`tables/${id}/`), {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(updateData)
            });
            const data = await response.json();
            if (!response.ok) throw new Error(data.message || 'Failed to update table');
            return data; // Django returns object directly
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

export const updateTableStatus = createAsyncThunk(
    'tables/updateTableStatus',
    async ({ id, status }, { rejectWithValue }) => {
        try {
            const response = await fetch(getApiUrl(`tables/${id}/status/`), {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status })
            });
            const data = await response.json();
            if (!response.ok) throw new Error(data.message || 'Failed to update table status');
            return data; // Django returns object directly
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

export const deleteTable = createAsyncThunk(
    'tables/deleteTable',
    async (id, { rejectWithValue }) => {
        try {
            const response = await fetch(getApiUrl(`tables/${id}/`), {
                method: 'DELETE'
            });
            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.message || 'Failed to delete table');
            }
            return id;
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

const initialState = {
    tables: [],
    isLoading: false,
    error: null,
    filter: 'all' // 'all', 'Indoor', 'Outdoor', etc.
};

const tablesSlice = createSlice({
    name: 'tables',
    initialState,
    reducers: {
        setFilter: (state, action) => {
            state.filter = action.payload;
        },
        clearError: (state) => {
            state.error = null;
        }
    },
    extraReducers: (builder) => {
        builder
            // Fetch Tables
            .addCase(fetchTables.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(fetchTables.fulfilled, (state, action) => {
                state.isLoading = false;
                state.tables = action.payload;
            })
            .addCase(fetchTables.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
            })
            // Add Table
            .addCase(addTable.fulfilled, (state, action) => {
                state.tables.push(action.payload);
            })
            // Update Table & Status
            .addCase(updateTable.fulfilled, (state, action) => {
                const index = state.tables.findIndex(t => t.id === action.payload.id);
                if (index !== -1) state.tables[index] = action.payload;
            })
            .addCase(updateTableStatus.fulfilled, (state, action) => {
                const index = state.tables.findIndex(t => t.id === action.payload.id);
                if (index !== -1) state.tables[index] = action.payload;
            })
            // Delete Table
            .addCase(deleteTable.fulfilled, (state, action) => {
                state.tables = state.tables.filter(t => t.id !== action.payload);
            });
    }
});

export const { setFilter, clearError } = tablesSlice.actions;

export const selectAllTables = (state) => state.tables.tables;
export const selectTablesLoading = (state) => state.tables.isLoading;
export const selectTablesError = (state) => state.tables.error;
export const selectTablesFilter = (state) => state.tables.filter;

export const selectFilteredTables = (state) => {
    const tables = state.tables.tables;
    const filter = state.tables.filter;

    if (filter === 'all') return tables;
    return tables.filter(table => table.section === filter);
};

export default tablesSlice.reducer;
