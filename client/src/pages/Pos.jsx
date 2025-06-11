import { useEffect, useState, useRef } from 'react'
import api from '../services/api'
import { useReactToPrint } from 'react-to-print'
import Receipt from './Receipt'
import ProductCard from '../components/ProductCard'


function Pos() {
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
        <div style={{
            display: 'flex',
            flexDirection: isKiosk ? 'column' : 'row',
            padding: isKiosk ? '1rem' : '2rem',
            fontSize: isKiosk ? '1.5rem' : '1rem'
          }}>
                        {isKiosk && (
                <button onClick={goFullscreen} style={{ position: 'fixed', top: 10, right: 10 }}>⛶ Fullscreen</button>
            )}
            {!activeShift && (
                <div>
                    <h3>Start Shift</h3>
                    <input
                        placeholder="Opening Cash"
                        value={openCash}
                        onChange={(e) => setOpenCash(e.target.value)}
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
                <div style={{ display: 'flex', width: '100%' }}>
                    {/* Product/Category Section */}
                    <div style={{ flex: 2, paddingRight: '2rem' }}>
                        {view === 'categories' && (
                            <>
                                <h2>Select Category</h2>
                                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem' }}>
                                    {categories.map(cat => (
                                        <div
                                            key={cat.id}
                                            onClick={() => handleCategoryClick(cat)}
                                            style={{
                                                border: '1px solid #ccc',
                                                padding: '1rem',
                                                width: '150px',
                                                textAlign: 'center',
                                                cursor: 'pointer'
                                            }}
                                        >
                                            <h4>{cat.name}</h4>
                                        </div>
                                    ))}
                                </div>
                            </>
                        )}

                        {view === 'products' && (
                            <>
                                <button onClick={() => setView('categories')}>← Back</button>
                                <h2>{activeCategory?.name}</h2>
                                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem' }}>
                                {visibleProducts.map(product => (
//   <ProductCard key={product.id} product={product} onAdd={addToCart} />
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
                    <div style={{ flex: 1 }}>
                        <h2>Cart</h2>
                        {cart.length === 0 && <p>No items in cart</p>}
                        {cart.map(item => (
                            <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                                <div>
                                    <strong>{item.name}</strong><br />
                                    <small>${item.price.toFixed(2)} ×</small>
                                    <input
                                        type="number"
                                        min="0"
                                        style={{ width: '50px', marginLeft: '5px' }}
                                        value={item.quantity}
                                        onChange={(e) => updateQuantity(item.id, parseInt(e.target.value))}
                                    />
                                </div>
                                <span>${(item.price * item.quantity).toFixed(2)}</span>
                            </div>
                        ))}
                        <hr />
                        <h3>Total: ${total.toFixed(2)}</h3>
                        <button
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
                            <div style={{ marginTop: '2rem' }}>
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
                <div style={{
                    position: 'fixed', right: 20, bottom: 20,
                    background: '#fff', padding: 20, borderRadius: 8,
                    boxShadow: '0 2px 8px #0002', zIndex: 2000
                }}>
                    <Receipt sale={lastSale} />
                    <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
                        <button onClick={handlePrint}>🖨 Print Receipt</button>
                        <button onClick={() => setLastSale(null)}>Close</button>
                    </div>
                </div>
            )}

            {/* Checkout Modal */}
            {showCheckout && (
                <div style={{
                    position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
                    background: 'rgba(0,0,0,0.6)', display: 'flex',
                    justifyContent: 'center', alignItems: 'center', zIndex: 1000
                }}>
                    <div style={{ background: '#fff', padding: '2rem', width: '300px', borderRadius: '8px' }}>
                        <h3>Total Due: ${total.toFixed(2)}</h3>
                        <label>
                            Customer Paid:
                            <input
                                type="number"
                                value={amountPaid}
                                onChange={(e) => {
                                    const val = parseFloat(e.target.value || '0')
                                    setAmountPaid(val)
                                    setChangeDue(val - total)
                                }}
                                autoFocus
                            />
                        </label>
                        {changeDue !== null && (
                            <p>Change to Return: ${changeDue < 0 ? 'Not enough' : changeDue.toFixed(2)}</p>
                        )}
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '1rem' }}>
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
                                            change: parseFloat(changeDue)
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
        </div>
    )
}

export default Pos
