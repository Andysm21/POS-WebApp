import express from 'express'
import { getAllProducts, createProduct } from '../controllers/productController.js'
import { getLowStockProducts } from '../controllers/productController.js'

const router = express.Router()

router.get('/', getAllProducts)
router.post('/', createProduct)
router.get('/low-stock', getLowStockProducts)

export default router
