import { useEffect, useState, type FormEvent } from 'react'
import { Plus, Trash2, Activity, AlertCircle } from 'lucide-react'
import { supabase, isSupabaseConfigured } from '../lib/supabase'
import { type Monitor } from '../types'
import AppShell from '../components/AppShell'
import { Button } from '../components/ui/button'
import { Input } from '../components/ui/input'
import { Label } from '../components/ui/label'
import { Badge } from '../components/ui/badge'
import { formatDate } from '../lib/utils'

const SEED_MONITORS: Monitor[] = [
  { id: '1', user_id: 'seed', keyword: 'Jordan Williams', platforms: ['Instagram', 'TikTok', 'YouTube'], is_active: true, created_at: new Date(Date.now() - 86400000 * 7).toISOString(), deleted_at: null },
  { id: '2', user_id: 'seed', keyword: '@jwilliams22', platforms: ['Twitter', 'Instagram'], is_active: true, created_at: new Date(Date.now() - 86400000 * 3).toISOString(), deleted_at: null }
]

export default function Monitors() {
  const [monitors, setMonitors] = useState<Monitor[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [keyword, setKeyword] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [formError, setFormError] = useState('')

  useEffect(() => {
    if (!isSupabaseConfigured) { setMonitors(SEED_MONITORS); setLoading(false); return }
    loadMonitors()
  }, [])

  async function loadMonitors() {
    setLoading(true)
    const { data, error: dbError } = await supabase.from('monitors').select('*').is('deleted_at', null).order('created_at', { ascending: false })
    if (dbError) { setError('Could not load monitors.'); setLoading(false); return }
    setMonitors(data ?? [])
    setLoading(false)
  }

  async function handleCreate(e: FormEvent) {
    e.preventDefault()
    if (!keyword.trim()) { setFormError('Keyword is required.'); return }
    if (!isSupabaseConfigured) {
      const newMon: Monitor = { id: String(Date.now()), user_id: 'seed', keyword, platforms: ['Instagram', 'TikTok', 'YouTube', 'Twitter'], is_active: true, created_at: new Date().toISOString(), deleted_at: null }
      setMonitors(prev => [newMon, ...prev])
      setKeyword(''); return
    }
    setSubmitting(true)
    setFormError('')
    const { data: sessionData } = await supabase.auth.getSession()
    if (!sessionData.session) { setFormError('Session expired.'); setSubmitting(false); return }
    const { error: insertError } = await supabase.from('monitors').insert({ keyword, platforms: ['Instagram', 'TikTok', 'YouTube', 'Twitter'], is_active: true, user_id: sessionData.session.user.id })
    setSubmitting(false)
    if (insertError) { setFormError('Failed to create monitor.'); return }
    setKeyword('')
    loadMonitors()
  }

  async function handleDelete(id: string) {
    if (!isSupabaseConfigured) { setMonitors(prev => prev.filter(m => m.id !== id)); return }
    await supabase.from('monitors').update({ deleted_at: new Date().toISOString() }).eq('id', id)
    setMonitors(prev => prev.filter(m => m.id !== id))
  }

  return (
    <AppShell title="Monitors">
      {!isSupabaseConfigured && (
        <div className="mb-6 px-4 py-3 rounded-lg border text-sm" style={{ backgroundColor: 'rgba(37,99,235,0.08)', borderColor: 'rgba(37,99,235,0.2)', color: 'var(--color-info)' }}>
          Viewing sample data — connect your database to go live.
        </div>
      )}
      <div className="rounded-xl border p-6 mb-6" style={{ backgroundColor: 'var(--color-bg-surface)', borderColor: 'var(--color-border)' }}>
        <h2 className="font-semibold mb-4" style={{ color: 'var(--color-text)' }}>Add keyword monitor</h2>
        <form onSubmit={handleCreate} className="flex flex-col sm:flex-row gap-3">
          <div className="flex-1 space-y-1">
            <Label htmlFor="keyword">Keyword or handle</Label>
            <Input id="keyword" value={keyword} onChange={e => setKeyword(e.target.value)} placeholder="Your name, handle, or phrase" />
          </div>
          <div className="flex items-end">
            <Button type="submit" disabled={submitting}>
              <Plus size={16} className="mr-1" />{submitting ? 'Adding...' : 'Add monitor'}
            </Button>
          </div>
        </form>
        {formError && (
          <div className="flex items-center gap-2 text-sm mt-3" style={{ color: 'var(--color-error)' }}>
            <AlertCircle size={14} />{formError}
          </div>
        )}
      </div>

      <div className="rounded-xl border" style={{ backgroundColor: 'var(--color-bg-surface)', borderColor: 'var(--color-border)' }}>
        <div className="px-6 py-4 border-b" style={{ borderColor: 'var(--color-border)' }}>
          <h2 className="font-semibold" style={{ color: 'var(--color-text)' }}>Active monitors</h2>
        </div>
        {loading && <div className="px-6 py-12 text-center" style={{ color: 'var(--color-text-muted)' }}>Loading...</div>}
        {error && <div className="px-6 py-12 text-center" style={{ color: 'var(--color-error)' }}>{error}</div>}
        {!loading && !error && monitors.length === 0 && (
          <div className="px-6 py-12 text-center">
            <Activity size={40} className="mx-auto mb-3" style={{ color: 'var(--color-text-muted)' }} />
            <p className="font-medium" style={{ color: 'var(--color-text)' }}>No monitors yet</p>
            <p className="text-sm mt-1" style={{ color: 'var(--color-text-muted)' }}>Add a keyword above to start scanning 40+ platforms.</p>
          </div>
        )}
        {!loading && !error && monitors.length > 0 && (
          <ul className="divide-y" style={{ borderColor: 'var(--color-border)' }}>
            {monitors.map(m => (
              <li key={m.id} className="px-6 py-4 flex items-center gap-4">
                <div className="flex-1 min-w-0">
                  <p className="font-medium" style={{ color: 'var(--color-text)' }}>{m.keyword}</p>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {m.platforms.map(p => <Badge key={p} variant="secondary" className="text-xs">{p}</Badge>)}
                  </div>
                </div>
                <span className="text-xs" style={{ color: 'var(--color-text-muted)' }}>{formatDate(m.created_at)}</span>
                <button onClick={() => handleDelete(m.id)} className="p-2 rounded-lg hover:bg-red-50 transition-colors" aria-label="Delete monitor" style={{ color: 'var(--color-error)', minWidth: '44px', minHeight: '44px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Trash2 size={16} />
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </AppShell>
  )
}