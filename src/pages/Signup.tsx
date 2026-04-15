import { useState, type FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { AlertCircle, Link, Shield } from 'lucide-react'

import { supabase, isSupabaseConfigured } from '../lib/supabase'
import { Button } from '../components/ui/button'
import { Input } from '../components/ui/input'
import { Label } from '../components/ui/label'

export default function Signup() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [fullName, setFullName] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    if (!isSupabaseConfigured) {
      navigate('/dashboard')
      return
    }
    if (password.length < 8) {
      setError('Password must be at least 8 characters.')
      return
    }
    setLoading(true)
    setError('')
    const { error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { full_name: fullName } }
    })
    setLoading(false)
    if (authError) {
      setError(authError.message)
    } else {
      navigate('/dashboard')
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4" style={{ backgroundColor: 'var(--color-bg)' }}>
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl mb-4" style={{ backgroundColor: 'var(--color-primary)' }}>
            <Shield size={24} className="text-white" />
          </div>
          <h1 className="font-bold text-2xl" style={{ color: 'var(--color-text)' }}>Create your account</h1>
          <p className="mt-1 text-sm" style={{ color: 'var(--color-text-secondary)' }}>Start protecting your NIL in minutes.</p>
        </div>
        {!isSupabaseConfigured && (
          <div className="mb-6 px-4 py-3 rounded-lg border text-sm" style={{ backgroundColor: 'rgba(37,99,235,0.08)', borderColor: 'rgba(37,99,235,0.2)', color: 'var(--color-info)' }}>
            Demo mode — click sign up to preview the app.
          </div>
        )}
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-1">
            <Label htmlFor="fullName">Full name</Label>
            <Input id="fullName" type="text" required value={fullName} onChange={(e) => setFullName(e.target.value)} placeholder="Jordan Williams" />
          </div>
          <div className="space-y-1">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" autoComplete="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" />
          </div>
          <div className="space-y-1">
            <Label htmlFor="password">Password</Label>
            <Input id="password" type="password" autoComplete="new-password" required minLength={8} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Min. 8 characters" />
          </div>
          {error && (
            <div className="flex items-center gap-2 text-sm px-3 py-2 rounded-lg" style={{ backgroundColor: 'rgba(220,38,38,0.08)', color: 'var(--color-error)' }}>
              <AlertCircle size={16} />{error}
            </div>
          )}
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? 'Creating account...' : 'Start free'}
          </Button>
        </form>
        <p className="mt-6 text-center text-sm" style={{ color: 'var(--color-text-secondary)' }}>
          Already have an account? <Link to="/login" className="font-medium" style={{ color: 'var(--color-primary)' }}>Sign in</Link>
        </p>
      </div>
    </div>
  )
}