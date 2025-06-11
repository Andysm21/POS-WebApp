import { useEffect, useState } from 'react'
import api from '../services/api'

function Users() {
  const [users, setUsers] = useState([])
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'cashier' })
  const [formError, setFormError] = useState('')

  const fetchUsers = async () => {
    const res = await api.get('/users')
    setUsers(res.data)
  }

  useEffect(() => { fetchUsers() }, [])

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
    setFormError('') // clear error on change
  }

  const validateForm = () => {
    if (!form.name || !form.email || !form.password || !form.role) {
      setFormError('All fields are required.')
      return false
    }
    // Simple email regex
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(form.email)) {
      setFormError('Email is not valid.')
      return false
    }
    return true
  }

  const createUser = async () => {
    if (!validateForm()) return
    try {
      await api.post('/users', form)
      setForm({ name: '', email: '', password: '', role: 'cashier' })
      setFormError('')
      fetchUsers()
    } catch (error) {
      setFormError(error?.response?.data?.error || "Failed to add user.")
    }
  }

  const deleteUser = async (id) => {
    if (!confirm('Delete this user?')) return
    await api.delete(`/users/${id}`)
    fetchUsers()
  }

  return (
    <div style={{ maxWidth: 800, margin: '2rem auto', background: '#fff', borderRadius: 12, boxShadow: '0 2px 12px #0001', padding: '2rem' }}>
      <h2 style={{ marginBottom: 24, color: '#2d3748' }}>User Management</h2>
      <form onSubmit={e => { e.preventDefault(); createUser(); }} style={{ display: 'flex', gap: 16, flexWrap: 'wrap', marginBottom: 24 }}>
        <input name="name" placeholder="Name" value={form.name} onChange={handleChange} required style={{ flex: 1, padding: 8, borderRadius: 6, border: '1px solid #ccc' }} />
        <input name="email" placeholder="Email" value={form.email} onChange={handleChange} required type="email" style={{ flex: 1, padding: 8, borderRadius: 6, border: '1px solid #ccc' }} />
        <input name="password" placeholder="Password" value={form.password} onChange={handleChange} required type="password" style={{ flex: 1, padding: 8, borderRadius: 6, border: '1px solid #ccc' }} />
        <select name="role" value={form.role} onChange={handleChange} required style={{ flex: 1, padding: 8, borderRadius: 6, border: '1px solid #ccc' }}>
          <option value="">Select Role</option>
          <option value="admin">Admin</option>
          <option value="cashier">Cashier</option>
          <option value="inventory">Inventory</option>
        </select>
        <button type="submit" style={{ background: '#3182ce', color: '#fff', border: 'none', borderRadius: 6, padding: '8px 16px', cursor: 'pointer' }}>Add User</button>
      </form>
      {formError && <div style={{ color: 'red', marginBottom: 16 }}>{formError}</div>}
      <h3 style={{ marginTop: 32, marginBottom: 12, color: '#2d3748' }}>All Users</h3>
      <table style={{ width: '100%', borderCollapse: 'collapse', background: '#fafbfc', borderRadius: 8, overflow: 'hidden' }}>
        <thead style={{ background: '#f7fafc' }}>
          <tr>
            <th style={{ padding: 12, borderBottom: '2px solid #e2e8f0' }}>Name</th>
            <th style={{ padding: 12, borderBottom: '2px solid #e2e8f0' }}>Email</th>
            <th style={{ padding: 12, borderBottom: '2px solid #e2e8f0' }}>Role</th>
            <th style={{ padding: 12, borderBottom: '2px solid #e2e8f0' }}>Action</th>
          </tr>
        </thead>
        <tbody>
          {users.map(u => (
            <tr key={u.id} style={{ borderBottom: '1px solid #e2e8f0', background: u.id % 2 === 0 ? '#fff' : '#f7fafc' }}>
              <td style={{ padding: 10 }}>{u.name}</td>
              <td style={{ padding: 10 }}>{u.email}</td>
              <td style={{ padding: 10 }}>{u.role}</td>
              <td style={{ padding: 10 }}><button onClick={() => deleteUser(u.id)} style={{ background: '#e53e3e', color: '#fff', border: 'none', borderRadius: 4, padding: '6px 12px', cursor: 'pointer' }}>Delete</button></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default Users