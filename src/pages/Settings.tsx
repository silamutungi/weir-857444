import { useEffect, useState, type FormEvent } from 'react'
import { AlertCircle, CheckCircle } from 'lucide-react'
import { supabase, isSupabaseConfigured } from '../lib/supabase'
import AppShell from '../components/AppShell'
import { Button } from '../components/ui/button'
import { Input } from '../components/ui/input'
import { Label } from '../components/ui/label'

export default function Settings() {
  const [fullName, setFullName] = useState('')
  const [username, setUsername] = useState('')
  const [sportOrNiche, setSportOrNiche] = useState('')
  const [bio, setBio] = useState('')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [deleteConfirm, setDeleteConfirm] = useState(false)

  useEffect(() => {
    if (!isSupabaseConfigured) {
      setFullName('Jordan Williams'); setUsername('jwilliams22'); setSportOrNiche('Basketball'); setBio('NCAA athlete protecting my NIL.')
      setLoading(false); return
    }
    async function loadProfile() {
      const { data: sessionData } = await supabase.auth.getSession()
      if (!sessionData.session) { setLoading(false); return }
      const { data } = await supabase.from('profiles').select('*').eq('user_id', sessionData.session.user.id).single()
      if (data) { setFullName(data.full_name ?? ''); setUsername(data.username ?? ''); setSportOrNiche(data.sport_or_niche ?? ''); setBio(data.bio ?? '') }
      setLoading(false)
    }
    loadProfile()
  }, [])

  async function handleSave(e: FormEvent) {
    e.preventDefault()
    if (!isSupabaseConfigured) { setSuccess(true); setTimeout(() => setSuccess(false), 3000); return }
    setSaving(true); setError(''); setSuccess(false)
    const { data: sessionData } = await supabase.auth.getSession()
    if (!sessionData.session) { setError('Session expired.'); setSaving(false); return }
    const { error: upsertError } = await supabase.from('profiles').upsert({ user_id: sessionData.session.user.id, full_name: fullName, username, sport_or_niche: sportOrNiche, bio })
    setSaving(false)
    if (upsertError) { setError('Failed to save profile.') } else { setSuccess(true); setTimeout(() => setSuccess(false), 3000) }
  }

  async function handleLogout() {
    if (isSupabaseConfigured) await supabase.auth.signOut()
    window.location.href = '/'
  }

  if (loading) {
    return (
      <AppShell title="Settings">
        <div className="space-y-4">
          {[1,2,3,4].map(i => <div key={i} className="h-12 rounded-lg animate-pulse" style={{ backgroundColor: 'var(--color-border)' }} />)}
        </div>
      </AppShell>
    )
  }

  return (
    <AppShell title="Settings">
      <div className="max-w-lg">
        <div className="rounded-xl border p-6 mb-6" style={{ backgroundColor: 'var(--color-bg-surface)', borderColor: 'var(--color-border)' }}>
          <h2 className="font-semibold mb-6" style={{ color: 'var(--color-text)' }}>Profile</h2>
          <form onSubmit={handleSave} className="space-y-5">
            <div className="space-y-1">
              <Label htmlFor="fullName">Full name</Label>
              <Input id="fullName" value={fullName} onChange={e => setFullName(e.target.value)} placeholder="Your legal name" />
            </div>
            <div className="space-y-1">
              <Label htmlFor="username">Username / handle</Label>
              <Input id="username" value={username} onChange={e => setUsername(e.target.value)} placeholder="@yourhandle" />
            </div>
            <div className="space-y-1">
              <Label htmlFor="sport">Sport or niche</Label>
              <Input id="sport" value={sportOrNiche} onChange={e => setSportOrNiche(e.target.value)} placeholder="e.g. Basketball, Fitness, Music" />
            </div>
            <div className="space-y-1">
              <Label htmlFor="bio">Bio</Label>
              <textarea id="bio" className="w-full rounded-lg border px-3 py-2 text-sm" style={{ minHeight: '80px', backgroundColor: 'var(--color-bg)', color: 'var(--color-text)', borderColor: 'var(--color-border)' }} value={bio} onChange={e => setBio(e.target.value)} placeholder="Short description of who you are" />
            </div>
            {error && <div className="flex items-center gap-2 text-sm" style={{ color: 'var(--color-error)' }}><AlertCircle size={14} />{error}</div>}
            {success && <div className="flex items-center gap-2 text-sm" style={{ color: 'var(--color-success)' }}><CheckCircle size={14} />Profile saved successfully.</div>}
            <Button type="submit" disabled={saving}>{saving ? 'Saving...' : 'Save changes'}</Button>
          </form>
        </div>

        <div className="rounded-xl border p-6" style={{ backgroundColor: 'var(--color-bg-surface)', borderColor: 'var(--color-border)' }}>
          <h2 className="font-semibold mb-2" style={{ color: 'var(--color-text)' }}>Danger zone</h2>
          <p className="text-sm mb-4" style={{ color: 'var(--color-text-secondary)' }}>Signing out ends your session on this device.</p>
          {!deleteConfirm ? (
            <Button variant="destructive" onClick={() => setDeleteConfirm(true)}>Sign out</Button>
          ) : (
            <div className="flex items-center gap-3">
              <Button variant="destructive" onClick={handleLogout}>Confirm sign out</Button>
              <Button variant="outline" onClick={() => setDeleteConfirm(false)}>Cancel</Button>
            </div>
          )}
        </div>
      </div>
    </AppShell>
  )
}