import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema({
    table: {
        type: String,
        required: [true, 'Order must belong to a table or be takeaway/delivery']
    },
    waiter: {
        type: String,
        required: [true, 'Order must have a waiter/staff assigned']
    },
    items: [{
        name: { type: String, required: true },
        quantity: { type: Number, required: true },
        price: { type: Number, required: true }
    }],
    status: {
        type: String,
        enum: ['pending', 'preparing', 'ready', 'served', 'paid', 'cancelled'],
        default: 'pending'
    },
    orderType: {
        type: String,
        enum: ['dine-in', 'takeaway', 'delivery'],
        default: 'dine-in'
    },
    total: {
        type: Number,
        required: true
    },
    subtotal: {
        type: Number,
        required: true
    },
    discount: {
        type: Number,
        default: 0
    },
    tax: {
        type: Number,
        required: true
    },
    paymentMethod: {
        type: String,
        enum: ['cash', 'card', 'qr'],
        default: 'cash'
    },
    paymentStatus: {
        type: String,
        enum: ['pending', 'completed', 'failed'],
        default: 'pending'
    },
    invoiceNumber: {
        type: String,
        unique: true,
        sparse: true
    },
    paymentId: {
        type: String
    },
    customer: {
        name: String,
        phone: String,
        address: String
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const Order = mongoose.model('Order', orderSchema);

export default Order;
