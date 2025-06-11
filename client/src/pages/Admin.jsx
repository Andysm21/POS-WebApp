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
    <div style={{ padding: '2rem' }}>
      <h2>Admin Dashboard</h2>

      <form onSubmit={handleSubmit} style={{ marginBottom: '2rem' }}>
        <input name="name" placeholder="Name" value={form.name} onChange={handleChange} required />
        <input
          name="price"
          type="number"
          placeholder="Price"
          value={form.price}
          onChange={handleChange}
          required
          min="0"
          step="1"
        />
        <input
          name="stock"
          type="number"
          placeholder="Stock"
          value={form.stock}
          onChange={handleChange}
          required
          min="0"
          step="1"
        />
        <select name="categoryId" value={form.categoryId} onChange={handleChange} required>
          <option value="">Select category</option>
          {categories.map(cat => (
            <option key={cat.id} value={cat.id}>{cat.name}</option>
          ))}
        </select>
        <button type="submit">Add Product</button>
      </form>

      <table border="1" cellPadding="6">
        <thead>
          <tr>
            <th>Name</th><th>Price</th><th>Stock</th><th>Category</th>
          </tr>
        </thead>
        <tbody>
          {products.map(p => (
            <tr key={p.id}>
              <td>{p.name}</td>
              <td>${p.price.toFixed(2)}</td>
              <td>{p.stock}</td>
              <td>{p.category?.name}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default Admin
