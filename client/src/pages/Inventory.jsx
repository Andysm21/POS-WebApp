import { useEffect, useState } from 'react'
import api from '../services/api'

function Inventory() {
    const [lowStock, setLowStock] = useState([])
    const [logs, setLogs] = useState([])
    const [products, setProducts] = useState([])
    const [adjustForm, setAdjustForm] = useState({ productId: '', change: 0, reason: '' })

    const fetchData = async () => {
        const [low, logData, productsData] = await Promise.all([
            api.get('/products/low-stock'),
            api.get('/inventory/logs'),
            api.get('/products')
        ])
        setLowStock(low.data)
        setLogs(logData.data)
        setProducts(productsData.data)
    }

    const adjustStock = async () => {
        await api.post('/inventory/adjust', adjustForm)
        setAdjustForm({ productId: '', change: 0, reason: '' })
        fetchData()
    }

    useEffect(() => { fetchData() }, [])

    return (
        <div>
            <h1 style={{ marginBottom: '2rem' }}>Inventory Management</h1>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
                <div style={{ 
                    backgroundColor: 'white', 
                    padding: '1.5rem',
                    borderRadius: '8px',
                    boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                }}>
                    <h2 style={{ marginBottom: '1rem' }}>Low Stock Alerts</h2>
                    <div style={{ 
                        backgroundColor: '#fff8f8', 
                        padding: '1rem',
                        borderRadius: '4px',
                        border: '1px solid #ffcdd2'
                    }}>
                        {lowStock.map(p => (
                            <div 
                                key={p.id} 
                                style={{ 
                                    padding: '0.5rem',
                                    borderBottom: '1px solid #ffe0e3',
                                    display: 'flex',
                                    justifyContent: 'space-between'
                                }}
                            >
                                <span>{p.name}</span>
                                <span style={{ color: '#d32f2f' }}>{p.stock} left</span>
                            </div>
                        ))}
                        {lowStock.length === 0 && (
                            <p style={{ textAlign: 'center', color: '#666' }}>No low stock items</p>
                        )}
                    </div>
                </div>

                <div style={{ 
                    backgroundColor: 'white', 
                    padding: '1.5rem',
                    borderRadius: '8px',
                    boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                }}>
                    <h2 style={{ marginBottom: '1rem' }}>Stock Adjustment</h2>
                    <div style={{ display: 'grid', gap: '1rem' }}>
                        <select 
                            value={adjustForm.productId} 
                            onChange={e => setAdjustForm({ ...adjustForm, productId: e.target.value })}
                            style={{
                                padding: '0.5rem',
                                borderRadius: '4px',
                                border: '1px solid #ddd'
                            }}
                        >
                            <option value="">Select a product</option>
                            {products.map(product => (
                                <option key={product.id} value={product.id}>
                                    {product.name}
                                </option>
                            ))}
                        </select>
                        <input 
                            type="number" 
                            placeholder="Change" 
                            value={adjustForm.change}
                            onChange={e => setAdjustForm({ ...adjustForm, change: +e.target.value })} 
                            style={{
                                padding: '0.5rem',
                                borderRadius: '4px',
                                border: '1px solid #ddd'
                            }}
                        />
                        <input 
                            placeholder="Reason" 
                            value={adjustForm.reason}
                            onChange={e => setAdjustForm({ ...adjustForm, reason: e.target.value })} 
                            style={{
                                padding: '0.5rem',
                                borderRadius: '4px',
                                border: '1px solid #ddd'
                            }}
                        />
                        <button 
                            onClick={adjustStock}
                            style={{
                                padding: '0.75rem',
                                backgroundColor: '#4caf50',
                                color: 'white',
                                border: 'none',
                                borderRadius: '4px',
                                cursor: 'pointer',
                                fontWeight: 'bold'
                            }}
                        >
                            Submit Adjustment
                        </button>
                    </div>
                </div>
            </div>

            <div style={{ 
                marginTop: '2rem',
                backgroundColor: 'white', 
                padding: '1.5rem',
                borderRadius: '8px',
                boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
            }}>
                <h2 style={{ marginBottom: '1rem' }}>Inventory Log</h2>
                <div style={{ overflowX: 'auto' }}>
                    <table style={{ 
                        width: '100%', 
                        borderCollapse: 'collapse',
                        fontSize: '0.9rem'
                    }}>
                        <thead>
                            <tr style={{ backgroundColor: '#f5f5f5' }}>
                                <th style={tableHeaderStyle}>Date</th>
                                <th style={tableHeaderStyle}>Product</th>
                                <th style={tableHeaderStyle}>Change</th>
                                <th style={tableHeaderStyle}>Reason</th>
                                <th style={tableHeaderStyle}>User</th>
                            </tr>
                        </thead>
                        <tbody>
                            {logs.map(log => (
                                <tr key={log.id} style={{ borderBottom: '1px solid #eee' }}>
                                    <td style={tableCellStyle}>{new Date(log.createdAt).toLocaleString()}</td>
                                    <td style={tableCellStyle}>{log.product.name}</td>
                                    <td style={{
                                        ...tableCellStyle,
                                        color: log.change > 0 ? '#4caf50' : '#d32f2f'
                                    }}>{log.change}</td>
                                    <td style={tableCellStyle}>{log.reason}</td>
                                    <td style={tableCellStyle}>{log.user?.name}</td>
                                </tr>
                            ))}
                            {logs.length === 0 && (
                                <tr>
                                    <td colSpan="5" style={{ ...tableCellStyle, textAlign: 'center' }}>
                                        No inventory logs found
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}

const tableHeaderStyle = {
    padding: '1rem',
    textAlign: 'left',
    fontWeight: 'bold',
    borderBottom: '2px solid #ddd'
}

const tableCellStyle = {
    padding: '1rem',
    textAlign: 'left'
}

export default Inventory
