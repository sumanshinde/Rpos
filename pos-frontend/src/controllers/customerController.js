import Customer from '../models/Customer.js';
import catchAsync from '../middlewares/catchAsync.js';
import AppError from '../utils/AppError.js';

export const getAllCustomers = catchAsync(async (req, res, next) => {
    const customers = await Customer.find().sort('-createdAt');

    res.status(200).json({
        status: 'success',
        results: customers.length,
        data: {
            customers
        }
    });
});

export const getCustomer = catchAsync(async (req, res, next) => {
    const customer = await Customer.findById(req.params.id);

    if (!customer) {
        return next(new AppError('No customer found with that ID', 404));
    }

    res.status(200).json({
        status: 'success',
        data: {
            customer
        }
    });
});

export const createCustomer = catchAsync(async (req, res, next) => {
    const newCustomer = await Customer.create(req.body);

    res.status(201).json({
        status: 'success',
        data: {
            customer: newCustomer
        }
    });
});

export const updateCustomer = catchAsync(async (req, res, next) => {
    const customer = await Customer.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true
    });

    if (!customer) {
        return next(new AppError('No customer found with that ID', 404));
    }

    res.status(200).json({
        status: 'success',
        data: {
            customer
        }
    });
});

export const deleteCustomer = catchAsync(async (req, res, next) => {
    const customer = await Customer.findByIdAndDelete(req.params.id);

    if (!customer) {
        return next(new AppError('No customer found with that ID', 404));
    }

    res.status(204).json({
        status: 'success',
        data: null
    });
});
