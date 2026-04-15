import { useState, useEffect } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { Activity, DollarSign, FileText, LayoutDashboard, Link, LogOut, Menu, Scale, Settings, Shield, X } from 'lucide-react'

import { supabase, isSupabaseConfigured } from '../lib/supabase'

const navItems = [
  { to: '/dashboard', label: 'Dashboard', icon: <LayoutDashboard size={18} /> },
  { to: '/monitors', label: 'Monitors', icon: <Activity size={18} /> },
  { to: '/licenses', label: 'Licenses', icon: <FileText size={18} /> },
  { to: '/earnings', label: 'Earnings', icon: <DollarSign size={18} /> },
  { to: '/disputes', label: 'Disputes', icon: <Scale size={18} /> },
  { to: '/settings', label: 'Settings', icon: <Settings size={18} /> }
]

export default function Navbar() {
  const location = useLocation()
  const navigate = useNavigate()
  const [mobileOpen, setMobileOpen] = useState(false)
  const [userEmail, setUserEmail] = useState('')

  useEffect(() => {
    if (!isSupabaseConfigured) { setUserEmail('demo@weir.app'); return }
    supabase.auth.getSession().then(({ data }) => {
      setUserEmail(data.session?.user.email ?? '')
    })
  }, [])

  async function handleLogout() {
    if (isSupabaseConfigured) await supabase.auth.signOut()
    navigate('/')
  }

  return (
    <header className="sticky top-0 z-40 border-b" style={{ backgroundColor: 'var(--color-bg-surface)', borderColor: 'var(--color-border)' }}>
      <div className="max-w-5xl mx-auto px-6 h-16 flex items-center gap-6">
        <Link to="/dashboard" className="flex items-center gap-2 font-bold text-lg flex-shrink-0" style={{ color: 'var(--color-text)' }}>
          <Shield size={20} style={{ color: 'var(--color-primary)' }} />
          WEIR
        </Link>
        <nav className="hidden md:flex items-center gap-1 flex-1">
          {navItems.map((item) => {
            const active = location.pathname === item.to
            return (
              <Link
                key={item.to}
                to={item.to}
                className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors"
                style={{ color: active ? 'var(--color-primary)' : 'var(--color-text-secondary)', backgroundColor: active ? 'rgba(30,64,175,0.08)' : 'transparent' }}
              >
                {item.icon}{item.label}
              </Link>
            )
          })}
        </nav>
        <div className="hidden md:flex items-center gap-3 ml-auto">
          {userEmail && <span className="text-xs" style={{ color: 'var(--color-text-muted)' }}>{userEmail}</span>}
          <button onClick={handleLogout} className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors" style={{ color: 'var(--color-text-secondary)', minHeight: '44px' }} aria-label="Sign out">
            <LogOut size={16} />Sign out
          </button>
        </div>
        <button className="md:hidden ml-auto p-2" onClick={() => setMobileOpen(!mobileOpen)} aria-label="Toggle menu" style={{ color: 'var(--color-text)', minWidth: '44px', minHeight: '44px' }}>
          {mobileOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>
      {mobileOpen && (
        <div className="md:hidden border-t px-4 py-3 flex flex-col gap-1" style={{ backgroundColor: 'var(--color-bg-surface)', borderColor: 'var(--color-border)' }}>
          {navItems.map((item) => {
            const active = location.pathname === item.to
            return (
              <Link
                key={item.to}
                to={item.to}
                className="flex items-center gap-2 px-3 py-3 rounded-lg text-sm font-medium"
                style={{ color: active ? 'var(--color-primary)' : 'var(--color-text-secondary)', backgroundColor: active ? 'rgba(30,64,175,0.08)' : 'transparent' }}
                onClick={() => setMobileOpen(false)}
              >
                {item.icon}{item.label}
              </Link>
            )
          })}
          <button onClick={handleLogout} className="flex items-center gap-2 px-3 py-3 rounded-lg text-sm font-medium" style={{ color: 'var(--color-text-secondary)', minHeight: '44px' }}>
            <LogOut size={16} />Sign out
          </button>
        </div>
      )}
    </header>
  )
}