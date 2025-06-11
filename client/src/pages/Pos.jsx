import { useEffect, useState, useRef } from 'react'
import api from '../services/api'
import { useReactToPrint } from 'react-to-print'
import Receipt from './Receipt'
import ProductCard from '../components/ProductCard'


function Pos() {
    const [discount, setDiscount] = useState(0)
    const [discountCodes, setDiscountCodes] = useState([])
    const [selectedCode, setSelectedCode] = useState(null)
    const [discountAmount, setDiscountAmount] = useState(0)
    const [cart, setCart] = useState([])
    const [lastSale, setLastSale] = useState(null)
    const receiptRef = useRef()
    const [showCheckout, setShowCheckout] = useState(false)
    const [amountPaid, setAmountPaid] = useState('')
    const [changeDue, setChangeDue] = useState(null)
    const [isConfirming, setIsConfirming] = useState(false)
    const [activeShift, setActiveShift] = useState(null)
    const [openCash, setOpenCash] = useState('')
    const [closeCash, setCloseCash] = useState('')
    const [isKiosk, setIsKiosk] = useState(window.innerWidth < 800)
    const [view, setView] = useState('categories')
    const [activeCategory, setActiveCategory] = useState(null)
    const [categories, setCategories] = useState([])
    const [allProducts, setAllProducts] = useState([])
    const [visibleProducts, setVisibleProducts] = useState([])

    const handlePrint = useReactToPrint({
        content: () => receiptRef.current,
        onAfterPrint: () => setLastSale(null)
    })

    const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0)
    useEffect(() => {
        const handleResize = () => {
            setIsKiosk(window.innerWidth < 800)
        }
        window.addEventListener('resize', handleResize)
        return () => window.removeEventListener('resize', handleResize)
    }, [])
    useEffect(() => {
        api.get('/discount-codes').then(discountRes => {
            setDiscountCodes(discountRes.data.filter(dc => dc.active))
        })
        const load = async () => {
            const [catRes, prodRes] = await Promise.all([
                api.get('/categories'),
                api.get('/products')
            ])
            setCategories(catRes.data)
            setAllProducts(prodRes.data)
        }
        load()
    }, [])
    const goFullscreen = () => {
        const el = document.documentElement
        if (el.requestFullscreen) el.requestFullscreen()
    }
    useEffect(() => {
        const fetchShift = async () => {
            const res = await api.get('/shifts/active', { params: { userId: 1 } })
            setActiveShift(res.data)
        }
        fetchShift()
    }, [])

    const handleCategoryClick = (category) => {
        setVisibleProducts(
            allProducts.filter(p => p.categoryId === category.id && p.stock > 0)
        )
        setActiveCategory(category)
        setVisibleProducts(allProducts.filter(p => p.categoryId === category.id))
        setView('products')
    }

    const addToCart = (product) => {
        setCart(prev => {
            const exists = prev.find(item => item.id === product.id)
            if (exists) {
                return prev.map(item =>
                    item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
                )
            } else {
                return [...prev, { ...product, quantity: 1 }]
            }
        })
    }

    const updateQuantity = (productId, newQty) => {
        setCart(prev =>
            newQty <= 0
                ? prev.filter(item => item.id !== productId)
                : prev.map(item =>
                    item.id === productId ? { ...item, quantity: newQty } : item
                )
        )
    }
    return (
        <div className={`pos__container${isKiosk ? ' pos__container--kiosk' : ''}`}>
            {isKiosk && (
                <button className="pos__fullscreen-btn" onClick={goFullscreen}>⛶ Fullscreen</button>
            )}
            {!activeShift && (
                <div className="pos__shift">
                    <h3>Start Shift</h3>
                    <input
                        placeholder="Opening Cash"
                        value={openCash}
                        onChange={e => setOpenCash(e.target.value)}
                    />
                    <button
                        onClick={async () => {
                            const res = await api.post('/shifts/start', {
                                userId: 1,
                                openingCash: parseFloat(openCash)
                            })
                            setActiveShift(res.data)
                        }}
                    >
                        Start Shift
                    </button>
                </div>
            )}
            {activeShift && (
                <div className="pos__main">
                    {/* Product/Category Section */}
                    <div className="pos__products">
                        {view === 'categories' && (
                            <>
                                <h2>Select Category</h2>
                                <div className="pos__categories-list">
                                    {categories.map(cat => (
                                        <div
                                            key={cat.id}
                                            className="pos__category"
                                            onClick={() => handleCategoryClick(cat)}>
                                            <h4>{cat.name}</h4>
                                        </div>
                                    ))}
                                </div>
                            </>
                        )}
                        {view === 'products' && (
                            <>
                                <button className="pos__back-btn" onClick={() => setView('categories')}>← Back</button>
                                <h2>{activeCategory?.name}</h2>
                                <div className="pos__product-list">
                                    {visibleProducts.map(product => (
                                        <ProductCard
                                            key={product.id}
                                            product={product}
                                            onAddToCart={addToCart}
                                            isSelected={cart.some((item) => item.id === product.id)}
                                        />
                                    ))}
                                </div>
                            </>
                        )}
                    </div>
                    {/* Cart Section */}
                    <div className="pos__cart">
                        <h2>Cart</h2>
                        {cart.length === 0 && <p className="pos__cart-empty">No items in cart</p>}
                        {cart.map(item => (
                            <div key={item.id} className="pos__cart-item">
                                <div>
                                    <strong>{item.name}</strong><br />
                                    <small>${item.price.toFixed(2)} ×</small>
                                    <input
                                        type="number"
                                        min="0"
                                        className="pos__cart-qty"
                                        value={item.quantity}
                                        onChange={(e) => updateQuantity(item.id, parseInt(e.target.value))}
                                    />
                                </div>
                                <span>${(item.price * item.quantity).toFixed(2)}</span>
                            </div>
                        ))}
                        <hr />
                        <div>
                            <label>
                                Discount Code:
                                <select
                                    value={selectedCode || ''}
                                    onChange={e => {
                                        const code = e.target.value
                                        setSelectedCode(code)
                                        const found = discountCodes.find(d => d.code === code)
                                        const subtotal = cart.reduce((sum, i) => sum + i.price * i.quantity, 0)
                                        if (!found) {
                                            setDiscountAmount(0)
                                        } else if (found.type === 'percent') {
                                            setDiscountAmount((subtotal * found.value) / 100)
                                        } else {
                                            setDiscountAmount(found.value)
                                        }
                                    }}
                                >
                                    <option value="">No Discount</option>
                                    {discountCodes.map(code => (
                                        <option key={code.id} value={code.code}>
                                            {code.code} ({code.type === 'percent' ? `${code.value}%` : `$${code.value}`})
                                        </option>
                                    ))}
                                </select>
                            </label>
                        </div>
                        <p>Discount: ${discountAmount.toFixed(2)}</p>
                        <h3>Total After Discount: ${Math.max(0, total - discountAmount).toFixed(2)}</h3>
                        <button
                            className="pos__checkout-btn"
                            disabled={cart.length === 0}
                            onClick={() => {
                                setShowCheckout(true)
                                setAmountPaid('')
                                setChangeDue(null)
                            }}
                        >
                            Checkout
                        </button>
                        {!isKiosk && (
                            <div className="pos__shift-summary">
                                <p><strong>Shift ID:</strong> {activeShift.id}</p>
                                <p><strong>Opened At:</strong> {new Date(activeShift.openedAt).toLocaleString()}</p>
                                <input
                                    placeholder="Closing Cash"
                                    value={closeCash}
                                    onChange={(e) => setCloseCash(e.target.value)}
                                />
                                <button
                                    onClick={async () => {
                                        try {
                                            const res = await api.post('/shifts/end', {
                                                shiftId: activeShift.id,
                                                closingCash: parseFloat(closeCash),
                                                notes: ''
                                            })
                                            alert(`✅ Shift Closed
    
    🧾 Total Sales: $${res.data.totalSales.toFixed(2)}
    💰 Expected Cash: $${res.data.expectedCash.toFixed(2)}
    📦 Actual Cash: $${parseFloat(closeCash).toFixed(2)}
    🔍 Discrepancy: $${res.data.discrepancy.toFixed(2)}
    `)
                                            setActiveShift(null)
                                            setCloseCash('')
                                        } catch (err) {
                                            console.error(err)
                                            alert('❌ Failed to end shift. Please try again.')
                                        }
                                    }}
                                >
                                    End Shift
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            )}
            {/* Hidden Receipt for Printing */}
            <div style={{ position: 'absolute', left: '-9999px', top: 0 }}>
                <Receipt ref={receiptRef} sale={lastSale} />
            </div>
            {/* Printable Receipt Preview */}
            {lastSale && (
                <div className="pos__receipt-preview">
                    <Receipt sale={lastSale} />
                    <div className="pos__receipt-actions">
                        <button onClick={handlePrint}>🖨 Print Receipt</button>
                        <button onClick={() => setLastSale(null)}>Close</button>
                    </div>
                </div>
            )}
            {/* Checkout Modal */}
            {showCheckout && (
                <div className="pos__modal-overlay">
                    <div className="pos__modal">
                        <h3>Total Due: ${Math.max(0,total.toFixed(2)- discountAmount)}</h3>
                        <label>
                            Customer Paid:
                            <input
                                type="number"
                                value={amountPaid}
                                onChange={(e) => {
                                    const val = parseFloat(e.target.value || '0')
                                    setAmountPaid(val)
                                    setChangeDue(val - Math.max(0, total - discountAmount))
                                }}
                                autoFocus
                            />
                        </label>
                        {changeDue !== null && (
                            <p>
                                Change to Return: {changeDue < 0 ? 'Not enough' : `$${changeDue.toFixed(2)}`}
                            </p>
                        )}
                        <div className="pos__modal-actions">
                            <button onClick={() => setShowCheckout(false)}>Cancel</button>
                            <button
                                disabled={changeDue < 0}
                                onClick={async () => {
                                    setIsConfirming(true)
                                    try {
                                        const res = await api.post('/sales', {
                                            userId: 1,
                                            items: cart.map(({ id, quantity, price }) => ({ id, quantity, price })),
                                            paidAmount: parseFloat(amountPaid),
                                            change: parseFloat(changeDue),
                                            discountAmount,
                                            discountCode: selectedCode || null
                                          })
                                        const receipt = await api.get(`/sales/${res.data.id}/receipt`)
                                        setLastSale(receipt.data)
                                        setCart([])
                                        setAmountPaid('')
                                        setChangeDue(null)
                                        setShowCheckout(false)
                                        const updated = await api.get('/products')
                                        setAllProducts(updated.data)
                                    } catch (err) {
                                        alert('Sale failed.')
                                        console.error(err)
                                    } finally {
                                        setIsConfirming(false)
                                    }
                                }}
                            >
                                {isConfirming ? 'Saving...' : 'Confirm & Print'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
            <style>{`
            .pos__container {
              display: flex;
              flex-direction: row;
              padding: 2rem;
              gap: 2rem;
              font-size: 1rem;
              background: #f2f6fa;
              min-height: 100vh;
            }
            .pos__container--kiosk {
              flex-direction: column;
              padding: 1rem;
              font-size: 1.28rem;
            }
            .pos__fullscreen-btn {
              position: fixed;
              top: 10px;
              right: 10px;
              background: #fff;
              border: 1px solid #ddd;
              padding: 0.4rem 1rem;
              border-radius: 8px;
              font-size: 1.1rem;
              cursor: pointer;
              z-index: 10;
              box-shadow: 0 2px 8px #0001;
            }
            .pos__main {
              display: flex;
              width: 100%;
              gap: 2rem;
            }
            .pos__products {
              flex: 2;
              padding-right: 2rem;
            }
            .pos__categories-list {
              display: flex;
              flex-wrap: wrap;
              gap: 1rem;
            }
            .pos__category {
              border: 1.5px solid #bbb;
              border-radius: 8px;
              padding: 1.2rem;
              width: 160px;
              text-align: center;
              cursor: pointer;
              background: #fff;
              transition: box-shadow .2s, border .2s;
              box-shadow: 0 1px 6px #0001;
            }
            .pos__category:hover {
              border: 1.5px solid #3d87ff;
              box-shadow: 0 2px 12px #3d87ff40;
            }
            .pos__back-btn {
              margin-bottom: 1rem;
              background: none;
              border: none;
              font-size: 1.1rem;
              color: #4e8cff;
              cursor: pointer;
            }
            .pos__product-list {
              display: flex;
              flex-wrap: wrap;
              gap: 1rem;
            }
            .pos__cart {
              flex: 1;
              background: #fff;
              border-radius: 12px;
              padding: 1.5rem;
              box-shadow: 0 2px 16px #0001;
              min-width: 300px;
            }
            .pos__cart-empty {
              color: #aaa;
              text-align: center;
            }
            .pos__cart-item {
              display: flex;
              justify-content: space-between;
              align-items: center;
              margin-bottom: 0.7rem;
              gap: 1rem;
            }
            .pos__cart-qty {
              width: 50px;
              margin-left: 6px;
            }
            .pos__checkout-btn {
              width: 100%;
              margin-top: 1rem;
              background: #4e8cff;
              color: #fff;
              border: none;
              border-radius: 8px;
              padding: 0.8rem 0;
              font-size: 1.08rem;
              font-weight: bold;
              cursor: pointer;
              transition: background .18s;
            }
            .pos__checkout-btn:disabled {
              background: #b1c9f6;
              cursor: not-allowed;
            }
            .pos__shift-summary {
              margin-top: 2rem;
            }
            .pos__receipt-preview {
              position: fixed;
              right: 20px;
              bottom: 20px;
              background: #fff;
              padding: 20px;
              border-radius: 12px;
              box-shadow: 0 2px 16px #0002;
              z-index: 2000;
            }
            .pos__receipt-actions {
              display: flex;
              gap: 12px;
              margin-top: 13px;
            }
            .pos__modal-overlay {
              position: fixed;
              top: 0; left: 0; right: 0; bottom: 0;
              background: rgba(0,0,0,0.6);
              display: flex;
              justify-content: center;
              align-items: center;
              z-index: 1000;
            }
            .pos__modal {
              background: #fff;
              padding: 2rem;
              width: 340px;
              border-radius: 12px;
              box-shadow: 0 2px 16px #0001;
            }
            .pos__modal-actions {
              display: flex;
              justify-content: space-between;
              margin-top: 1.5rem;
            }
          `}</style>
        </div>
    )
}

export default Pos
