// import React from 'react'

// const ProductCard = React.memo(({ product, onAdd }) => (
//   <div
//     style={{
//       border: '1px solid #ccc',
//       padding: '1rem',
//       width: '150px',
//       textAlign: 'center',
//       cursor: 'pointer'
//     }}
//     onClick={() => onAdd(product)}
//   >
//     <h4>{product.name}</h4>
//     <p>${product.price.toFixed(2)}</p>
//     <button style={{ marginTop: '0.5rem' }}>Add</button>
//   </div>
// ))

// export default ProductCard


export default function ProductCard({ product, onAddToCart, isSelected }) {
    return (
      <button
        onClick={() => onAddToCart(product)}
        className={`
          relative w-full aspect-square rounded-xl border-2 transition-all duration-200 
          ${
            isSelected
              ? "border-green-500 bg-green-50 shadow-lg scale-105"
              : "border-gray-200 bg-white hover:border-green-300 hover:shadow-md"
          }
          active:scale-95 touch-manipulation
        `}
      >
        <div className="p-4 h-full flex flex-col justify-between">
          <div className="flex-1 flex items-center justify-center">
            {product.image ? (
              <img
                src={product.image || "/placeholder.svg"}
                alt={product.name}
                className="w-16 h-16 object-cover rounded-lg"
              />
            ) : (
              <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center">
                <span className="text-2xl">🍽️</span>
              </div>
            )}
          </div>
  
          <div className="text-center">
            <h3 className="font-semibold text-gray-900 text-sm mb-1 line-clamp-2">{product.name}</h3>
            <p className="text-lg font-bold text-green-600">{product.price.toFixed(2)} L.E.</p>
            {product.stock <= 5 && (
              <span className="inline-block mt-1 px-2 py-1 bg-red-100 text-red-600 text-xs rounded-full">
                Low Stock: {product.stock}
              </span>
            )}
          </div>
        </div>
      </button>
    )
  }