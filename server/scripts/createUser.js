import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

const createUser = async () => {
  const hashed = await bcrypt.hash('user123', 10)
  const user = await prisma.user.create({
    data: {
      name: 'user1',
      email: 'user1@church.com',
      password: hashed,
      role: 'user'
    }
  })
  console.log(user)
}

createUser().finally(() => prisma.$disconnect())
