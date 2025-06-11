import { useEffect, useState } from 'react'
import api from '../services/api'

function Dashboard() {
  const [stats, setStats] = useState(null)

  useEffect(() => {
    api.get('/dashboard').then(res => setStats(res.data))
  }, [])

  if (!stats) return <p>Loading...</p>

  return (
    <div style={{ padding: '2rem' }}>
      <h2>📊 Admin Dashboard</h2>
      <p><strong>Sales Today:</strong> ${stats.totalToday.toFixed(2)}</p>
      <p><strong>Total Products:</strong> {stats.totalProducts}</p>
      <p><strong>Low Stock Items:</strong> {stats.lowStockCount}</p>

      {stats.lowStockList.length > 0 && (
        <>
          <h4>⚠️ Low Stock:</h4>
          <ul>
            {stats.lowStockList.map(p => (
              <li key={p.id}>{p.name} – {p.stock} left</li>
            ))}
          </ul>
        </>
      )}
    </div>
  )
}

export default Dashboard
