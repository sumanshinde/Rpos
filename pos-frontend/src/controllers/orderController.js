import Order from '../models/Order.js';
import catchAsync from '../middlewares/catchAsync.js';
import AppError from '../utils/AppError.js';

export const getAllOrders = catchAsync(async (req, res, next) => {
    const orders = await Order.find().sort({ createdAt: -1 });

    res.status(200).json({
        status: 'success',
        results: orders.length,
        data: {
            orders
        }
    });
});

export const createOrder = catchAsync(async (req, res, next) => {
    const newOrder = await Order.create(req.body);

    res.status(201).json({
        status: 'success',
        data: {
            order: newOrder
        }
    });
});

export const getOrder = catchAsync(async (req, res, next) => {
    const order = await Order.findById(req.params.id);

    if (!order) {
        return next(new AppError('No order found with that ID', 404));
    }

    res.status(200).json({
        status: 'success',
        data: {
            order
        }
    });
});

export const updateOrder = catchAsync(async (req, res, next) => {
    const order = await Order.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true
    });

    if (!order) {
        return next(new AppError('No order found with that ID', 404));
    }

    res.status(200).json({
        status: 'success',
        data: {
            order
        }
    });
});

export const deleteOrder = catchAsync(async (req, res, next) => {
    const order = await Order.findByIdAndDelete(req.params.id);

    if (!order) {
        return next(new AppError('No order found with that ID', 404));
    }

    res.status(204).json({
        status: 'success',
        data: null
    });
});

export const updateOrderStatus = catchAsync(async (req, res, next) => {
    const order = await Order.findByIdAndUpdate(req.params.id, { status: req.body.status }, {
        new: true,
        runValidators: true
    });

    if (!order) {
        return next(new AppError('No order found with that ID', 404));
    }

    res.status(200).json({
        status: 'success',
        data: {
            order
        }
    });
});
