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
    { path: '/discount-codes', label: 'Discounts', icon: '🏷️', adminOnly: true },
  ]

  return (
    <aside className={`sidebar${expanded ? " sidebar--expanded" : ""}`}>
      <div className="sidebar__header">
        <span className="sidebar__logo">
          {expanded ? 'Canteen' : '⛪'}
        </span>
        <span className="sidebar__toggle-container">
          <button
            className={`sidebar__toggle${expanded ? " sidebar__toggle--expanded" : ""}`}
            onClick={() => setExpanded(e => !e)}
            aria-label={expanded ? "Collapse sidebar" : "Expand sidebar"}
          >
            <span className="sidebar__toggle-bar"></span>
            <span className="sidebar__toggle-bar"></span>
            <span className="sidebar__toggle-bar"></span>
          </button>
        </span>
      </div>
      <nav className="sidebar__nav">
        {navItems.map(item => {
          if (item.adminOnly && user?.role !== 'admin') return null;
          if (!item.showAlways && !item.adminOnly) return null;

          const isActive = location.pathname === item.path;

          return (
            <Link
              key={item.path}
              to={item.path}
              className={`sidebar__link${isActive ? " sidebar__link--active" : ""}`}
              tabIndex={0}
            >
              <span className="sidebar__icon">{item.icon}</span>
              {expanded && <span className="sidebar__label">{item.label}</span>}
            </Link>
          )
        })}
      </nav>
      <style>{`
        .sidebar {
          position: fixed;
          left: 0; top: 0; bottom: 0;
          width: 100px;
          height: 100vh;
          background: linear-gradient(180deg, #f6fafd 75%, #dbeafe 100%);
          color: #222;
          transition: width 0.23s cubic-bezier(.4,0,.2,1), background 0.2s;
          overflow-x: hidden;
          z-index: 1000;
          box-shadow: 2px 0 12px #0002;
          display: flex;
          flex-direction: column;
          align-items: stretch;
        }
        .sidebar--expanded {
          width: 220px;
        }
        .sidebar__header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-top: 1rem;
          margin-bottom: 2.5rem;
          padding: 0 1rem 0 1rem;
          min-height: 48px;
        }
        .sidebar__logo {
          font-size: 1.33rem;
          font-weight: 700;
          letter-spacing: 1px;
          color: #2563eb;
          text-shadow: 0 1px 8px #2563eb10;
          white-space: nowrap;
          flex: 1 1 auto;
          display: flex;
          align-items: center;
          min-width: 0;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .sidebar__toggle-container {
          flex: 0 0 auto;
          display: flex;
          align-items: center;
          margin-left: 0.5rem;
        }
        .sidebar__toggle {
          width: 32px;
          height: 32px;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          border: none;
          background: #fff;
          border-radius: 8px;
          box-shadow: 0 2px 8px #0001;
          cursor: pointer;
          z-index: 2;
          padding: 0;
          transition: background 0.18s;
        }
        .sidebar__toggle:hover, .sidebar__toggle:focus {
          background: #e0e7ef;
        }
        .sidebar__toggle-bar {
          height: 3.2px;
          width: 22px;
          background: #3b82f6;
          border-radius: 1.5px;
          margin: 2.6px 0;
          transition:
            transform 0.24s cubic-bezier(.4,0,.2,1),
            opacity 0.17s cubic-bezier(.4,0,.2,1);
        }
        .sidebar__toggle--expanded .sidebar__toggle-bar:nth-child(1) {
          transform: translateY(7px) rotate(45deg);
        }
        .sidebar__toggle--expanded .sidebar__toggle-bar:nth-child(2) {
          opacity: 0;
        }
        .sidebar__toggle--expanded .sidebar__toggle-bar:nth-child(3) {
          transform: translateY(-7px) rotate(-45deg);
        }
        .sidebar__nav {
          display: flex;
          flex-direction: column;
          gap: 0.16rem;
        }
        .sidebar__link {
          display: flex;
          align-items: center;
          padding: 0.75rem 0.5rem;
          text-decoration: none;
          color: #333;
          background: none;
          border-radius: 7px;
          margin: 0 0.5rem 0.2rem 0.5rem;
          transition: all 0.17s cubic-bezier(.4,0,.2,1);
          font-weight: 400;
          font-size: 1.08rem;
          justify-content: center;
          outline: none;
          border: none;
          gap: 0.9rem;
          box-shadow: none;
        }
        .sidebar__link:hover,
        .sidebar__link:focus {
          background: #dbeafe;
          color: #2563eb;
        }
        .sidebar__link--active {
          color: #fff;
          background: #2563eb;
          font-weight: 600;
          box-shadow: 0 1px 8px #2563eb22;
        }
        .sidebar__icon {
          font-size: 1.19rem;
          margin-right: 0;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .sidebar__label {
          margin-left: 0.2rem;
        }
        .sidebar--expanded .sidebar__link {
          justify-content: flex-start;
          padding: 0.75rem 1rem;
        }
        .sidebar--expanded .sidebar__icon {
          margin-right: 1rem;
        }
      `}</style>
    </aside>
  )
}

export default Sidebar