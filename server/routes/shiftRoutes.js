import express from 'express'
import { startShift, endShift, getActiveShift,getAllShifts } from '../controllers/shiftController.js'

const router = express.Router()

router.post('/start', startShift)
router.post('/end', endShift)
router.get('/active', getActiveShift)
router.get('/', getAllShifts)

export default router
