import { forwardRef } from 'react'

const Receipt = forwardRef(({ sale }, ref) => {
    if (!sale) return null

    const date = new Date(sale.createdAt).toLocaleString()
    return (
        <div ref={ref} className="receipt__container">
            <h3 className="receipt__title">📍 Church Canteen</h3>
            <hr />
            <p><strong>Sale ID:</strong> {sale.id}</p>
            <p><strong>Date:</strong> {date}</p>
            <p><strong>Cashier:</strong> {sale.user.name}</p>
            <hr />
            <table width="100%" className="receipt__table">
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
            {sale.discountAmount > 0 && (
                <p><strong>Discount:</strong> -${sale.discountAmount.toFixed(2)}</p>
            )}

            <p><strong>Total:</strong> ${sale.total.toFixed(2)}</p>
            {sale.paidAmount && (
                <>
                    <p><strong>Paid:</strong> ${sale.paidAmount.toFixed(2)}</p>
                    <p><strong>Change:</strong> ${(sale.paidAmount - sale.total).toFixed(2)}</p>
                </>
            )}
            <hr />
            <p className="receipt__thanks">🙏 Thank You & God Bless!</p>
            <style>{`
        .receipt__container {
          padding: 1rem;
          font-family: 'JetBrains Mono', 'Fira Mono', 'monospace';
          width: 320px;
          background: #fff;
          border-radius: 10px;
          box-shadow: 0 2px 12px #0001;
        }
        .receipt__title {
          text-align: center;
          font-size: 1.35rem;
          margin: 0.5rem 0 1rem 0;
        }
        .receipt__table td {
          font-size: 1rem;
          padding: 2px 0;
        }
        .receipt__thanks {
          text-align: center;
          font-size: 1.1rem;
          color: #3b7a1f;
        }
      `}</style>
        </div>
    )
})

Receipt.displayName = 'Receipt'
export default Receipt