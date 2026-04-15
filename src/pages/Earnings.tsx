import { useEffect, useState } from 'react'
import { TrendingUp, DollarSign } from 'lucide-react'
import { supabase, isSupabaseConfigured } from '../lib/supabase'
import { type Earning } from '../types'
import AppShell from '../components/AppShell'
import { Badge } from '../components/ui/badge'
import { formatCurrency, formatCPM, formatDate } from '../lib/utils'

const SEED_EARNINGS: Earning[] = [
  { id: '1', user_id: 'seed', platform: 'Instagram', amount: 1240, cpm: 8.50, impressions: 145882, period_start: '2024-05-01', period_end: '2024-05-31', created_at: new Date().toISOString(), deleted_at: null },
  { id: '2', user_id: 'seed', platform: 'TikTok', amount: 860, cpm: 5.20, impressions: 165384, period_start: '2024-05-01', period_end: '2024-05-31', created_at: new Date().toISOString(), deleted_at: null },
  { id: '3', user_id: 'seed', platform: 'YouTube', amount: 540, cpm: 12.80, impressions: 42187, period_start: '2024-05-01', period_end: '2024-05-31', created_at: new Date().toISOString(), deleted_at: null },
  { id: '4', user_id: 'seed', platform: 'Twitter', amount: 200, cpm: 3.10, impressions: 64516, period_start: '2024-05-01', period_end: '2024-05-31', created_at: new Date().toISOString(), deleted_at: null }
]

const PLATFORM_COLORS: Record<string, string> = {
  Instagram: 'var(--color-accent)',
  TikTok: 'var(--color-text)',
  YouTube: 'var(--color-error)',
  Twitter: 'var(--color-info)'
}

export default function Earnings() {
  const [earnings, setEarnings] = useState<Earning[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!isSupabaseConfigured) { setEarnings(SEED_EARNINGS); setLoading(false); return }
    async function load() {
      const { data, error: dbError } = await supabase.from('earnings').select('*').is('deleted_at', null).order('amount', { ascending: false })
      if (dbError) { setError('Could not load earnings data.'); setLoading(false); return }
      setEarnings(data ?? [])
      setLoading(false)
    }
    load()
  }, [])

  const totalEarnings = earnings.reduce((sum, e) => sum + e.amount, 0)
  const avgCPM = earnings.length > 0 ? earnings.reduce((sum, e) => sum + e.cpm, 0) / earnings.length : 0

  return (
    <AppShell title="Earnings">
      {!isSupabaseConfigured && (
        <div className="mb-6 px-4 py-3 rounded-lg border text-sm" style={{ backgroundColor: 'rgba(37,99,235,0.08)', borderColor: 'rgba(37,99,235,0.2)', color: 'var(--color-info)' }}>
          Viewing sample data — connect your database to go live.
        </div>
      )}

      <div className="grid grid-cols-2 gap-4 mb-8">
        <div className="rounded-xl border p-5 card-hover" style={{ backgroundColor: 'var(--color-bg-surface)', borderColor: 'var(--color-border)' }}>
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium" style={{ color: 'var(--color-text-secondary)' }}>Total Earnings</span>
            <DollarSign size={18} style={{ color: 'var(--color-success)' }} />
          </div>
          <div className="font-bold text-2xl" style={{ color: 'var(--color-text)' }}>{formatCurrency(totalEarnings)}</div>
          <div className="text-xs mt-1" style={{ color: 'var(--color-text-muted)' }}>This period</div>
        </div>
        <div className="rounded-xl border p-5 card-hover" style={{ backgroundColor: 'var(--color-bg-surface)', borderColor: 'var(--color-border)' }}>
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium" style={{ color: 'var(--color-text-secondary)' }}>Avg. CPM</span>
            <TrendingUp size={18} style={{ color: 'var(--color-primary)' }} />
          </div>
          <div className="font-bold text-2xl" style={{ color: 'var(--color-text)' }}>{formatCPM(avgCPM)}</div>
          <div className="text-xs mt-1" style={{ color: 'var(--color-text-muted)' }}>Across all platforms</div>
        </div>
      </div>

      <div className="rounded-xl border" style={{ backgroundColor: 'var(--color-bg-surface)', borderColor: 'var(--color-border)' }}>
        <div className="px-6 py-4 border-b" style={{ borderColor: 'var(--color-border)' }}>
          <h2 className="font-semibold" style={{ color: 'var(--color-text)' }}>Breakdown by platform</h2>
        </div>
        {loading && <div className="px-6 py-12 text-center" style={{ color: 'var(--color-text-muted)' }}>Loading...</div>}
        {error && <div className="px-6 py-12 text-center" style={{ color: 'var(--color-error)' }}>{error}</div>}
        {!loading && !error && earnings.length === 0 && (
          <div className="px-6 py-12 text-center">
            <DollarSign size={40} className="mx-auto mb-3" style={{ color: 'var(--color-text-muted)' }} />
            <p className="font-medium" style={{ color: 'var(--color-text)' }}>No earnings recorded yet</p>
            <p className="text-sm mt-1" style={{ color: 'var(--color-text-muted)' }}>Monetize a match to start tracking platform revenue.</p>
          </div>
        )}
        {!loading && !error && earnings.length > 0 && (
          <ul className="divide-y" style={{ borderColor: 'var(--color-border)' }}>
            {earnings.map(e => (
              <li key={e.id} className="px-6 py-4">
                <div className="flex items-center gap-4">
                  <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: PLATFORM_COLORS[e.platform] ?? 'var(--color-primary)' }} />
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold" style={{ color: 'var(--color-text)' }}>{e.platform}</span>
                      <Badge variant="outline" className="text-xs">CPM {formatCPM(e.cpm)}</Badge>
                    </div>
                    <p className="text-xs mt-0.5" style={{ color: 'var(--color-text-muted)' }}>{new Intl.NumberFormat(undefined).format(e.impressions)} impressions · {formatDate(e.period_start)} – {formatDate(e.period_end)}</p>
                  </div>
                  <span className="font-bold" style={{ color: 'var(--color-success)' }}>{formatCurrency(e.amount)}</span>
                </div>
                <div className="mt-2 h-1.5 rounded-full overflow-hidden" style={{ backgroundColor: 'var(--color-border)' }}>
                  <div className="h-full rounded-full" style={{ width: `${Math.round((e.amount / totalEarnings) * 100)}%`, backgroundColor: PLATFORM_COLORS[e.platform] ?? 'var(--color-primary)' }} />
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </AppShell>
  )
}