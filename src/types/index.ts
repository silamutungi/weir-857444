export type RiskLevel = 'low' | 'medium' | 'high' | 'critical'
export type MatchStatus = 'pending' | 'approved' | 'disputed' | 'taken_down' | 'monetized'
export type DisputeStatus = 'open' | 'under_review' | 'resolved' | 'closed'

export interface Monitor {
  id: string
  user_id: string
  keyword: string
  platforms: string[]
  is_active: boolean
  created_at: string
  deleted_at: string | null
}

export interface Match {
  id: string
  user_id: string
  monitor_id: string
  platform: string
  url: string
  title: string
  risk_level: RiskLevel
  status: MatchStatus
  detected_at: string
  created_at: string
  deleted_at: string | null
}

export interface License {
  id: string
  user_id: string
  name: string
  platform: string
  jurisdiction: string
  terms: string
  is_active: boolean
  created_at: string
  deleted_at: string | null
}

export interface Earning {
  id: string
  user_id: string
  platform: string
  amount: number
  cpm: number
  impressions: number
  period_start: string
  period_end: string
  created_at: string
  deleted_at: string | null
}

export interface Dispute {
  id: string
  user_id: string
  match_id: string
  reason: string
  status: DisputeStatus
  resolution_notes: string | null
  created_at: string
  deleted_at: string | null
}

export interface Profile {
  id: string
  user_id: string
  full_name: string
  username: string
  sport_or_niche: string
  bio: string
  created_at: string
}