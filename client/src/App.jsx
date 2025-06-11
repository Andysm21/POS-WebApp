import { Routes, Route, useNavigate } from 'react-router-dom'
import Home from './pages/Home'
import NotFound from './pages/NotFound'
import Admin from './pages/Admin'
import Pos from './pages/Pos'
import Report from './pages/Report'
import { useState, useEffect } from 'react'
import Login from './pages/Login'
import RequireAdmin from './wrapper/RequireAdmin.jsx'
import Inventory from './pages/Inventory'
import Sidebar from './components/Sidebar'
import Users from './pages/Users'
import ShiftReport from './pages/ShiftsReport.jsx'
import Dashboard from './pages/Dashboard'
import DiscountCodes from './pages/DiscountCodes'


function parseJwt(token) {
    try {
        return JSON.parse(atob(token.split('.')[1]))
    } catch (e) {
        return null
    }
}

function App() {
    const [user, setUser] = useState(null)
    const [sidebarExpanded, setSidebarExpanded] = useState(true) // <-- Add this
    const navigate = useNavigate()

    const handleLogout = () => {
        localStorage.removeItem('token')
        setUser(null)
        navigate('/login')
    }

    useEffect(() => {
        const token = localStorage.getItem('token')
        if (token) {
            const decoded = parseJwt(token)
            if (decoded && decoded.exp && (decoded.exp * 1000) > Date.now()) {
                setUser(decoded)
            } else {
                localStorage.removeItem('token')
                setUser(null)
            }
        }
    }, [])

    if (!user) return <Login onLogin={setUser} />

    return (
        <div style={{ display: 'flex' }}>
            <Sidebar user={user} expanded={sidebarExpanded} setExpanded={setSidebarExpanded} />
            <div style={{
                flex: 1,
                backgroundColor: '#f5f5f5',
                minHeight: '100vh',
                marginLeft: sidebarExpanded ? 220 : 64, // <-- Add this for content shift
                transition: 'margin-left 0.2s'
            }}>
                <div style={{
                    padding: '1rem',
                    display: 'flex',
                    justifyContent: 'flex-end',
                    backgroundColor: 'white',
                    boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                }}>
                    <button
                        onClick={handleLogout}
                        style={{
                            padding: '0.5rem 1rem',
                            backgroundColor: '#dc3545',
                            color: 'white',
                            border: 'none',
                            borderRadius: '4px',
                            cursor: 'pointer'
                        }}
                    >
                        Logout
                    </button>
                </div>
                <div style={{ padding: '2rem' }}>
                    <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/pos" element={<Pos />} />
                        <Route path="/report" element={
                            <RequireAdmin user={user}>
                                <Report />
                            </RequireAdmin>
                        } />
                        <Route path="/admin" element={
                            <RequireAdmin user={user}>
                                <Admin />
                            </RequireAdmin>
                        } />
                        <Route path="*" element={<NotFound />} />
                        <Route path="/inventory" element={
                            <RequireAdmin user={user}>
                                <Inventory />
                            </RequireAdmin>
                        } />
                        <Route path="/discount-codes" element={<RequireAdmin user={user}><DiscountCodes /></RequireAdmin>} />
                        <Route path="/admin/users" element={
                            <RequireAdmin user={user}>
                                <Users />
                            </RequireAdmin>
                        } />
                        <Route path="/shifts" element={<RequireAdmin user={user}>
                            <ShiftReport />
                        </RequireAdmin>} />
                        <Route path="/dashboard" element={<RequireAdmin user={user}>
                            <Dashboard />
                        </RequireAdmin>} />

                    </Routes>
                </div>
            </div>
        </div>
    )
}

export default App