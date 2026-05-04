import { useMemo, useState } from 'react'
import { DAILY_BUILDS } from '../data/daily-builds'
import type { BuildDomain } from '../data/daily-builds'
import { DayCard } from './DayCard'

const FILTERS: { id: 'all' | BuildDomain; label: string }[] = [
  { id: 'all', label: 'All' },
  { id: 'gaming', label: 'Gaming' },
  { id: 'saas', label: 'SaaS' },
  { id: 'ai', label: 'AI' },
  { id: 'web3', label: 'Web3' },
]

const TOTAL_DAYS = 30

export function ClaudeLab() {
  const [filter, setFilter] = useState<'all' | BuildDomain>('all')

  const shippedCount = DAILY_BUILDS.filter((b) => !!b.vercelUrl).length

  const visible = useMemo(() => {
    const filtered =
      filter === 'all' ? DAILY_BUILDS : DAILY_BUILDS.filter((b) => b.domain === filter)
    const ship = filtered.filter((b) => !!b.vercelUrl).sort((a, b) => b.dayNumber - a.dayNumber)
    const upcoming = filtered.filter((b) => !b.vercelUrl).sort((a, b) => a.dayNumber - b.dayNumber)
    return [...ship, ...upcoming]
  }, [filter])

  const progressPct = (shippedCount / TOTAL_DAYS) * 100

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between gap-4">
          <span className="font-mono text-[11px] uppercase tracking-[0.08em] text-white/40">
            {shippedCount} of {TOTAL_DAYS} shipped
          </span>
          <span className="font-mono text-[11px] uppercase tracking-[0.08em] text-white/30">
            {Math.round(progressPct)}%
          </span>
        </div>
        <div
          className="h-1 w-full rounded-full overflow-hidden"
          style={{ background: 'rgba(255,255,255,0.06)' }}
        >
          <div
            className="h-full transition-[width] duration-700 ease-[cubic-bezier(0.2,0.8,0.2,1)]"
            style={{
              width: `${progressPct}%`,
              background:
                'linear-gradient(90deg, rgba(255,112,67,0.85) 0%, rgba(255,138,101,1) 100%)',
            }}
          />
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        {FILTERS.map((f) => {
          const active = filter === f.id
          return (
            <button
              key={f.id}
              type="button"
              onClick={() => setFilter(f.id)}
              className="h-7 px-3 rounded-full text-[11px] font-medium tracking-[0.02em] transition-colors focus:outline-none"
              style={{
                background: active ? 'rgba(255,255,255,0.10)' : 'rgba(255,255,255,0.04)',
                color: active ? '#ffffff' : 'rgba(255,255,255,0.55)',
                border: `0.5px solid ${active ? 'rgba(255,255,255,0.15)' : 'rgba(255,255,255,0.06)'}`,
              }}
            >
              {f.label}
            </button>
          )
        })}
      </div>

      <div className="flex flex-col gap-3">
        {visible.map((b) => (
          <DayCard key={b.dayNumber} {...b} />
        ))}
      </div>
    </div>
  )
}
