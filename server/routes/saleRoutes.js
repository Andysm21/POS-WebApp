import express from 'express'
import { createSale } from '../controllers/saleController.js'
import { getSalesReport } from '../controllers/saleController.js'
import { getReceiptData } from '../controllers/saleController.js'

const router = express.Router()

router.get('/report', getSalesReport)

router.post('/', createSale)
router.get('/:id/receipt', getReceiptData)

export default router
