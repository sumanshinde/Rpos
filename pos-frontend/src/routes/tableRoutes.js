import express from 'express';
import * as tableController from '../controllers/tableController.js';

const router = express.Router();

router
    .route('/')
    .get(tableController.getAllTables)
    .post(tableController.createTable);

router
    .route('/:id')
    .put(tableController.updateTable)
    .delete(tableController.deleteTable);

router.patch('/:id/status', tableController.updateTableStatus);

export default router;
