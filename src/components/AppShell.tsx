import { type ReactNode } from 'react'
import Navbar from './Navbar'

interface AppShellProps {
  children: ReactNode
  title: string
}

export default function AppShell({ children, title }: AppShellProps) {
  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--color-bg)' }}>
      <Navbar />
      <main className="max-w-5xl mx-auto px-6 py-8">
        <h1 className="font-bold mb-8" style={{ fontSize: 'var(--text-title-2)', color: 'var(--color-text)' }}>{title}</h1>
        {children}
      </main>
    </div>
  )
}