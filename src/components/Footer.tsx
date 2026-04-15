import { Link } from 'react-router-dom'
import { Link, Shield } from 'lucide-react'

export default function Footer() {
  const year = new Date().getFullYear()
  return (
    <footer className="border-t py-12" style={{ backgroundColor: 'var(--color-bg-surface)', borderColor: 'var(--color-border)' }}>
      <div className="max-w-5xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-2 font-bold" style={{ color: 'var(--color-text)' }}>
          <Shield size={18} style={{ color: 'var(--color-primary)' }} />
          WEIR
        </div>
        <div className="flex flex-wrap gap-6 text-sm" style={{ color: 'var(--color-text-secondary)' }}>
          <Link to="/pricing" className="hover:underline">Pricing</Link>
          <Link to="/login" className="hover:underline">Sign in</Link>
          <Link to="/signup" className="hover:underline">Start free</Link>
          <a href="mailto:support@weir.app" className="hover:underline">Support</a>
        </div>
        <div className="text-sm" style={{ color: 'var(--color-text-muted)' }}>
          &copy; {year} WEIR. All rights reserved.
        </div>
      </div>
    </footer>
  )
}