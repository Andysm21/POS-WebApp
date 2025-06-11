import { useEffect, useState } from 'react'
import api from '../services/api'

function ShiftReport() {
  const [shifts, setShifts] = useState([])

  useEffect(() => {
    api.get('/shifts').then(res => setShifts(res.data)).catch(console.error)
  }, [])

  return (
    <div style={{ padding: '2rem' }}>
      <h2>Shift History</h2>
      <table border="1" cellPadding="6" width="100%">
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
              <td style={{ color: s.discrepancy > 0 ? 'green' : s.discrepancy < 0 ? 'red' : 'black' }}>
                ${s.discrepancy?.toFixed(2)}
              </td>
              <td>{s.notes || '-'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default ShiftReport
