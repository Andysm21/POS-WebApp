import { useEffect, useState } from 'react'
import api from '../services/api'

function Admin() {
  const [products, setProducts] = useState([])
  const [categories, setCategories] = useState([])
  const [form, setForm] = useState({ name: '', price: '', stock: '', categoryId: '' })

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    const [prodRes, catRes] = await Promise.all([
      api.get('/products'),
      api.get('/categories')
    ])
    setProducts(prodRes.data)
    setCategories(catRes.data)
  }

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    const price = parseFloat(form.price);
    const stock = parseInt(form.stock);

    if (isNaN(price) || price <= 0) {
      alert('Price must be a positive number.');
      return;
    }
    if (isNaN(stock) || stock <= 0) {
      alert('Stock must be a positive number.');
      return;
    }

    await api.post('/products', {
      name: form.name,
      price,
      stock,
      categoryId: parseInt(form.categoryId)
    });
    setForm({ name: '', price: '', stock: '', categoryId: '' });
    fetchData();
  };

  return (
    <div style={{ maxWidth: 900, margin: '2rem auto', background: '#fff', borderRadius: 12, boxShadow: '0 2px 12px #0001', padding: '2rem' }}>
      <h2 style={{ marginBottom: 24, color: '#2d3748' }}>Admin Dashboard</h2>
      <form onSubmit={handleSubmit} style={{ display: 'flex', gap: 16, flexWrap: 'wrap', marginBottom: 32 }}>
        <input name="name" placeholder="Name" value={form.name} onChange={handleChange} required style={{ flex: 2, padding: 8, borderRadius: 6, border: '1px solid #ccc' }} />
        <input name="price" type="number" placeholder="Price" value={form.price} onChange={handleChange} required min="0" step="1" style={{ flex: 1, padding: 8, borderRadius: 6, border: '1px solid #ccc' }} />
        <input name="stock" type="number" placeholder="Stock" value={form.stock} onChange={handleChange} required min="0" step="1" style={{ flex: 1, padding: 8, borderRadius: 6, border: '1px solid #ccc' }} />
        <select name="categoryId" value={form.categoryId} onChange={handleChange} required style={{ flex: 2, padding: 8, borderRadius: 6, border: '1px solid #ccc' }}>
          <option value="">Select category</option>
          {categories.map(cat => (
            <option key={cat.id} value={cat.id}>{cat.name}</option>
          ))}
        </select>
        <button type="submit" style={{ background: '#3182ce', color: '#fff', border: 'none', borderRadius: 6, padding: '8px 16px', cursor: 'pointer' }}>Add Product</button>
      </form>
      <table style={{ width: '100%', borderCollapse: 'collapse', background: '#fafbfc', borderRadius: 8, overflow: 'hidden' }}>
        <thead style={{ background: '#f7fafc' }}>
          <tr>
            <th style={{ padding: 12, borderBottom: '2px solid #e2e8f0' }}>Name</th>
            <th style={{ padding: 12, borderBottom: '2px solid #e2e8f0' }}>Price</th>
            <th style={{ padding: 12, borderBottom: '2px solid #e2e8f0' }}>Stock</th>
            <th style={{ padding: 12, borderBottom: '2px solid #e2e8f0' }}>Category</th>
          </tr>
        </thead>
        <tbody>
          {products.map(p => (
            <tr key={p.id} style={{ borderBottom: '1px solid #e2e8f0', background: p.id % 2 === 0 ? '#fff' : '#f7fafc' }}>
              <td style={{ padding: 10 }}>{p.name}</td>
              <td style={{ padding: 10 }}>{p.price.toFixed(0)} L.E.</td>
              <td style={{ padding: 10 }}>{p.stock}</td>
              <td style={{ padding: 10 }}>{p.category?.name}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default Admin
