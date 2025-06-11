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
      if (res.data.user.role === 'admin') {
        navigate('/admin')
      } else {
        navigate('/pos')
      }
    } catch (err) {
      setError('Invalid credentials')
    }
  }

  return (
    <div className="login__container">
      <form className="login__form" onSubmit={handleSubmit} autoComplete="off">
        <h2 className="login__title">Login</h2>
        {error && <div className="login__error">{error}</div>}
        <div className="login__field">
          <label>Email</label>
          <input
            value={email}
            onChange={e => setEmail(e.target.value)}
            placeholder="Email"
            type="email"
            required
          />
        </div>
        <div className="login__field">
          <label>Password</label>
          <input
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            placeholder="Password"
            required
          />
        </div>
        <button className="login__btn" type="submit">Login</button>
      </form>
      <style>{`
        .login__container {
          min-height: 80vh;
          display: flex;
          align-items: center;
          justify-content: center;
          background: linear-gradient(120deg, #a1c4fd 0%, #c2e9fb 100%);
        }
        .login__form {
          background: #fff;
          padding: 2.5rem 2rem;
          border-radius: 14px;
          min-width: 340px;
          box-shadow: 0 2px 16px #0003;
          display: flex;
          flex-direction: column;
          gap: 1.2rem;
        }
        .login__title {
          text-align: center;
          margin-bottom: 0.5rem;
        }
        .login__error {
          color: #fff;
          background: #e74c3c;
          padding: 0.4rem 0.8rem;
          border-radius: 6px;
          text-align: center;
        }
        .login__field {
          display: flex;
          flex-direction: column;
          gap: 0.3rem;
        }
        .login__field label {
          font-size: 1rem;
          color: #555;
        }
        .login__field input {
          font-size: 1rem;
          padding: 0.6rem 0.8rem;
          border: 1.5px solid #b5cfff;
          border-radius: 6px;
          outline: none;
          transition: border .2s;
        }
        .login__field input:focus {
          border: 1.5px solid #1e90ff;
        }
        .login__btn {
          margin-top: 0.5rem;
          padding: 0.7rem 0;
          background: #4e8cff;
          color: #fff;
          border: none;
          border-radius: 6px;
          font-size: 1.1rem;
          font-weight: 600;
          cursor: pointer;
          transition: background 0.2s;
        }
        .login__btn:hover {
          background: #2567c6;
        }
      `}</style>
    </div>
  )
}

export default Login