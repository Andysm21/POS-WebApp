import express from 'express'
import { getAllUsers, createUser, deleteUser } from '../controllers/userController.js'
import { protect } from '../middleware/auth.js'

const router = express.Router()

router.get('/', protect(['admin']), getAllUsers)
router.post('/', protect(['admin']), createUser)
router.delete('/:id', protect(['admin']), deleteUser)

export default router
