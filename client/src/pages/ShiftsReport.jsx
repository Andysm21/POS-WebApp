import { useEffect, useState } from 'react'
import api from '../services/api'

function ShiftReport() {
  const [shifts, setShifts] = useState([])

  useEffect(() => {
    api.get('/shifts').then(res => setShifts(res.data)).catch(console.error)
  }, [])

  return (
    <div className="shifts__container">
      <h2 className="shifts__title">Shift History</h2>
      <div className="shifts__table-wrapper">
        <table className="shifts__table">
          <thead>
            <tr>
              <th>Shift ID</th>
              <th>Cashier</th>
              <th>Opened</th>
              <th>Closed</th>
              <th>Opening Cash</th>
              <th>Total Sales</th>
              <th>Expected</th>
              <th>Actual</th>
              <th>Discrepancy</th>
              <th>Notes</th>
            </tr>
          </thead>
          <tbody>
            {shifts.map(s => (
              <tr key={s.id}>
                <td>{s.id}</td>
                <td>{s.user}</td>
                <td>{new Date(s.openedAt).toLocaleString()}</td>
                <td>{s.closedAt ? new Date(s.closedAt).toLocaleString() : '-'}</td>
                <td>${s.openingCash?.toFixed(2)}</td>
                <td>${s.totalSales.toFixed(2)}</td>
                <td>${s.expectedCash?.toFixed(2)}</td>
                <td>${s.closingCash?.toFixed(2)}</td>
                <td
                  style={{
                    color:
                      s.discrepancy > 0 ? '#1ca700' : s.discrepancy < 0 ? '#e74c3c' : '#444',
                    fontWeight: 'bold'
                  }}>
                  ${s.discrepancy?.toFixed(2)}
                </td>
                <td>{s.notes || '-'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <style>{`
        .shifts__container {
          max-width: 1100px;
          margin: 2rem auto;
          padding: 2.5rem 2rem;
          background: #fff;
          border-radius: 14px;
          box-shadow: 0 2px 16px #0002;
        }
        .shifts__title {
          text-align: center;
          margin-bottom: 2rem;
        }
        .shifts__table-wrapper {
          overflow-x: auto;
        }
        .shifts__table {
          width: 100%;
          border-collapse: collapse;
          background: #fafcff;
        }
        .shifts__table th, .shifts__table td {
          padding: 0.7rem 0.5rem;
          border: 1px solid #e0e5ec;
          text-align: left;
        }
        .shifts__table th {
          background: #f2f6fa;
          color: #444;
        }
      `}</style>
    </div>
  )
}

export default ShiftReport