import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

export const startShift = async (req, res) => {
  const { userId, openingCash } = req.body

  const activeShift = await prisma.shift.findFirst({
    where: { userId, closedAt: null }
  })
  if (activeShift) return res.status(400).json({ error: 'Shift already open' })

  const shift = await prisma.shift.create({
    data: { userId, openingCash }
  })
  res.status(201).json(shift)
}

  
export const endShift = async (req, res) => {
    const { shiftId, closingCash, notes = '' } = req.body
  
    const shift = await prisma.shift.findUnique({
      where: { id: shiftId },
      include: {
        sales: true
      }
    })
  
    const totalSales = shift.sales.reduce((sum, s) => sum + s.total, 0)
    const expectedCash = shift.openingCash + totalSales
    const discrepancy = closingCash - expectedCash
  
    const updated = await prisma.shift.update({
      where: { id: shiftId },
      data: {
        closedAt: new Date(),
        closingCash,
        expectedCash,
        discrepancy,
        notes
      }
    })
  
    res.json({
      message: 'Shift closed',
      totalSales,
      expectedCash,
      discrepancy,
      shift: updated
    })
  }
  

export const getActiveShift = async (req, res) => {
  const { userId } = req.query
  const shift = await prisma.shift.findFirst({
    where: { userId: parseInt(userId), closedAt: null }
  })
  res.json(shift)
}

export const getAllShifts = async (req, res) => {
    const shifts = await prisma.shift.findMany({
      include: {
        user: true,
        sales: true
      },
      orderBy: {
        openedAt: 'desc'
      }
    })
  
    const formatted = shifts.map(shift => {
      const totalSales = shift.sales.reduce((sum, s) => sum + s.total, 0)
      return {
        id: shift.id,
        user: shift.user.name,
        openedAt: shift.openedAt,
        closedAt: shift.closedAt,
        openingCash: shift.openingCash,
        closingCash: shift.closingCash,
        expectedCash: shift.expectedCash,
        discrepancy: shift.discrepancy,
        totalSales,
        notes: shift.notes
      }
    })
  
    res.json(formatted)
  }
