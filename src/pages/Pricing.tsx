import { Link } from 'react-router-dom'
import { ChevronDown, Link, Zap } from 'lucide-react'

import { Button } from '../components/ui/button'
import Footer from '../components/Footer'
import { useState } from 'react'

const plans = [
  { name: 'Starter', price: '$0', period: '/mo', features: ['5 keyword monitors', '50 match alerts/month', 'Basic license templates', 'Email support', 'Earnings summary view'], highlighted: false },
  { name: 'Creator', price: '$29', period: '/mo', features: ['Unlimited keyword monitors', 'Real-time AI detection across 40+ platforms', 'All jurisdiction-aware license templates', 'One-tap monetize / takedown', 'Dispute resolution workflow', 'CPM earnings by platform', 'Priority support'], highlighted: true },
  { name: 'Pro Athlete', price: '$99', period: '/mo', features: ['Everything in Creator', 'Custom state NIL jurisdiction packs', 'Legal team escalation path', 'White-label license agreements', 'Dedicated account manager', 'SLA-backed alert response'], highlighted: false }
]

const faqs = [
  { q: 'Do you take a cut of my earnings?', a: 'Never. WEIR charges a flat monthly subscription. Every dollar you earn from your NIL stays with you.' },
  { q: 'What platforms does WEIR monitor?', a: 'Instagram, TikTok, YouTube, Twitter/X, Facebook, LinkedIn, Snapchat, Pinterest, and 30+ additional web sources.' },
  { q: 'Is the Creator plan really compliant with all 50 state NIL laws?', a: 'Yes. License templates are reviewed by legal experts and updated as state laws change. You choose the jurisdiction when creating a template.' },
  { q: 'What happens if a brand disputes my takedown?', a: 'WEIR routes contested cases through an automated dispute resolution workflow, maintaining a paper trail for every action taken.' },
  { q: 'Can I cancel anytime?', a: 'Yes. No contracts, no cancellation fees. Downgrade or cancel from Settings at any time.' }
]

export default function Pricing() {
  const [openFaq, setOpenFaq] = useState<number | null>(null)

  return (
    <div style={{ backgroundColor: 'var(--color-bg)', color: 'var(--color-text)' }}>
      <header className="sticky top-0 z-50 border-b" style={{ backgroundColor: 'var(--color-bg-surface)', borderColor: 'var(--color-border)' }}>
        <div className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link to="/" className="font-bold text-xl tracking-tight" style={{ color: 'var(--color-text)' }}>WEIR</Link>
          <div className="flex items-center gap-4">
            <Link to="/login" className="text-sm font-medium" style={{ color: 'var(--color-text-secondary)' }}>Sign in</Link>
            <Link to="/signup"><Button size="sm">Start free</Button></Link>
          </div>
        </div>
      </header>

      <section className="py-20 md:py-32">
        <div className="max-w-5xl mx-auto px-6">
          <div className="text-center mb-16">
            <p className="text-sm font-semibold uppercase tracking-widest mb-3" style={{ color: 'var(--color-primary)' }}>Pricing</p>
            <h1 className="font-bold mb-4" style={{ fontSize: 'var(--text-title-1)', color: 'var(--color-text)' }}>Creator-favorable pricing. Always.</h1>
            <p className="max-w-md mx-auto" style={{ color: 'var(--color-text-secondary)' }}>Flat monthly fee. Zero transaction cuts. You keep every dollar your NIL earns.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {plans.map((plan) => (
              <div key={plan.name} className={`rounded-xl p-8 border card-hover ${plan.highlighted ? 'ring-2 ring-blue-500' : ''}`} style={{ backgroundColor: plan.highlighted ? 'var(--color-primary)' : 'var(--color-bg-surface)', borderColor: plan.highlighted ? 'transparent' : 'var(--color-border)' }}>
                <div className="font-semibold mb-1" style={{ color: plan.highlighted ? '#fff' : 'var(--color-text)' }}>{plan.name}</div>
                <div className="flex items-end gap-1 mb-6">
                  <span className="font-bold" style={{ fontSize: '2rem', color: plan.highlighted ? '#fff' : 'var(--color-text)' }}>{plan.price}</span>
                  <span className="mb-1 text-sm" style={{ color: plan.highlighted ? 'rgba(255,255,255,0.7)' : 'var(--color-text-muted)' }}>{plan.period}</span>
                </div>
                <ul className="space-y-2 mb-8">
                  {plan.features.map((feat) => (
                    <li key={feat} className="flex items-start gap-2 text-sm" style={{ color: plan.highlighted ? 'rgba(255,255,255,0.85)' : 'var(--color-text-secondary)' }}>
                      <Zap size={14} className="mt-0.5 flex-shrink-0" style={{ color: plan.highlighted ? '#fff' : 'var(--color-success)' }} />
                      {feat}
                    </li>
                  ))}
                </ul>
                <Link to="/signup"><Button className="w-full" variant={plan.highlighted ? 'secondary' : 'default'}>Start free</Button></Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20" style={{ backgroundColor: 'var(--color-bg-muted)' }}>
        <div className="max-w-2xl mx-auto px-6">
          <h2 className="font-bold text-center mb-10" style={{ fontSize: 'var(--text-title-2)', color: 'var(--color-text)' }}>Frequently asked questions</h2>
          <div className="space-y-3">
            {faqs.map((faq, i) => (
              <div key={i} className="rounded-xl border" style={{ backgroundColor: 'var(--color-bg-surface)', borderColor: 'var(--color-border)' }}>
                <button className="w-full px-6 py-4 flex items-center justify-between text-left" style={{ minHeight: '44px' }} onClick={() => setOpenFaq(openFaq === i ? null : i)}>
                  <span className="font-medium text-sm" style={{ color: 'var(--color-text)' }}>{faq.q}</span>
                  <ChevronDown size={16} style={{ color: 'var(--color-text-muted)', transform: openFaq === i ? 'rotate(180deg)' : 'none', transition: 'transform 200ms' }} />
                </button>
                {openFaq === i && <div className="px-6 pb-4 text-sm" style={{ color: 'var(--color-text-secondary)', lineHeight: 1.6 }}>{faq.a}</div>}
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}