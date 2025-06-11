import { PrismaClient } from '@prisma/client'
import { Parser } from 'json2csv'
import PDFDocument from 'pdfkit'
const prisma = new PrismaClient()

export const exportSalesCsv = async (req, res) => {
    const sales = await prisma.sale.findMany({
        include: {
            user: true,
            items: { include: { product: true } }
        },
        orderBy: { createdAt: 'desc' }
    })

    const rows = sales.flatMap(sale =>
        sale.items.map(item => ({
            saleId: sale.id,
            date: sale.createdAt.toISOString(),
            cashier: sale.user?.name,
            product: item.product.name,
            quantity: item.quantity,
            unitPrice: item.unitPrice,
            total: item.unitPrice * item.quantity
        }))
    )

    const parser = new Parser()
    const csv = parser.parse(rows)

    res.header('Content-Type', 'text/csv')
    res.attachment('sales-report.csv')
    res.send(csv)
}
export const exportSalesPdf = async (req, res) => {
    const sales = await prisma.sale.findMany({
        include: {
            user: true,
            items: { include: { product: true } }
        },
        orderBy: { createdAt: 'desc' }
    })

    const doc = new PDFDocument()
    res.setHeader('Content-Type', 'application/pdf')
    res.setHeader('Content-Disposition', 'attachment; filename="sales-report.pdf"')

    doc.fontSize(16).text('Sales Report', { align: 'center' })
    doc.moveDown()

    sales.forEach(sale => {
        doc.fontSize(12).text(`Sale ID: ${sale.id} | Date: ${sale.createdAt.toISOString().slice(0, 10)} | Cashier: ${sale.user?.name}`)
        sale.items.forEach(item => {
            doc.text(` - ${item.product.name} × ${item.quantity} @ $${item.unitPrice.toFixed(2)}`)
        })
        doc.text(`Total: $${sale.total.toFixed(2)}`).moveDown()
    })

    doc.end()
    doc.pipe(res)
}