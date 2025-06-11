import express from 'express'
import { getAllCodes, createCode, toggleCode,deleteCode,reactivateCode } from '../controllers/discountCodeController.js'

const router = express.Router()

router.get('/', getAllCodes)
router.post('/', createCode)
router.patch('/:id/toggle', toggleCode)
router.patch('/:id/reactivate', reactivateCode)
router.delete('/:id', deleteCode)
export default router
