export default function Receipt({ order, customer, cashier, timestamp }) {
    const subtotal = order.items.reduce((sum, item) => sum + item.price * item.quantity, 0)
    const tax = subtotal * 0.12 // 12% VAT
    const total = subtotal + tax
  
    return (
      <div className="max-w-sm mx-auto bg-white p-4 font-mono text-sm print:shadow-none">
        {/* Header */}
        <div className="text-center border-b-2 border-dashed border-gray-300 pb-4 mb-4">
          <h1 className="text-lg font-bold">CHURCH CANTEEN</h1>
          <p className="text-xs text-gray-600">123 Church Street</p>
          <p className="text-xs text-gray-600">Tel: (02) 123-4567</p>
          <p className="text-xs text-gray-600">TIN: 123-456-789-000</p>
        </div>
  
        {/* Order Details */}
        <div className="mb-4">
          <div className="flex justify-between text-xs mb-1">
            <span>Receipt #:</span>
            <span>{order.id}</span>
          </div>
          <div className="flex justify-between text-xs mb-1">
            <span>Date:</span>
            <span>{new Date(timestamp).toLocaleString()}</span>
          </div>
          <div className="flex justify-between text-xs mb-1">
            <span>Cashier:</span>
            <span>{cashier}</span>
          </div>
          {customer && (
            <div className="flex justify-between text-xs">
              <span>Customer:</span>
              <span>{customer}</span>
            </div>
          )}
        </div>
  
        {/* Items */}
        <div className="border-b-2 border-dashed border-gray-300 pb-4 mb-4">
          {order.items.map((item, index) => (
            <div key={index} className="mb-2">
              <div className="flex justify-between">
                <span className="flex-1">{item.name}</span>
                <span>₱{item.price.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-xs text-gray-600">
                <span>
                  {" "}
                  {item.quantity} x ₱{item.price.toFixed(2)}
                </span>
                <span>₱{(item.price * item.quantity).toFixed(2)}</span>
              </div>
            </div>
          ))}
        </div>
  
        {/* Totals */}
        <div className="mb-4">
          <div className="flex justify-between mb-1">
            <span>Subtotal:</span>
            <span>₱{subtotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between mb-1">
            <span>VAT (12%):</span>
            <span>₱{tax.toFixed(2)}</span>
          </div>
          <div className="flex justify-between font-bold text-lg border-t pt-2">
            <span>TOTAL:</span>
            <span>₱{total.toFixed(2)}</span>
          </div>
        </div>
  
        {/* Footer */}
        <div className="text-center text-xs text-gray-600 border-t-2 border-dashed border-gray-300 pt-4">
          <p>Thank you for your purchase!</p>
          <p>God bless!</p>
          <p className="mt-2">This serves as your official receipt</p>
        </div>
      </div>
    )
  }
  