import nodemailer from 'nodemailer'

export const sendStockAlert = async (productName, stock) => {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.ALERT_EMAIL,
      pass: process.env.ALERT_PASSWORD
    }
  })

  await transporter.sendMail({
    from: `"Church Canteen" <${process.env.ALERT_EMAIL}>`,
    to: process.env.ADMIN_EMAILS, // comma separated list
    subject: `Low Stock Alert: ${productName}`,
    text: `${productName} stock is low: only ${stock} left. Please restock soon.`
  })
}
