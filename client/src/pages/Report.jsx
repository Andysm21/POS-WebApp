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
    <div className="report__container">
      <h2 className="report__title">Sales Report</h2>
      <div className="report__filters">
        <label>
          From:
          <input type="date" value={from} onChange={e => setFrom(e.target.value)} />
        </label>
        <label>
          To:
          <input type="date" value={to} onChange={e => setTo(e.target.value)} />
        </label>
        <button className="report__filter-btn" onClick={fetchReport}>Filter</button>
      </div>
      <div className="report__summary">
        <div>
          <h3>Total Sales</h3>
          <span>{summary.count}</span>
        </div>
        <div>
          <h3>Total Revenue</h3>
          <span>${summary.totalRevenue.toFixed(2)}</span>
        </div>
      </div>
      <div className="report__downloads">
        <button onClick={() => window.open('http://localhost:5000/export/csv', '_blank')}>Download CSV</button>
        <button onClick={() => window.open('http://localhost:5000/export/pdf', '_blank')}>Download PDF</button>
      </div>
      <div className="report__table-wrapper">
        <table className="report__table">
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
      <style>{`
        .report__container {
          max-width: 900px;
          margin: 2rem auto;
          padding: 2.5rem 2rem;
          background: #fff;
          border-radius: 14px;
          box-shadow: 0 2px 16px #0002;
        }
        .report__title {
          text-align: center;
          margin-bottom: 2rem;
        }
        .report__filters {
          display: flex;
          gap: 1.5rem;
          margin-bottom: 1.2rem;
          flex-wrap: wrap;
        }
        .report__filters label {
          font-size: 1.09rem;
          color: #555;
          display: flex;
          flex-direction: column;
        }
        .report__filters input[type="date"] {
          margin-top: 0.2rem;
          padding: 0.4rem 0.7rem;
          border-radius: 6px;
          border: 1.2px solid #d2d9e6;
        }
        .report__filter-btn {
          background: #4e8cff;
          color: #fff;
          border: none;
          border-radius: 6px;
          padding: 0.6rem 1.3rem;
          font-size: 1rem;
          font-weight: 500;
          cursor: pointer;
          transition: background .18s;
        }
        .report__filter-btn:hover {
          background: #2567c6;
        }
        .report__summary {
          display: flex;
          gap: 2.5rem;
          margin-bottom: 1.2rem;
        }
        .report__summary div {
          background: #f6fafd;
          border-radius: 8px;
          padding: 1.2rem 2rem;
          text-align: center;
          flex: 1;
        }
        .report__summary h3 {
          margin-bottom: 0.5rem;
          font-size: 1.1rem;
          color: #666;
        }
        .report__summary span {
          font-size: 1.28rem;
          font-weight: bold;
        }
        .report__downloads {
          margin-bottom: 1.2rem;
          display: flex;
          gap: 1rem;
        }
        .report__downloads button {
          background: #eee;
          color: #444;
          border: none;
          border-radius: 6px;
          padding: 0.5rem 1.2rem;
          font-size: 1rem;
          cursor: pointer;
          transition: background .15s;
        }
        .report__downloads button:hover {
          background: #d8e3fa;
        }
        .report__table-wrapper {
          overflow-x: auto;
        }
        .report__table {
          width: 100%;
          border-collapse: collapse;
          font-size: 1rem;
          background: #fafcff;
        }
        .report__table th, .report__table td {
          padding: 0.7rem 0.5rem;
          border: 1px solid #e0e5ec;
          text-align: left;
        }
        .report__table th {
          background: #f2f6fa;
          color: #444;
        }
      `}</style>
    </div>
  )
}

export default Report