import { useEffect, useState } from 'react'
import api from '../services/api'

function Home() {
  const [msg, setMsg] = useState('')

  useEffect(() => {
    api.get('/').then(res => setMsg(res.data)).catch(console.error)
  }, [])

  return <h1>{msg || 'Loading...'}</h1>
}

export default Home
