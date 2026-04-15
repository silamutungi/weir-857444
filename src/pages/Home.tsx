import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ChevronRight, Link, Menu, Shield, X, Zap } from 'lucide-react'

import { Button } from '../components/ui/button'
import Footer from '../components/Footer'

const features = [
  { icon: '🛡️', title: 'Real-Time AI Detection', desc: 'Continuously scans Instagram, TikTok, YouTube, and 40+ platforms for unauthorized use of your name, image, or likeness.' },
  { icon: '⚡', title: 'One-Tap Actions', desc: 'Monetize, approve, or send a takedown in a single tap. No lawyers required for 90% of cases.' },
  { icon: '📄', title: 'Legal-Grade Licenses', desc: 'Jurisdiction-aware templates for all 50 states. Platform-by-platform controls so you decide who uses your content.' },
  { icon: '💰', title: 'Earnings by Platform', desc: 'See exactly what each platform owes you with CPM tracking. No opaque totals — full breakdown, always.' },
  { icon: '⚖️', title: 'Dispute Resolution', desc: 'Automated dispute workflows handle contested matches. Track every case from open to resolved.' },
  { icon: '🔔', title: 'Risk Alerts', desc: 'Critical matches surface instantly. Severity scoring tells you what demands action now.' }
]

const pricingPlans = [
  { name: 'Starter', price: '$0', period: '/mo', features: ['5 monitors', '50 match alerts/mo', 'Basic license templates', 'Email support'], cta: 'Start free', highlighted: false },
  { name: 'Creator', price: '$29', period: '/mo', features: ['Unlimited monitors', 'Real-time AI detection', 'All license templates', 'Dispute resolution', 'Earnings dashboard', 'Priority support'], cta: 'Start free', highlighted: true },
  { name: 'Pro Athlete', price: '$99', period: '/mo', features: ['Everything in Creator', 'Custom jurisdiction packs', 'Legal team escalation', 'White-label agreements', 'Dedicated account manager'], cta: 'Contact sales', highlighted: false }
]

export default function Home() {
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <div style={{ backgroundColor: 'var(--color-bg)', color: 'var(--color-text)' }}>
      <header className="fixed top-0 left-0 right-0 z-50 glass-dark">
        <div className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link to="/" className="font-bold text-xl tracking-tight text-white">WEIR</Link>
          <nav className="hidden md:flex items-center gap-6">
            <Link to="/pricing" className="text-sm font-medium text-white/80 hover:text-white transition-colors">Pricing</Link>
            <Link to="/login" className="text-sm font-medium text-white/80 hover:text-white transition-colors">Sign in</Link>
            <Link to="/signup"><Button size="sm">Start free</Button></Link>
          </nav>
          <button className="md:hidden p-2 text-white" onClick={() => setMobileOpen(!mobileOpen)} aria-label="Toggle menu">
            {mobileOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
        {mobileOpen && (
          <div className="md:hidden glass-dark border-t border-white/10 px-6 py-4 flex flex-col gap-4">
            <Link to="/pricing" className="text-sm font-medium text-white/80" onClick={() => setMobileOpen(false)}>Pricing</Link>
            <Link to="/login" className="text-sm font-medium text-white/80" onClick={() => setMobileOpen(false)}>Sign in</Link>
            <Link to="/signup" onClick={() => setMobileOpen(false)}><Button className="w-full">Start free</Button></Link>
          </div>
        )}
      </header>

      <section
        style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1657412235086-c2de1a1176a9?ixid=M3w5MTM0MDN8MHwxfHNlYXJjaHwxfHxBJTIwY29uZmlkZW50JTIwY3JlYXRvciUyMGluJTIwbW9kZXJuJTIwc3R1ZGlvJTIwbGlnaHRpbmclMkMlMjBzdXJyb3VuZGVkJTIwYnl8ZW58MHwwfHx8MTc3NjIyNjc2N3ww&ixlib=rb-4.1.0&w=1920&h=1080&fit=crop&crop=center&q=80&auto=format)', backgroundSize: 'cover', backgroundPosition: 'center' }}
        className="relative min-h-[100svh] flex items-center overflow-hidden"
      >
        <div className="absolute inset-0" style={{ background: 'linear-gradient(to bottom right, rgba(0,0,0,0.72) 35%, rgba(15,23,42,0.82) 75%)' }} />
        <div className="relative z-10 max-w-5xl mx-auto px-6 py-32">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-blue-400/30 bg-blue-500/10 text-blue-300 text-sm font-medium mb-6">
            <Shield size={14} /> NIL Protection Platform
          </div>
          <h1 className="text-white font-bold mb-6" style={{ fontSize: 'clamp(2rem, 5vw, 3.5rem)', lineHeight: 1.15, letterSpacing: '-0.02em', maxWidth: '700px' }}>
            Your name earns money 24/7 — with or without your permission.
          </h1>
          <p className="text-white/75 mb-10 max-w-xl" style={{ fontSize: '1.125rem', lineHeight: 1.6 }}>
            WEIR detects every unauthorized use of your NIL across the web, then gives you one tap to monetize, license, or take it down. Legal protection without the legal bills.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Link to="/signup"><Button size="lg" className="text-base px-8">Start free — no credit card <ChevronRight size={16} className="ml-1" /></Button></Link>
            <Link to="/pricing"><Button size="lg" variant="outline" className="text-base px-8 text-white border-white/40 hover:bg-gray-900/10">View pricing</Button></Link>
          </div>
          <div className="mt-12 flex flex-wrap gap-6">
            {[['40+', 'Platforms monitored'], ['< 60s', 'Detection speed'], ['$0', 'Upfront legal cost']].map(([stat, label]) => (
              <div key={label}>
                <div className="text-white font-bold text-2xl">{stat}</div>
                <div className="text-white/60 text-sm">{label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 md:py-32" style={{ backgroundColor: 'var(--color-bg)' }}>
        <div className="max-w-5xl mx-auto px-6">
          <div className="mb-16">
            <p className="text-sm font-semibold uppercase tracking-widest mb-3" style={{ color: 'var(--color-primary)' }}>What WEIR does</p>
            <h2 className="font-bold mb-4" style={{ fontSize: 'var(--text-title-1)', color: 'var(--color-text)' }}>Every tool to protect and profit from your NIL</h2>
            <p className="max-w-xl" style={{ color: 'var(--color-text-secondary)' }}>Built for athletes and creators who are done leaving money on the table — and done discovering brand deals only after the fact.</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((f) => (
              <div key={f.title} className="card-hover rounded-xl p-6 border" style={{ backgroundColor: 'var(--color-bg-surface)', borderColor: 'var(--color-border)' }}>
                <div className="text-4xl mb-4">{f.icon}</div>
                <h3 className="font-semibold mb-2" style={{ color: 'var(--color-text)' }}>{f.title}</h3>
                <p className="text-sm" style={{ color: 'var(--color-text-secondary)', lineHeight: 1.6 }}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 md:py-32" style={{ backgroundColor: 'var(--color-bg-muted)' }}>
        <div className="max-w-5xl mx-auto px-6">
          <div className="mb-16 text-center">
            <p className="text-sm font-semibold uppercase tracking-widest mb-3" style={{ color: 'var(--color-primary)' }}>Pricing</p>
            <h2 className="font-bold mb-4" style={{ fontSize: 'var(--text-title-1)', color: 'var(--color-text)' }}>Creator-favorable pricing. Always.</h2>
            <p style={{ color: 'var(--color-text-secondary)' }}>No transaction fees. No clawbacks. You keep what you earn.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {pricingPlans.map((plan) => (
              <div key={plan.name} className={`rounded-xl p-8 border card-hover ${plan.highlighted ? 'ring-2' : ''}`} style={{ backgroundColor: plan.highlighted ? 'var(--color-primary)' : 'var(--color-bg-surface)', borderColor: plan.highlighted ? 'transparent' : 'var(--color-border)', ringColor: plan.highlighted ? 'var(--color-primary)' : undefined }}>
                <div className="font-semibold mb-1" style={{ color: plan.highlighted ? '#fff' : 'var(--color-text)' }}>{plan.name}</div>
                <div className="flex items-end gap-1 mb-6">
                  <span className="font-bold" style={{ fontSize: '2rem', color: plan.highlighted ? '#fff' : 'var(--color-text)' }}>{plan.price}</span>
                  <span className="mb-1" style={{ color: plan.highlighted ? 'rgba(255,255,255,0.7)' : 'var(--color-text-muted)' }}>{plan.period}</span>
                </div>
                <ul className="space-y-2 mb-8">
                  {plan.features.map((feat) => (
                    <li key={feat} className="flex items-center gap-2 text-sm" style={{ color: plan.highlighted ? 'rgba(255,255,255,0.85)' : 'var(--color-text-secondary)' }}>
                      <Zap size={14} className={plan.highlighted ? 'text-white' : ''} style={{ color: plan.highlighted ? '#fff' : 'var(--color-success)', flexShrink: 0 }} />
                      {feat}
                    </li>
                  ))}
                </ul>
                <Link to="/signup">
                  <Button className="w-full" variant={plan.highlighted ? 'secondary' : 'default'}>{plan.cta}</Button>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20" style={{ backgroundColor: 'var(--color-bg)' }}>
        <div className="max-w-5xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-8">
          <div>
            <h2 className="font-bold mb-2" style={{ fontSize: 'var(--text-title-2)', color: 'var(--color-text)' }}>Ready to own your NIL?</h2>
            <p style={{ color: 'var(--color-text-secondary)' }}>Join thousands of creators already protecting and monetizing their identity.</p>
          </div>
          <div className="flex gap-4 flex-shrink-0">
            <Link to="/signup"><Button size="lg">Get your dashboard <ChevronRight size={16} className="ml-1" /></Button></Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}

export { DollarSign, FileText, AlertTriangle }