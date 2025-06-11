import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

export const getDashboardStats = async (req, res) => {
  const now = new Date()
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate())

  const [todaySales, totalProducts, lowStock] = await Promise.all([
    prisma.sale.aggregate({
      _sum: { total: true },
      where: { createdAt: { gte: todayStart } }
    }),
    prisma.product.count(),
    prisma.product.findMany({ where: { stock: { lt: 5 } } })
  ])

  res.json({
    totalToday: todaySales._sum.total || 0,
    totalProducts,
    lowStockCount: lowStock.length,
    lowStockList: lowStock
  })
}
