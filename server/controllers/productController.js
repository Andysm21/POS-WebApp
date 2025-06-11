import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

export const getAllProducts = async (req, res) => {
  const products = await prisma.product.findMany({ include: { category: true } })
  res.json(products)
}

export const createProduct = async (req, res) => {
  const { name, price, stock, categoryId } = req.body
  const product = await prisma.product.create({
    data: { name, price, stock, categoryId }
  })
  res.status(201).json(product)
}
export const getLowStockProducts = async (req, res) => {
  const threshold = parseInt(req.query.threshold || '5') // default: 5 units
  const products = await prisma.product.findMany({
    where: { stock: { lt: threshold } },
    include: { category: true }
  })
  res.json(products)
}
