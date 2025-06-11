import express from 'express';
import { protect } from '../middleware/auth.js';
import { adjustStock, getInventoryLogs } from '../controllers/inventoryController.js';

const router = express.Router();

router.post('/adjust', protect(), adjustStock);
router.get('/logs', protect(), getInventoryLogs);

export default router;