import { useEffect, useState } from 'react'
import api from '../services/api'

function DiscountCodes() {
  const [codes, setCodes] = useState([])
  const [form, setForm] = useState({ code: '', type: 'fixed', value: '' })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [submitting, setSubmitting] = useState(false)

  const loadCodes = () => {
    setLoading(true)
    setError("")
    api.get('/discount-codes')
      .then(res => setCodes(res.data))
      .catch(() => setError("Failed to load discount codes."))
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    loadCodes()
  }, [])

  const submit = async () => {
    setSubmitting(true)
    setError("")
    try {
      await api.post('/discount-codes', form)
      setForm({ code: '', type: 'fixed', value: '' })
      loadCodes()
    } catch {
      setError("Failed to add discount code.")
    } finally {
      setSubmitting(false)
    }
  }

  const disableCode = async (id) => {
    setError("")
    try {
      await api.patch(`/discount-codes/${id}/toggle`)
      loadCodes()
    } catch {
      setError("Failed to update discount code.")
    }
  }

  const reactivateCode = async (id) => {
    setError("")
    try {
      await api.patch(`/discount-codes/${id}/reactivate`)
      loadCodes()
    } catch {
      setError("Failed to reactivate discount code.")
    }
  }

  const deleteCode = async (id) => {
    setError("")
    if (window.confirm('Delete this code permanently?')) {
      try {
        await api.delete(`/discount-codes/${id}`)
        loadCodes()
      } catch {
        setError("Failed to delete discount code.")
      }
    }
  }

  return (
    <div className="discount-codes">
      <h2>Discount Code Management</h2>
      <div className="discount-codes__form">
        <input
          placeholder="Code"
          value={form.code}
          onChange={e => setForm({ ...form, code: e.target.value })}
        />
        <select
          value={form.type}
          onChange={e => setForm({ ...form, type: e.target.value })}
        >
          <option value="fixed">Fixed ($)</option>
          <option value="percent">Percent (%)</option>
        </select>
        <input
          placeholder="Value"
          type="number"
          value={form.value}
          onChange={e => setForm({ ...form, value: e.target.value })}
        />
        <button onClick={submit} disabled={submitting || !form.code || !form.value}>
          {submitting ? "Adding..." : "Add"}
        </button>
      </div>
      {error && <div className="discount-codes__error">{error}</div>}
      <div className="discount-codes__table-wrap">
        {loading ? (
          <div style={{ marginTop: "1rem" }}>Loading...</div>
        ) : (
          <table className="discount-codes__table">
            <thead>
              <tr>
                <th>Code</th>
                <th>Type</th>
                <th>Value</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {codes.map(c => (
                <tr key={c.id}>
                  <td>{c.code}</td>
                  <td>{c.type === "fixed" ? "Fixed ($)" : "Percent (%)"}</td>
                  <td>{c.value}</td>
                  <td>
                    {c.active ? (
                      <span className="active-status">✅ Active</span>
                    ) : (
                      <span className="inactive-status">❌ Disabled</span>
                    )}
                  </td>
                  <td>
                    {c.active ? (
                      <>
                        <button
                          className="discount-codes__disable-btn"
                          onClick={() => disableCode(c.id)}
                        >Disable</button>
                        <button
                          className="discount-codes__delete-btn"
                          onClick={() => deleteCode(c.id)}
                        >🗑 Delete</button>
                      </>
                    ) : (
                      <>
                        <button
                          className="discount-codes__reactivate-btn"
                          onClick={() => reactivateCode(c.id)}
                        >Reactivate</button>
                        <button
                          className="discount-codes__delete-btn"
                          onClick={() => deleteCode(c.id)}
                        >🗑 Delete</button>
                      </>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
      <style>{`
        .discount-codes {
          padding: 2rem;
          max-width: 650px;
          margin: 0 auto;
          background: #f7fafc;
          border-radius: 14px;
          box-shadow: 0 2px 16px #0001;
        }
        .discount-codes__form {
          display: flex;
          gap: 1rem;
          margin-bottom: 1.5rem;
          background: #fff;
          border-radius: 8px;
          padding: 1rem;
          box-shadow: 0 1px 8px #0001;
        }
        .discount-codes__form input,
        .discount-codes__form select {
          padding: 0.5rem 0.7rem;
          border-radius: 5px;
          border: 1px solid #bcd1e7;
          font-size: 1rem;
          outline: none;
          background: #fafdff;
        }
        .discount-codes__form button {
          background: #2563eb;
          color: #fff;
          border: none;
          border-radius: 5px;
          padding: 0.5rem 1.1rem;
          font-weight: 600;
          cursor: pointer;
          transition: background 0.16s;
        }
        .discount-codes__form button:disabled {
          background: #bcd1e7;
          cursor: not-allowed;
        }
        .discount-codes__error {
          color: #b91c1c;
          background: #fee2e2;
          border-radius: 6px;
          padding: 0.7rem 1rem;
          margin-bottom: 1rem;
        }
        .discount-codes__table-wrap {
          margin-top: 1rem;
        }
        .discount-codes__table {
          width: 100%;
          border-collapse: collapse;
          background: #fff;
          border-radius: 8px;
          overflow: hidden;
          box-shadow: 0 1px 8px #0001;
        }
        .discount-codes__table th, .discount-codes__table td {
          padding: 0.7rem 0.6rem;
          text-align: left;
        }
        .discount-codes__table th {
          background: #e8f0fe;
          color: #2563eb;
          font-weight: 700;
        }
        .discount-codes__table tr {
          border-bottom: 1px solid #e5e7eb;
        }
        .discount-codes__table tr:last-child {
          border-bottom: none;
        }
        .active-status {
          color: #059669;
          font-weight: 600;
        }
        .inactive-status {
          color: #b91c1c;
          font-weight: 600;
        }
        .discount-codes__disable-btn {
          background: #fbbf24;
          color: #fff;
          border: none;
          border-radius: 4px;
          padding: 0.4rem 0.9rem;
          margin-right: 0.5rem;
          cursor: pointer;
          font-weight: 600;
          transition: background 0.15s;
        }
        .discount-codes__disable-btn:hover {
          background: #f59e1b;
        }
        .discount-codes__reactivate-btn {
          background: #059669;
          color: #fff;
          border: none;
          border-radius: 4px;
          padding: 0.4rem 0.9rem;
          margin-right: 0.5rem;
          cursor: pointer;
          font-weight: 600;
          transition: background 0.15s;
        }
        .discount-codes__reactivate-btn:hover {
          background: #047857;
        }
        .discount-codes__delete-btn {
          background: #ef4444;
          color: #fff;
          border: none;
          border-radius: 4px;
          padding: 0.4rem 0.9rem;
          cursor: pointer;
          font-weight: 600;
          transition: background 0.15s;
        }
        .discount-codes__delete-btn:hover {
          background: #b91c1c;
        }
        @media (max-width: 600px) {
          .discount-codes {
            padding: 0.5rem;
          }
          .discount-codes__form {
            flex-direction: column;
            gap: 0.6rem;
            padding: 0.7rem;
          }
          .discount-codes__table th, .discount-codes__table td {
            padding: 0.5rem 0.3rem;
          }
        }
      `}</style>
    </div>
  )
}

export default DiscountCodes