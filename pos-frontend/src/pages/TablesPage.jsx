import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Plus, Users, Search, Filter, MoreVertical, Edit, Trash2, CheckCircle, Clock, Coffee } from 'lucide-react';
import {
    fetchTables,
    addTable,
    updateTable,
    updateTableStatus,
    deleteTable,
    setFilter,
    selectFilteredTables,
    selectTablesLoading,
    selectTablesFilter
} from '../store/slices/tablesSlice';
import { selectUser } from '../store/slices/authSlice';
import TableModal from '../components/TableModal';

const TablesPage = () => {
    const dispatch = useDispatch();
    const tables = useSelector(selectFilteredTables);
    const isLoading = useSelector(selectTablesLoading);
    const currentFilter = useSelector(selectTablesFilter);
    const user = useSelector(selectUser);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingTable, setEditingTable] = useState(null);

    useEffect(() => {
        dispatch(fetchTables());
    }, [dispatch]);

    const handleAddTable = (tableData) => {
        dispatch(addTable(tableData));
    };

    const handleEditTable = (tableData) => {
        if (editingTable) {
            dispatch(updateTable({ id: editingTable._id, ...tableData }));
            setEditingTable(null);
        }
    };

    const handleDeleteTable = (id) => {
        if (window.confirm('Are you sure you want to delete this table?')) {
            dispatch(deleteTable(id));
        }
    };

    const handleClearTable = (id) => {
        if (window.confirm('Are you sure you want to clear this table?')) {
            dispatch(updateTableStatus({ id, status: 'available' }));
        }
    };

    const openEditModal = (table) => {
        setEditingTable(table);
        setIsModalOpen(true);
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'available': return 'bg-green-100 text-green-700 border-green-200';
            case 'occupied': return 'bg-red-100 text-red-700 border-red-200';
            case 'reserved': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
            case 'cleaning': return 'bg-blue-100 text-blue-700 border-blue-200';
            default: return 'bg-gray-100 text-gray-700 border-gray-200';
        }
    };

    const isAdmin = user?.role === 'admin';

    return (
        <div className="h-screen flex flex-col bg-gray-50">
            {/* Header */}
            <div className="bg-white border-b px-6 py-4 flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">Tables & Areas</h1>
                    <p className="text-gray-500 text-sm">Manage restaurant layout and status</p>
                </div>

                <div className="flex items-center gap-4">
                    {/* Filter Tabs */}
                    <div className="flex bg-gray-100 p-1 rounded-lg">
                        {['all', 'Indoor', 'Outdoor'].map((filter) => (
                            <button
                                key={filter}
                                onClick={() => dispatch(setFilter(filter))}
                                className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${currentFilter === filter
                                    ? 'bg-white text-gray-800 shadow-sm'
                                    : 'text-gray-500 hover:text-gray-700'
                                    }`}
                            >
                                {filter.charAt(0).toUpperCase() + filter.slice(1)}
                            </button>
                        ))}
                    </div>

                    {isAdmin && (
                        <button
                            onClick={() => {
                                setEditingTable(null);
                                setIsModalOpen(true);
                            }}
                            className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700 transition-colors shadow-sm"
                        >
                            <Plus size={20} />
                            <span>Add Table</span>
                        </button>
                    )}
                </div>
            </div>

            {/* Content */}
            <div className="flex-1 p-6 overflow-y-auto">
                {isLoading ? (
                    <div className="flex items-center justify-center h-full">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {tables.map((table) => (
                            <div
                                key={table._id}
                                className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow relative group"
                            >
                                {/* Admin Controls */}
                                {isAdmin && (
                                    <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity flex gap-2">
                                        <button
                                            onClick={(e) => { e.stopPropagation(); openEditModal(table); }}
                                            className="p-2 bg-gray-100 hover:bg-blue-50 text-gray-600 hover:text-blue-600 rounded-lg transition-colors"
                                        >
                                            <Edit size={16} />
                                        </button>
                                        <button
                                            onClick={(e) => { e.stopPropagation(); handleDeleteTable(table._id); }}
                                            className="p-2 bg-gray-100 hover:bg-red-50 text-gray-600 hover:text-red-600 rounded-lg transition-colors"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                )}

                                <div className="flex justify-between items-start mb-4">
                                    <div className="w-16 h-16 rounded-2xl bg-gray-50 flex items-center justify-center text-2xl font-bold text-gray-700">
                                        {table.tableNumber}
                                    </div>
                                    <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getStatusColor(table.status)} uppercase tracking-wide`}>
                                        {table.status}
                                    </span>
                                </div>

                                <div className="space-y-2">
                                    <div className="flex items-center text-gray-500 text-sm">
                                        <Users size={16} className="mr-2" />
                                        <span>Capacity: {table.capacity} persons</span>
                                    </div>
                                    <div className="flex items-center text-gray-500 text-sm">
                                        <Coffee size={16} className="mr-2" />
                                        <span>{table.section}</span>
                                    </div>
                                </div>

                                {/* Order Status / Action */}
                                <div className="mt-6 pt-4 border-t border-gray-50 space-y-2">
                                    {table.status === 'available' ? (
                                        <button className="w-full py-2 bg-gray-50 text-gray-600 rounded-xl font-medium hover:bg-blue-50 hover:text-blue-600 transition-colors">
                                            Start Order
                                        </button>
                                    ) : (
                                        <>
                                            <button className="w-full py-2 bg-blue-50 text-blue-600 rounded-xl font-medium hover:bg-blue-100 transition-colors">
                                                View Order
                                            </button>
                                            <button
                                                onClick={() => handleClearTable(table._id)}
                                                className="w-full py-2 bg-red-50 text-red-600 rounded-xl font-medium hover:bg-red-100 transition-colors"
                                            >
                                                Clear Table
                                            </button>
                                        </>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            <TableModal
                isOpen={isModalOpen}
                onClose={() => {
                    setIsModalOpen(false);
                    setEditingTable(null);
                }}
                onSubmit={editingTable ? handleEditTable : handleAddTable}
                initialData={editingTable}
                title={editingTable ? 'Edit Table' : 'Add New Table'}
            />
        </div>
    );
};

export default TablesPage;
