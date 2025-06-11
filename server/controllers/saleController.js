import { PrismaClient } from '@prisma/client'
import { sendStockAlert } from '../utils/notification.js'

const prisma = new PrismaClient()

export const createSale = async (req, res) => {
  const { userId, items, paidAmount = null, change = null, discountAmount = 0, discountCode = null } = req.body
  const baseTotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const total = Math.max(0, baseTotal - discountAmount)
  let discountCodeId = null
  if (discountCode) {
    const existingCode = await prisma.discountCode.findUnique({
      where: { code: discountCode }
    })
  
    if (existingCode) {
      discountCodeId = existingCode.id
    }
  }
  if (discountCode && !discountCodeId) {
    return res.status(400).json({ error: 'Invalid discount code' })
  }
  const activeShift = await prisma.shift.findFirst({
    where: { userId, closedAt: null }
  })
  
  try {
    const sale = await prisma.sale.create({
      data: {
        total,
        discountAmount,
        discountCodeId,
        userId,
        paidAmount,
        change,
        shiftId: activeShift?.id || null,
        items: {
          create: items.map(item => ({
            productId: item.id,
            quantity: item.quantity,
            unitPrice: item.price
          }))
        }
      },
      include: { items: true }
    })
    


    await Promise.all(items.map(async item => {
      const updated = await prisma.product.update({
        where: { id: item.id },
        data: { stock: { decrement: item.quantity } }
      })

      await prisma.inventoryLog.create({
        data: {
          productId: item.id,
          change: -item.quantity,
          reason: 'sale',
          userId
        }
      })
      // if (updated.stock <= 5) {
      //   await sendStockAlert(updated.name, updated.stock)
      // }
    }))

    res.status(201).json(sale)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Could not complete sale' })
  }

  
}
export const getSalesReport = async (req, res) => {
  const { from, to } = req.query
  const filters = {}

  if (from && to) {
    filters.createdAt = {
      gte: new Date(from),
      lte: new Date(to)
    }
  }

  try {
    const sales = await prisma.sale.findMany({
      where: filters,
      include: {
        user: true,
        items: {
          include: {
            product: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    })

    const totalRevenue = sales.reduce((sum, sale) => sum + sale.total, 0)

    res.json({ totalRevenue, count: sales.length, sales })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Failed to fetch report' })
  }
}
export const getReceiptData = async (req, res) => {
  const id = parseInt(req.params.id)

  const sale = await prisma.sale.findUnique({
    where: { id },
    include: {
      user: true,
      items: { include: { product: true } }
    }
  })

  if (!sale) return res.status(404).json({ error: 'Sale not found' })
  res.json(sale)
}
