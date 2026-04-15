import { useEffect, useState, type ReactNode } from 'react'
import { Navigate } from 'react-router-dom'
import { supabase, isSupabaseConfigured } from '../lib/supabase'

interface ProtectedRouteProps {
  children: ReactNode
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const [checking, setChecking] = useState(true)
  const [authenticated, setAuthenticated] = useState(false)

  useEffect(() => {
    if (!isSupabaseConfigured) {
      setAuthenticated(true)
      setChecking(false)
      return
    }
    supabase.auth.getSession().then(({ data }) => {
      setAuthenticated(Boolean(data.session))
      setChecking(false)
    })
  }, [])

  if (checking) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: 'var(--color-bg)' }}>
        <div className="text-sm" style={{ color: 'var(--color-text-muted)' }}>Loading...</div>
      </div>
    )
  }

  return authenticated ? <>{children}</> : <Navigate to="/login" replace />
}