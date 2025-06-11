import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

export const getAllUsers = async (req, res) => {
  const users = await prisma.user.findMany({
    select: { id: true, name: true, email: true, role: true }
  })
  res.json(users)
}

export const createUser = async (req, res) => {
  const { name, email, password, role } = req.body
  const existing = await prisma.user.findUnique({ where: { email } })
  if (existing) return res.status(400).json({ error: 'Email already used' })

  const hash = await bcrypt.hash(password, 10)
  const user = await prisma.user.create({
    data: { name, email, password: hash, role }
  })
  res.status(201).json({ id: user.id, name: user.name, role: user.role })
}

export const deleteUser = async (req, res) => {
  const id = parseInt(req.params.id)
  await prisma.user.delete({ where: { id } })
  res.status(204).send()
}
