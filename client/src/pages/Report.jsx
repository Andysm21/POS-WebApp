import { useEffect, useState } from 'react'
import api from '../services/api'

function Report() {
  const [sales, setSales] = useState([])
  const [from, setFrom] = useState('')
  const [to, setTo] = useState('')
  const [summary, setSummary] = useState({ totalRevenue: 0, count: 0 })

  const fetchReport = async () => {
    try {
      const res = await api.get('/sales/report', { params: { from, to } })
      setSales(res.data.sales)
      setSummary({ totalRevenue: res.data.totalRevenue, count: res.data.count })
    } catch (err) {
      console.error(err)
    }
  }

  useEffect(() => {
    fetchReport()
  }, [])

  return (
    <div style={{ padding: '2rem' }}>
      <h2>Sales Report</h2>

      <div style={{ marginBottom: '1rem' }}>
        <label>From: <input type="date" value={from} onChange={e => setFrom(e.target.value)} /></label>
        <label>To: <input type="date" value={to} onChange={e => setTo(e.target.value)} /></label>
        <button onClick={fetchReport}>Filter</button>
      </div>

      <h3>Total Sales: {summary.count}</h3>
      <h3>Total Revenue: ${summary.totalRevenue.toFixed(2)}</h3>
      <div style={{ marginBottom: '1rem' }}>
        <button onClick={() => window.open('http://localhost:5000/export/csv', '_blank')}>Download CSV</button>
        <button onClick={() => window.open('http://localhost:5000/export/pdf', '_blank')}>Download PDF</button>
      </div>

      <table border="1" cellPadding="6">
        <thead>
          <tr>
            <th>ID</th>
            <th>Date</th>
            <th>Cashier</th>
            <th>Total</th>
            <th>Items</th>
          </tr>
        </thead>
        <tbody>
          {sales.map(sale => (
            <tr key={sale.id}>
              <td>{sale.id}</td>
              <td>{new Date(sale.createdAt).toLocaleString()}</td>
              <td>{sale.user?.name}</td>
              <td>${sale.total.toFixed(2)}</td>
              <td>
                {sale.items.map(i => (
                  <div key={i.id}>{i.product.name} × {i.quantity}</div>
                ))}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default Report
