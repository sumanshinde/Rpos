import express from 'express';
import * as paymentController from '../controllers/paymentController.js';

const router = express.Router();

router.post('/create-order', paymentController.createOrder);
router.post('/verify', paymentController.verifyPayment);
router.post('/cash', paymentController.processCashPayment);
router.get('/invoice/:orderId', paymentController.getInvoice);

export default router;
