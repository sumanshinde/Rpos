import mongoose from 'mongoose';

const tableSchema = new mongoose.Schema({
    tableNumber: {
        type: String,
        required: [true, 'A table must have a number'],
        unique: true,
        trim: true
    },
    capacity: {
        type: Number,
        required: [true, 'A table must have a capacity'],
        min: [1, 'Capacity must be at least 1']
    },
    section: {
        type: String,
        required: [true, 'A table must belong to a section'],
        enum: {
            values: ['Indoor', 'Outdoor', 'Bar'],
            message: 'Section is either: Indoor, Outdoor, or Bar'
        }
    },
    status: {
        type: String,
        enum: ['available', 'occupied', 'reserved', 'cleaning'],
        default: 'available'
    }
});

const Table = mongoose.model('Table', tableSchema);

export default Table;
