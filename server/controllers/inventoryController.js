import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

export const adjustStock = async (req, res) => {
  const userId = req.user.id;
  const userRole = req.user.role;
  let { productId, change, reason } = req.body;
  productId = parseInt(productId);
  change = parseInt(change);


  if (!userId) {
    return res.status(400).json({ error: "Missing userId" });
  }

  try {
    const product = await prisma.product.update({
      where: { id: productId },
      data: { stock: { increment: change } }
    });

    await prisma.inventoryLog.create({
      data: {
        product: { connect: { id: productId } },
        user: { connect: { id: userId } }, // <-- REQUIRED
        change,
        reason
      }
    });

    res.status(200).json(product);
  } catch (err) {
    console.log("Request body:", req.body);
    console.error("Prisma error:", err);
    res.status(500).json({ error: err.message || err });
  }
}

export const getInventoryLogs = async (req, res) => {
  const logs = await prisma.inventoryLog.findMany({
    include: { product: true, user: true },
    orderBy: { createdAt: 'desc' }
  })
  res.json(logs)
}
