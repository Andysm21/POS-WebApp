import express from 'express'
import { exportSalesCsv, exportSalesPdf } from '../controllers/exportController.js'

const router = express.Router()

router.get('/csv', exportSalesCsv)
router.get('/pdf', exportSalesPdf)

export default router