import { Link, useLocation } from 'react-router-dom'

function Sidebar({ user, expanded, setExpanded }) {
    const location = useLocation()

    const navItems = [
        { path: '/admin', label: 'Dashboard', icon: '⚙️', adminOnly: true },
        { path: '/pos', label: 'POS', icon: '🛒', showAlways: true },
        { path: '/inventory', label: 'Inventory', icon: '📦', adminOnly: true },
        { path: '/report', label: 'Reports', icon: '📊', adminOnly: true },
        { path: '/admin/users', label: 'Users', icon: '👥', adminOnly: true },
        { path: '/shifts', label: 'Shifts', icon: '📝', adminOnly: true },
    ]

    return (
        <div
            style={{
                position: 'fixed',
                left: 0,
                top: 0,
                bottom: 0,
                width: expanded ? '220px' : '64px',
                height: '100vh',
                background: 'linear-gradient(180deg, #23272f 75%, #191b1f 100%)',
                color: 'white',
                transition: 'width 0.2s',
                overflow: 'hidden',
                zIndex: 1000,
                boxShadow: '2px 0 8px rgba(0,0,0,0.09)'
            }}
        >
            {/* Toggle button */}
            <button
                onClick={() => setExpanded(e => !e)}
                style={{
                    background: 'none',
                    border: 'none',
                    color: '#aaa',
                    position: 'absolute',
                    top: 18,
                    right: expanded ? 12 : -20,
                    fontSize: '1.3rem',
                    cursor: 'pointer',
                    zIndex: 2,
                    backgroundColor: '#23272f',
                    borderRadius: 999,
                    width: 28,
                    height: 28,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 1px 3px #0002'
                }}
                aria-label="Toggle sidebar"
            >
                {expanded ? '←' : '→'}
            </button>
            {/* Logo/title */}
            <div style={{
                fontSize: '1.35rem',
                fontWeight: 600,
                marginBottom: '2.5rem',
                padding: expanded ? '1rem' : '1rem 0.5rem',
                textAlign: expanded ? 'left' : 'center',
                whiteSpace: 'nowrap',
                letterSpacing: 1
            }}>
                {expanded ? 'Church Canteen' : '⛪'}
            </div>
            <nav>
                {navItems.map(item => {
                    if (item.adminOnly && user?.role !== 'admin') return null;
                    if (!item.showAlways && !item.adminOnly) return null;

                    const isActive = location.pathname === item.path

                    return (
                        <Link
                            key={item.path}
                            to={item.path}
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                padding: expanded ? '0.75rem 1rem' : '0.75rem 0.5rem',
                                textDecoration: 'none',
                                color: isActive ? '#00d8ae' : '#c9c9c9',
                                backgroundColor: isActive ? '#232954' : 'transparent',
                                borderRadius: '8px',
                                marginBottom: '0.5rem',
                                transition: 'all 0.18s',
                                fontWeight: isActive ? 600 : 400,
                                fontSize: '1.05rem',
                                justifyContent: expanded ? 'flex-start' : 'center',
                                boxShadow: isActive ? '0 1px 8px #00d8ae22' : undefined
                            }}
                            onMouseEnter={e => e.currentTarget.style.background = '#232944'}
                            onMouseLeave={e => e.currentTarget.style.background = isActive ? '#232954' : 'transparent'}
                        >
                            <span style={{ marginRight: expanded ? '1rem' : 0, fontSize: '1.2rem' }}>{item.icon}</span>
                            {expanded && item.label}
                        </Link>
                    )
                })}
            </nav>
        </div>
    )
}

export default Sidebar