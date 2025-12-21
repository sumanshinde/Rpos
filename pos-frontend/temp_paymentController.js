const Razorpay = require('razorpay');
const crypto = require('crypto');
const AppError = require('../utils/AppError');
const catchAsync = require('../middlewares/catchAsync');

const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET
});

exports.createOrder = catchAsync(async (req, res, next) => {
    const { amount, currency = 'INR' } = req.body;

    if (!amount) {
        return next(new AppError('Amount is required', 400));
    }

    const options = {
        amount: amount * 100, // Razorpay expects amount in paise
        currency,
        receipt: `receipt_${Date.now()}`
    };

    const order = await razorpay.orders.create(options);

    res.status(200).json({
        status: 'success',
        data: {
            order
        }
    });
});

exports.verifyPayment = catchAsync(async (req, res, next) => {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

    const body = razorpay_order_id + "|" + razorpay_payment_id;

    const expectedSignature = crypto
        .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
        .update(body.toString())
        .digest('hex');

    const isAuthentic = expectedSignature === razorpay_signature;

    if (isAuthentic) {
        // Payment successful
        res.status(200).json({
            status: 'success',
            message: 'Payment verified successfully'
        });
    } else {
        return next(new AppError('Invalid payment signature', 400));
    }
});
