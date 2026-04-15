import { useEffect, useState, type FormEvent } from 'react'
import { Scale, AlertCircle, Plus } from 'lucide-react'
import { supabase, isSupabaseConfigured } from '../lib/supabase'
import { type Dispute } from '../types'
import AppShell from '../components/AppShell'
import { Button } from '../components/ui/button'
import { Input } from '../components/ui/input'
import { Label } from '../components/ui/label'
import { Badge } from '../components/ui/badge'
import { formatDate } from '../lib/utils'

const SEED_DISPUTES: Dispute[] = [
  { id: '1', user_id: 'seed', match_id: 'm1', reason: 'Brand ran paid ad using my photo without a signed license agreement or compensation.', status: 'under_review', resolution_notes: null, created_at: new Date(Date.now() - 86400000 * 2).toISOString(), deleted_at: null },
  { id: '2', user_id: 'seed', match_id: 'm2', reason: 'Deepfake-style video generated using my likeness on TikTok. No consent given.', status: 'open', resolution_notes: null, created_at: new Date(Date.now() - 86400000).toISOString(), deleted_at: null },
  { id: '3', user_id: 'seed', match_id: 'm3', reason: 'Platform claims license exists but I never signed. Requesting original document.', status: 'resolved', resolution_notes: 'Platform confirmed no valid license existed. Content removed. Settlement of $1,200 agreed.', created_at: new Date(Date.now() - 86400000 * 14).toISOString(), deleted_at: null }
]

const STATUS_VARIANT: Record<string, 'default' | 'secondary' | 'destructive' | 'outline'> = {
  open: 'destructive',
  under_review: 'secondary',
  resolved: 'outline',
  closed: 'outline'
}

export default function Disputes() {
  const [disputes, setDisputes] = useState<Dispute[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [reason, setReason] = useState('')
  const [matchId, setMatchId] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [formError, setFormError] = useState('')

  useEffect(() => {
    if (!isSupabaseConfigured) { setDisputes(SEED_DISPUTES); setLoading(false); return }
    loadDisputes()
  }, [])

  async function loadDisputes() {
    const { data, error: dbError } = await supabase.from('disputes').select('*').is('deleted_at', null).order('created_at', { ascending: false })
    if (dbError) { setError('Could not load disputes.'); setLoading(false); return }
    setDisputes(data ?? [])
    setLoading(false)
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    if (!reason.trim()) { setFormError('Dispute reason is required.'); return }
    if (!isSupabaseConfigured) {
      const newD: Dispute = { id: String(Date.now()), user_id: 'seed', match_id: matchId || 'manual', reason, status: 'open', resolution_notes: null, created_at: new Date().toISOString(), deleted_at: null }
      setDisputes(prev => [newD, ...prev])
      setReason(''); setMatchId(''); return
    }
    setSubmitting(true)
    setFormError('')
    const { data: sessionData } = await supabase.auth.getSession()
    if (!sessionData.session) { setFormError('Session expired.'); setSubmitting(false); return }
    const { error: insertError } = await supabase.from('disputes').insert({ reason, match_id: matchId || null, status: 'open', user_id: sessionData.session.user.id })
    setSubmitting(false)
    if (insertError) { setFormError('Failed to submit dispute.'); return }
    setReason(''); setMatchId('')
    loadDisputes()
  }

  return (
    <AppShell title="Disputes">
      {!isSupabaseConfigured && (
        <div className="mb-6 px-4 py-3 rounded-lg border text-sm" style={{ backgroundColor: 'rgba(37,99,235,0.08)', borderColor: 'rgba(37,99,235,0.2)', color: 'var(--color-info)' }}>
          Viewing sample data — connect your database to go live.
        </div>
      )}
      <div className="rounded-xl border p-6 mb-6" style={{ backgroundColor: 'var(--color-bg-surface)', borderColor: 'var(--color-border)' }}>
        <h2 className="font-semibold mb-4" style={{ color: 'var(--color-text)' }}>File a new dispute</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1">
            <Label htmlFor="matchId">Match ID (optional)</Label>
            <Input id="matchId" value={matchId} onChange={e => setMatchId(e.target.value)} placeholder="Leave blank for manual dispute" />
          </div>
          <div className="space-y-1">
            <Label htmlFor="reason">Reason for dispute</Label>
            <textarea id="reason" className="w-full rounded-lg border px-3 py-2 text-sm" style={{ minHeight: '80px', backgroundColor: 'var(--color-bg)', color: 'var(--color-text)', borderColor: 'var(--color-border)' }} value={reason} onChange={e => setReason(e.target.value)} placeholder="Describe the unauthorized use, missing license, or violation..." />
          </div>
          <Button type="submit" disabled={submitting}><Plus size={16} className="mr-1" />{submitting ? 'Submitting...' : 'Submit dispute'}</Button>
        </form>
        {formError && <div className="flex items-center gap-2 text-sm mt-3" style={{ color: 'var(--color-error)' }}><AlertCircle size={14} />{formError}</div>}
      </div>

      <div className="rounded-xl border" style={{ backgroundColor: 'var(--color-bg-surface)', borderColor: 'var(--color-border)' }}>
        <div className="px-6 py-4 border-b" style={{ borderColor: 'var(--color-border)' }}>
          <h2 className="font-semibold" style={{ color: 'var(--color-text)' }}>Active disputes</h2>
        </div>
        {loading && <div className="px-6 py-12 text-center" style={{ color: 'var(--color-text-muted)' }}>Loading...</div>}
        {error && <div className="px-6 py-12 text-center" style={{ color: 'var(--color-error)' }}>{error}</div>}
        {!loading && !error && disputes.length === 0 && (
          <div className="px-6 py-12 text-center">
            <Scale size={40} className="mx-auto mb-3" style={{ color: 'var(--color-text-muted)' }} />
            <p className="font-medium" style={{ color: 'var(--color-text)' }}>No disputes yet</p>
            <p className="text-sm mt-1" style={{ color: 'var(--color-text-muted)' }}>File a dispute above when you spot a contested match.</p>
          </div>
        )}
        {!loading && !error && disputes.length > 0 && (
          <ul className="divide-y" style={{ borderColor: 'var(--color-border)' }}>
            {disputes.map(d => (
              <li key={d.id} className="px-6 py-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm" style={{ color: 'var(--color-text)' }}>{d.reason}</p>
                    {d.resolution_notes && <p className="text-xs mt-2 p-2 rounded" style={{ backgroundColor: 'rgba(22,163,74,0.08)', color: 'var(--color-success)' }}>{d.resolution_notes}</p>}
                    <p className="text-xs mt-2" style={{ color: 'var(--color-text-muted)' }}>Filed {formatDate(d.created_at)}</p>
                  </div>
                  <Badge variant={STATUS_VARIANT[d.status] ?? 'secondary'} className="text-xs flex-shrink-0">{d.status.replace('_', ' ')}</Badge>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </AppShell>
  )
}