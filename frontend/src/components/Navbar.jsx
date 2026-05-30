import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'

const NAV_ITEMS = [
  { path: '/', label: 'Dashboard', icon: '📊' },
  { path: '/add-meal', label: 'Add Meal', icon: '🍽️' },
  { path: '/history', label: 'History', icon: '📈' },
  { path: '/profile', label: 'Profile', icon: '👤' },
]

export default function Navbar() {
  const { user, logout } = useAuth()
  const location = useLocation()
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <nav className="sticky top-0 z-50" style={{
      background: 'rgba(15, 23, 42, 0.85)',
      backdropFilter: 'blur(20px)',
      borderBottom: '1px solid rgba(99, 102, 241, 0.15)'
    }}>
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 no-underline">
            <span className="text-2xl">🥗</span>
            <span className="text-xl font-bold gradient-text">NutriTrack</span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-1">
            {NAV_ITEMS.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 no-underline"
                style={{
                  color: location.pathname === item.path ? '#818cf8' : '#94a3b8',
                  background: location.pathname === item.path ? 'rgba(99, 102, 241, 0.1)' : 'transparent',
                }}
              >
                <span>{item.icon}</span>
                {item.label}
              </Link>
            ))}
          </div>

          {/* User Menu */}
          <div className="hidden md:flex items-center gap-3">
            <span className="text-sm" style={{ color: '#94a3b8' }}>
              {user?.first_name || user?.username}
            </span>
            <button onClick={logout} className="btn-danger text-xs">
              Logout
            </button>
          </div>

          {/* Mobile Toggle */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden p-2 rounded-lg"
            style={{ background: 'rgba(99, 102, 241, 0.1)', color: '#818cf8' }}
          >
            {mobileOpen ? '✕' : '☰'}
          </button>
        </div>

        {/* Mobile Nav */}
        {mobileOpen && (
          <div className="md:hidden pb-4 animate-slide-in">
            {NAV_ITEMS.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setMobileOpen(false)}
                className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium no-underline"
                style={{
                  color: location.pathname === item.path ? '#818cf8' : '#94a3b8',
                  background: location.pathname === item.path ? 'rgba(99, 102, 241, 0.1)' : 'transparent',
                }}
              >
                <span className="text-lg">{item.icon}</span>
                {item.label}
              </Link>
            ))}
            <div className="mt-2 px-4 pt-3" style={{ borderTop: '1px solid rgba(99, 102, 241, 0.15)' }}>
              <button onClick={logout} className="btn-danger w-full">
                Logout
              </button>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}
