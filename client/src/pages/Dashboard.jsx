import { useEffect, useState } from 'react'
import api from '../services/api'

function Dashboard() {
  const [stats, setStats] = useState(null)

  useEffect(() => {
    api.get('/dashboard').then(res => setStats(res.data))
  }, [])

  if (!stats) return <div className="dashboard__loading">Loading...</div>

  return (
    <div className="dashboard__container">
      <h2 className="dashboard__title">📊 Admin Dashboard</h2>
      <div className="dashboard__stats">
        <div className="dashboard__stat">
          <span className="dashboard__stat-label">Sales Today</span>
          <span className="dashboard__stat-value">${stats.totalToday.toFixed(2)}</span>
        </div>
        <div className="dashboard__stat">
          <span className="dashboard__stat-label">Total Products</span>
          <span className="dashboard__stat-value">{stats.totalProducts}</span>
        </div>
        <div className="dashboard__stat">
          <span className="dashboard__stat-label">Low Stock Items</span>
          <span className="dashboard__stat-value">{stats.lowStockCount}</span>
        </div>
      </div>
      {stats.lowStockList.length > 0 && (
        <div className="dashboard__lowstock">
          <h4 className="dashboard__lowstock-title">⚠️ Low Stock</h4>
          <ul className="dashboard__lowstock-list">
            {stats.lowStockList.map(p => (
              <li key={p.id}>
                <span>{p.name}</span>
                <span className="dashboard__lowstock-qty">{p.stock} left</span>
              </li>
            ))}
          </ul>
        </div>
      )}
      <style>{`
        .dashboard__container {
          max-width: 600px;
          margin: 2rem auto;
          padding: 2rem;
          background: #fff;
          border-radius: 12px;
          box-shadow: 0 4px 16px #0001;
        }
        .dashboard__title {
          text-align: center;
          margin-bottom: 2rem;
        }
        .dashboard__stats {
          display: flex;
          gap: 2rem;
          justify-content: space-between;
          margin-bottom: 2rem;
        }
        .dashboard__stat {
          background: #f9fafb;
          border-radius: 8px;
          padding: 1rem 1.5rem;
          text-align: center;
          flex: 1;
        }
        .dashboard__stat-label {
          display: block;
          font-size: 0.98rem;
          color: #666;
        }
        .dashboard__stat-value {
          display: block;
          font-size: 1.4rem;
          font-weight: bold;
          margin-top: 0.2rem;
        }
        .dashboard__lowstock {
          margin-top: 2rem;
        }
        .dashboard__lowstock-title {
          margin-bottom: 0.8rem;
        }
        .dashboard__lowstock-list {
          list-style: none;
          padding: 0;
        }
        .dashboard__lowstock-list li {
          display: flex;
          justify-content: space-between;
          background: #fff6e0;
          border-radius: 6px;
          padding: 0.5rem 0.9rem;
          margin-bottom: 0.5rem;
          font-size: 1rem;
        }
        .dashboard__lowstock-qty {
          font-weight: bold;
          color: #c97a00;
        }
        .dashboard__loading {
          text-align: center;
          padding: 3rem;
        }
      `}</style>
    </div>
  )
}

export default Dashboard