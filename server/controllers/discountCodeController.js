import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

export const getAllCodes = async (req, res) => {
  const codes = await prisma.discountCode.findMany({ orderBy: { createdAt: 'desc' } })
  res.json(codes)
}

export const createCode = async (req, res) => {
  const { code, type, value } = req.body
  const numericValue = parseFloat(value)

  const newCode = await prisma.discountCode.create({
    data: {
      code: code.toUpperCase(),
      type,
      value: numericValue
    }
  })
  res.status(201).json(newCode)
}
export const reactivateCode = async (req, res) => {
    const { id } = req.params
    const code = await prisma.discountCode.update({
      where: { id: parseInt(id) },
      data: { active: true }
    })
    res.json(code)
  }
  
  export const deleteCode = async (req, res) => {
    const { id } = req.params
    await prisma.discountCode.delete({
      where: { id: parseInt(id) }
    })
    res.status(204).send()
  }
export const toggleCode = async (req, res) => {
  const { id } = req.params
  const code = await prisma.discountCode.update({
    where: { id: parseInt(id) },
    data: { active: { set: false } }
  })
  res.json(code)
}
