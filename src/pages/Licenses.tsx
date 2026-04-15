import { useEffect, useState, type FormEvent } from 'react'
import { Plus, Trash2, FileText, AlertCircle } from 'lucide-react'
import { supabase, isSupabaseConfigured } from '../lib/supabase'
import { type License } from '../types'
import AppShell from '../components/AppShell'
import { Button } from '../components/ui/button'
import { Input } from '../components/ui/input'
import { Label } from '../components/ui/label'
import { Badge } from '../components/ui/badge'
import { formatDate } from '../lib/utils'

const SEED_LICENSES: License[] = [
  { id: '1', user_id: 'seed', name: 'Standard Social Post', platform: 'Instagram', jurisdiction: 'California', terms: 'Non-exclusive license for organic social posts only. No paid promotion. Duration: 30 days.', is_active: true, created_at: new Date(Date.now() - 86400000 * 10).toISOString(), deleted_at: null },
  { id: '2', user_id: 'seed', name: 'Paid Ad Campaign', platform: 'YouTube', jurisdiction: 'Texas', terms: 'Exclusive paid media license. Includes pre-roll and mid-roll placement. Duration: 90 days. Rate: $5,000 flat.', is_active: true, created_at: new Date(Date.now() - 86400000 * 5).toISOString(), deleted_at: null }
]

export default function Licenses() {
  const [licenses, setLicenses] = useState<License[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [name, setName] = useState('')
  const [platform, setPlatform] = useState('')
  const [jurisdiction, setJurisdiction] = useState('')
  const [terms, setTerms] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [formError, setFormError] = useState('')

  useEffect(() => {
    if (!isSupabaseConfigured) { setLicenses(SEED_LICENSES); setLoading(false); return }
    loadLicenses()
  }, [])

  async function loadLicenses() {
    const { data, error: dbError } = await supabase.from('licenses').select('*').is('deleted_at', null).order('created_at', { ascending: false })
    if (dbError) { setError('Could not load licenses.'); setLoading(false); return }
    setLicenses(data ?? [])
    setLoading(false)
  }

  async function handleCreate(e: FormEvent) {
    e.preventDefault()
    if (!name.trim() || !platform.trim() || !jurisdiction.trim()) { setFormError('Name, platform, and jurisdiction are required.'); return }
    if (!isSupabaseConfigured) {
      const newL: License = { id: String(Date.now()), user_id: 'seed', name, platform, jurisdiction, terms, is_active: true, created_at: new Date().toISOString(), deleted_at: null }
      setLicenses(prev => [newL, ...prev])
      setName(''); setPlatform(''); setJurisdiction(''); setTerms(''); return
    }
    setSubmitting(true)
    setFormError('')
    const { data: sessionData } = await supabase.auth.getSession()
    if (!sessionData.session) { setFormError('Session expired.'); setSubmitting(false); return }
    const { error: insertError } = await supabase.from('licenses').insert({ name, platform, jurisdiction, terms, is_active: true, user_id: sessionData.session.user.id })
    setSubmitting(false)
    if (insertError) { setFormError('Failed to create license.'); return }
    setName(''); setPlatform(''); setJurisdiction(''); setTerms('')
    loadLicenses()
  }

  async function handleDelete(id: string) {
    if (!isSupabaseConfigured) { setLicenses(prev => prev.filter(l => l.id !== id)); return }
    await supabase.from('licenses').update({ deleted_at: new Date().toISOString() }).eq('id', id)
    setLicenses(prev => prev.filter(l => l.id !== id))
  }

  return (
    <AppShell title="License Templates">
      {!isSupabaseConfigured && (
        <div className="mb-6 px-4 py-3 rounded-lg border text-sm" style={{ backgroundColor: 'rgba(37,99,235,0.08)', borderColor: 'rgba(37,99,235,0.2)', color: 'var(--color-info)' }}>
          Viewing sample data — connect your database to go live.
        </div>
      )}
      <div className="rounded-xl border p-6 mb-6" style={{ backgroundColor: 'var(--color-bg-surface)', borderColor: 'var(--color-border)' }}>
        <h2 className="font-semibold mb-4" style={{ color: 'var(--color-text)' }}>Create license template</h2>
        <form onSubmit={handleCreate} className="grid md:grid-cols-2 gap-4">
          <div className="space-y-1">
            <Label htmlFor="lic-name">Template name</Label>
            <Input id="lic-name" value={name} onChange={e => setName(e.target.value)} placeholder="e.g. Standard Social Post" />
          </div>
          <div className="space-y-1">
            <Label htmlFor="lic-platform">Platform</Label>
            <Input id="lic-platform" value={platform} onChange={e => setPlatform(e.target.value)} placeholder="e.g. Instagram" />
          </div>
          <div className="space-y-1">
            <Label htmlFor="lic-jurisdiction">Jurisdiction (state)</Label>
            <Input id="lic-jurisdiction" value={jurisdiction} onChange={e => setJurisdiction(e.target.value)} placeholder="e.g. California" />
          </div>
          <div className="space-y-1 md:col-span-2">
            <Label htmlFor="lic-terms">License terms</Label>
            <textarea id="lic-terms" className="w-full rounded-lg border px-3 py-2 text-sm" style={{ minHeight: '80px', backgroundColor: 'var(--color-bg)', color: 'var(--color-text)', borderColor: 'var(--color-border)' }} value={terms} onChange={e => setTerms(e.target.value)} placeholder="Describe usage rights, duration, exclusivity..." />
          </div>
          <div className="md:col-span-2 flex gap-3">
            <Button type="submit" disabled={submitting}><Plus size={16} className="mr-1" />{submitting ? 'Saving...' : 'Create template'}</Button>
          </div>
        </form>
        {formError && <div className="flex items-center gap-2 text-sm mt-3" style={{ color: 'var(--color-error)' }}><AlertCircle size={14} />{formError}</div>}
      </div>

      <div className="rounded-xl border" style={{ backgroundColor: 'var(--color-bg-surface)', borderColor: 'var(--color-border)' }}>
        <div className="px-6 py-4 border-b" style={{ borderColor: 'var(--color-border)' }}>
          <h2 className="font-semibold" style={{ color: 'var(--color-text)' }}>Your templates</h2>
        </div>
        {loading && <div className="px-6 py-12 text-center" style={{ color: 'var(--color-text-muted)' }}>Loading...</div>}
        {error && <div className="px-6 py-12 text-center" style={{ color: 'var(--color-error)' }}>{error}</div>}
        {!loading && !error && licenses.length === 0 && (
          <div className="px-6 py-12 text-center">
            <FileText size={40} className="mx-auto mb-3" style={{ color: 'var(--color-text-muted)' }} />
            <p className="font-medium" style={{ color: 'var(--color-text)' }}>No templates yet</p>
            <p className="text-sm mt-1" style={{ color: 'var(--color-text-muted)' }}>Create your first license template above.</p>
          </div>
        )}
        {!loading && !error && licenses.length > 0 && (
          <ul className="divide-y" style={{ borderColor: 'var(--color-border)' }}>
            {licenses.map(l => (
              <li key={l.id} className="px-6 py-4 flex items-start gap-4">
                <div className="flex-1 min-w-0">
                  <p className="font-medium" style={{ color: 'var(--color-text)' }}>{l.name}</p>
                  <div className="flex flex-wrap gap-2 mt-1">
                    <Badge variant="secondary" className="text-xs">{l.platform}</Badge>
                    <Badge variant="outline" className="text-xs">{l.jurisdiction}</Badge>
                  </div>
                  {l.terms && <p className="text-xs mt-2 line-clamp-2" style={{ color: 'var(--color-text-muted)' }}>{l.terms}</p>}
                  <p className="text-xs mt-1" style={{ color: 'var(--color-text-muted)' }}>{formatDate(l.created_at)}</p>
                </div>
                <button onClick={() => handleDelete(l.id)} className="p-2 rounded-lg hover:bg-red-50 transition-colors" aria-label="Delete license" style={{ color: 'var(--color-error)', minWidth: '44px', minHeight: '44px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
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