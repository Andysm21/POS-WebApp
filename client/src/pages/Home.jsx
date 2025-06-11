import { useEffect, useState } from 'react'
import api from '../services/api'

function Home() {
  const [msg, setMsg] = useState('')

  useEffect(() => {
    api.get('/').then(res => setMsg(res.data)).catch(console.error)
  }, [])

  return (
    <div className="home__container">
      <h1 className="home__title">{msg || 'Loading...'}</h1>
      <style>{`
        .home__container {
          display: flex;
          min-height: 60vh;
          align-items: center;
          justify-content: center;
          background: linear-gradient(135deg, #f6d365 0%, #fda085 100%);
        }
        .home__title {
          font-size: 2.5rem;
          font-weight: 700;
          color: #222;
          letter-spacing: 1px;
          background: rgba(255,255,255,0.7);
          padding: 1.5rem 3rem;
          border-radius: 16px;
          box-shadow: 0 2px 12px #0002;
        }
      `}</style>
    </div>
  )
}

export default Home