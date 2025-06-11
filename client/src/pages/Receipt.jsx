import { forwardRef } from 'react'

const Receipt = forwardRef(({ sale }, ref) => {
    if (!sale) return null
    
    const date = new Date(sale.createdAt).toLocaleString()
    return (
        <div ref={ref} style={{ padding: '1rem', fontFamily: 'monospace', width: '300px' }}>
            <h3 style={{ textAlign: 'center' }}>📍 Church Canteen</h3>
            <hr />
            <p><strong>Sale ID:</strong> {sale.id}</p>
            <p><strong>Date:</strong> {date}</p>
            <p><strong>Cashier:</strong> {sale.user.name}</p>
            <hr />
            <table width="100%">
                <tbody>
                    {sale.items.map(i => (
                        <tr key={i.id}>
                            <td>{i.product.name} x{i.quantity}</td>
                            <td style={{ textAlign: 'right' }}>
                                ${(i.quantity * i.unitPrice).toFixed(2)}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <hr />
            <p><strong>Total:</strong> ${sale.total.toFixed(2)}</p>
            {sale.paidAmount && (
                <>
                    <p><strong>Paid:</strong> ${sale.paidAmount.toFixed(2)}</p>
                    <p><strong>Change:</strong> ${(sale.paidAmount - sale.total).toFixed(2)}</p>
                </>
            )}
            <hr />
            <p style={{ textAlign: 'center' }}>🙏 Thank You & God Bless!</p>
        </div>
    )
})

Receipt.displayName = 'Receipt'

export default Receipt
