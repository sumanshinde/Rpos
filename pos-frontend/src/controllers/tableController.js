import Table from '../models/Table.js';
import catchAsync from '../middlewares/catchAsync.js';
import AppError from '../utils/AppError.js';

export const getAllTables = catchAsync(async (req, res, next) => {
    const tables = await Table.find();

    res.status(200).json({
        status: 'success',
        results: tables.length,
        data: {
            tables
        }
    });
});

export const createTable = catchAsync(async (req, res, next) => {
    const newTable = await Table.create(req.body);

    res.status(201).json({
        status: 'success',
        data: {
            table: newTable
        }
    });
});

export const updateTable = catchAsync(async (req, res, next) => {
    const table = await Table.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true
    });

    if (!table) {
        return next(new AppError('No table found with that ID', 404));
    }

    res.status(200).json({
        status: 'success',
        data: {
            table
        }
    });
});

export const deleteTable = catchAsync(async (req, res, next) => {
    const table = await Table.findByIdAndDelete(req.params.id);

    if (!table) {
        return next(new AppError('No table found with that ID', 404));
    }

    res.status(204).json({
        status: 'success',
        data: null
    });
});

export const updateTableStatus = catchAsync(async (req, res, next) => {
    const table = await Table.findByIdAndUpdate(req.params.id, { status: req.body.status }, {
        new: true,
        runValidators: true
    });

    if (!table) {
        return next(new AppError('No table found with that ID', 404));
    }

    res.status(200).json({
        status: 'success',
        data: {
            table
        }
    });
});
