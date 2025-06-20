import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import { PrismaClient } from '@prisma/client'
import productRoutes from './routes/productRoutes.js'
import saleRoutes from './routes/saleRoutes.js'
import categoryRoutes from './routes/categoryRoutes.js'
import authRoutes from './routes/authRoutes.js'
import exportRoutes from './routes/exportRoutes.js'
import inventoryRoutes from './routes/inventoryRoutes.js'
import userRoutes from './routes/userRoutes.js'
import shiftRoutes from './routes/shiftRoutes.js'
import dashboardRoutes from './routes/dashboardRoutes.js'
import discountCodeRoutes from './routes/discountCodeRoutes.js'
const allowedOrigins = [
  'http://localhost:5000', // for local dev
  'https://pos-web-51wg7assr-epicmc2000-gmailcoms-projects.vercel.app',
  'https://pos-web-app-three.vercel.app'// replace with actual Vercel domain
]
dotenv.config()
const prisma = new PrismaClient()
const app = express()

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true)
    } else {
      callback(new Error('Not allowed by CORS'))
    }
  },
  credentials: true
}))
app.use(express.json())

app.get('/', (req, res) => {
  res.send('Canteen API is running')
})
app.use('/auth', authRoutes)
app.use('/products', productRoutes)
app.use('/sales', saleRoutes)
app.use('/categories', categoryRoutes)
app.use('/export', exportRoutes)
app.use('/inventory', inventoryRoutes)
app.use('/users', userRoutes)
app.use('/shifts', shiftRoutes)
app.use('/dashboard', dashboardRoutes)
app.use('/discount-codes', discountCodeRoutes)
app.listen(process.env.PORT, () => {
  console.log(`Server running on http://localhost:${process.env.PORT}`)
})
