import { useState } from 'react'
import api from '../services/api'
import { useNavigate } from 'react-router-dom';
function Login({ onLogin }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState(null)
  const navigate = useNavigate();
  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const res = await api.post('/auth/login', { email, password })
      localStorage.setItem('token', res.data.token)
      onLogin(res.data.user)
      if(res.data.user.role === 'admin'){
        navigate('/admin')
      }else{
        navigate('/pos')
      }
    } catch (err) {
      setError('Invalid credentials')
    }
  }

  return (
    <div style={{ padding: '2rem' }}>
      <h2>Login</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <form onSubmit={handleSubmit}>
        <input value={email} onChange={e => setEmail(e.target.value)} placeholder="Email" />
        <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Password" />
        <button type="submit">Login</button>
      </form>
    </div>
  )
}

export default Login
