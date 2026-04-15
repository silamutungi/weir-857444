import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Activity, AlertTriangle, ChevronRight, DollarSign, FileText, Link, Shield } from 'lucide-react'

import { supabase, isSupabaseConfigured } from '../lib/supabase'
import { formatCurrency, formatDate } from '../lib/utils'
import { type Match } from '../types'
import AppShell from '../components/AppShell'
import { Badge } from '../components/ui/badge'

const SEED_MATCHES: Match[] = [
  { id: '1', user_id: 'seed', monitor_id: 'm1', platform: 'Instagram', url: 'https://instagram.com/p/abc123', title: 'Nike ad campaign using @jordanwilliams likeness', risk_level: 'critical', status: 'pending', detected_at: new Date(Date.now() - 3600000).toISOString(), created_at: new Date(Date.now() - 3600000).toISOString(), deleted_at: null },
  { id: '2', user_id: 'seed', monitor_id: 'm1', platform: 'TikTok', url: 'https://tiktok.com/@brand/video/xyz', title: 'Gatorade promo clip featuring player image', risk_level: 'high', status: 'pending', detected_at: new Date(Date.now() - 7200000).toISOString(), created_at: new Date(Date.now() - 7200000).toISOString(), deleted_at: null },
  { id: '3', user_id: 'seed', monitor_id: 'm2', platform: 'YouTube', url: 'https://youtube.com/watch?v=def456', title: 'Adidas highlight reel — name referenced in title', risk_level: 'medium', status: 'approved', detected_at: new Date(Date.now() - 86400000).toISOString(), created_at: new Date(Date.now() - 86400000).toISOString(), deleted_at: null },
  { id: '4', user_id: 'seed', monitor_id: 'm1', platform: 'Twitter', url: 'https://twitter.com/brandx/status/111', title: 'Unofficial brand tweet using athlete photo', risk_level: 'high', status: 'disputed', detected_at: new Date(Date.now() - 172800000).toISOString(), created_at: new Date(Date.now() - 172800000).toISOString(), deleted_at: null }
]

const RISK_COLOR: Record<string, string> = {
  critical: 'var(--color-error)',
  high: 'var(--color-warning)',
  medium: 'var(--color-info)',
  low: 'var(--color-success)'
}

function RiskBadge({ level }: { level: string }) {
  return (
    <span className="inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full" style={{ backgroundColor: `${RISK_COLOR[level]}22`, color: RISK_COLOR[level] }}>
      {level === 'critical' && <AlertTriangle size={10} />}
      {level.charAt(0).toUpperCase() + level.slice(1)}
    </span>
  )
}

export default function Dashboard() {
  const [matches, setMatches] = useState<Match[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    async function load() {
      if (!isSupabaseConfigured) {
        setMatches(SEED_MATCHES)
        setLoading(false)
        return
      }
      const { data: sessionData } = await supabase.auth.getSession()
      if (!sessionData.session) { setLoading(false); return }
      const { data, error: dbError } = await supabase
        .from('matches')
        .select('*')
        .is('deleted_at', null)
        .order('detected_at', { ascending: false })
        .limit(10)
      if (dbError) { setError('Could not load matches. Try refreshing.'); setLoading(false); return }
      setMatches(data ?? [])
      setLoading(false)
    }
    load()
  }, [])

  const critical = matches.filter(m => m.risk_level === 'critical' || m.risk_level === 'high').length
  const pending = matches.filter(m => m.status === 'pending').length
  const resolved = matches.filter(m => m.status === 'approved' || m.status === 'monetized').length

  return (
    <AppShell title="Dashboard">
      {!isSupabaseConfigured && (
        <div className="mb-6 px-4 py-3 rounded-lg border text-sm" style={{ backgroundColor: 'rgba(37,99,235,0.08)', borderColor: 'rgba(37,99,235,0.2)', color: 'var(--color-info)' }}>
          Viewing sample data — connect your database to go live.
        </div>
      )}

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[
          { label: 'Risk Alerts', value: loading ? '—' : String(critical), icon: <AlertTriangle size={20} />, color: 'var(--color-error)' },
          { label: 'Pending Action', value: loading ? '—' : String(pending), icon: <Activity size={20} />, color: 'var(--color-warning)' },
          { label: 'Resolved', value: loading ? '—' : String(resolved), icon: <Shield size={20} />, color: 'var(--color-success)' },
          { label: 'Est. Earnings', value: '$2,840', icon: <DollarSign size={20} />, color: 'var(--color-primary)' }
        ].map((metric) => (
          <div key={metric.label} className="rounded-xl p-5 border card-hover" style={{ backgroundColor: 'var(--color-bg-surface)', borderColor: 'var(--color-border)' }}>
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-medium" style={{ color: 'var(--color-text-secondary)' }}>{metric.label}</span>
              <span style={{ color: metric.color }}>{metric.icon}</span>
            </div>
            <div className="font-bold text-2xl" style={{ color: 'var(--color-text)' }}>{metric.value}</div>
          </div>
        ))}
      </div>

      <div className="grid md:grid-cols-3 gap-4 mb-8">
        {[
          { label: 'Monitor Keywords', desc: 'Scan new platforms', to: '/monitors', icon: <Activity size={20} /> },
          { label: 'License Templates', desc: 'Create a new license', to: '/licenses', icon: <FileText size={20} /> },
          { label: 'View Earnings', desc: 'CPM by platform', to: '/earnings', icon: <DollarSign size={20} /> }
        ].map((action) => (
          <Link key={action.to} to={action.to} className="flex items-center gap-4 rounded-xl p-5 border card-hover" style={{ backgroundColor: 'var(--color-bg-surface)', borderColor: 'var(--color-border)' }}>
            <div className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0" style={{ backgroundColor: 'rgba(30,64,175,0.1)', color: 'var(--color-primary)' }}>{action.icon}</div>
            <div>
              <div className="font-semibold text-sm" style={{ color: 'var(--color-text)' }}>{action.label}</div>
              <div className="text-xs" style={{ color: 'var(--color-text-muted)' }}>{action.desc}</div>
            </div>
            <ChevronRight size={16} className="ml-auto" style={{ color: 'var(--color-text-muted)' }} />
          </Link>
        ))}
      </div>

      <div className="rounded-xl border" style={{ backgroundColor: 'var(--color-bg-surface)', borderColor: 'var(--color-border)' }}>
        <div className="px-6 py-4 border-b flex items-center justify-between" style={{ borderColor: 'var(--color-border)' }}>
          <h2 className="font-semibold" style={{ color: 'var(--color-text)' }}>Recent Matches</h2>
          <Link to="/monitors" className="text-sm font-medium" style={{ color: 'var(--color-primary)' }}>View all</Link>
        </div>
        {loading && <div className="px-6 py-12 text-center" style={{ color: 'var(--color-text-muted)' }}>Loading matches...</div>}
        {error && <div className="px-6 py-12 text-center" style={{ color: 'var(--color-error)' }}>{error} <button className="underline ml-2" onClick={() => window.location.reload()}>Retry</button></div>}
        {!loading && !error && matches.length === 0 && (
          <div className="px-6 py-12 text-center">
            <Shield size={40} className="mx-auto mb-3" style={{ color: 'var(--color-text-muted)' }} />
            <p className="font-medium" style={{ color: 'var(--color-text)' }}>No matches detected yet</p>
            <p className="text-sm mt-1" style={{ color: 'var(--color-text-muted)' }}>Set up your first monitor to start scanning.</p>
            <Link to="/monitors" className="inline-block mt-4 text-sm font-medium" style={{ color: 'var(--color-primary)' }}>Add monitor</Link>
          </div>
        )}
        {!loading && !error && matches.length > 0 && (
          <ul className="divide-y" style={{ borderColor: 'var(--color-border)' }}>
            {matches.map((match) => (
              <li key={match.id} className="px-6 py-4 flex items-center gap-4">
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm truncate" style={{ color: 'var(--color-text)' }}>{match.title}</p>
                  <p className="text-xs mt-0.5" style={{ color: 'var(--color-text-muted)' }}>{match.platform} · {formatDate(match.detected_at)}</p>
                </div>
                <RiskBadge level={match.risk_level} />
                <Badge variant={match.status === 'pending' ? 'destructive' : 'secondary'} className="text-xs hidden sm:inline-flex">{match.status}</Badge>
              </li>
            ))}
          </ul>
        )}
      </div>
    </AppShell>
  )

  function formatDate(date: string) {
    return new Intl.DateTimeFormat(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }).format(new Date(date))
  }
}