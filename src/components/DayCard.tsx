import type { BuildDomain, DailyBuild } from '../data/daily-builds'

type DomStyle = { label: string; color: string; bg: string; border: string }

const DOMAIN_STYLES: Record<BuildDomain, DomStyle> = {
  gaming:   { label: 'Gaming',   color: '#FF8A65', bg: 'rgba(255,138,101,0.10)', border: 'rgba(255,138,101,0.20)' },
  saas:     { label: 'SaaS',     color: '#7AB7FF', bg: 'rgba(122,183,255,0.10)', border: 'rgba(122,183,255,0.20)' },
  ai:       { label: 'AI',       color: '#B79CFF', bg: 'rgba(183,156,255,0.10)', border: 'rgba(183,156,255,0.20)' },
  web3:     { label: 'Web3',     color: '#7CE8C6', bg: 'rgba(124,232,198,0.10)', border: 'rgba(124,232,198,0.20)' },
  capstone: { label: 'Capstone', color: '#F5C66B', bg: 'rgba(245,198,107,0.10)', border: 'rgba(245,198,107,0.20)' },
}

const SHOT_BG =
  'linear-gradient(180deg, rgba(56,61,64,0.2) 0%, rgba(30,32,35,0.2) 35%, rgba(40,43,46,0.2) 65%, rgba(56,61,64,0.2) 100%)'
const SHOT_INSET_BORDER = 'inset 0 0 0 1px rgba(72,72,79,0.155)'

export function DayCard(props: DailyBuild) {
  const dom = DOMAIN_STYLES[props.domain]
  return props.vercelUrl
    ? <ShippedCard {...props} dom={dom} />
    : <UpcomingCard {...props} dom={dom} />
}

function ShippedCard({ dayNumber, title, vercelUrl, dom }: DailyBuild & { dom: DomStyle }) {
  if (!vercelUrl) return null
  return (
    <div
      className="group relative w-full shrink-0 aspect-[3/2] max-h-[540px] rounded-[24px] overflow-hidden"
      style={{ background: SHOT_BG, boxShadow: SHOT_INSET_BORDER }}
    >
      <iframe
        src={vercelUrl}
        title={title}
        loading="lazy"
        sandbox="allow-scripts allow-same-origin allow-popups allow-forms"
        referrerPolicy="no-referrer"
        className="absolute inset-0 w-full h-full"
        style={{ border: 0 }}
      />
      <div className="absolute left-3 right-3 bottom-3 translate-y-[calc(100%+12px)] group-hover:translate-y-0 transition-transform duration-500 ease-[cubic-bezier(0.23,1,0.32,1)]">
        <div
          className="flex items-center justify-between gap-3 px-3 py-2 rounded-[16px]"
          style={{
            background: 'linear-gradient(180deg, #191919 0%, #262626 100%)',
            border: '1px solid rgba(255,255,255,0.06)',
            filter: 'drop-shadow(0 4px 10px rgba(0,0,0,0.25))',
          }}
        >
          <div className="flex items-center gap-3 min-w-0">
            <span className="font-mono text-[11px] uppercase tracking-[0.08em] text-white/40 shrink-0">
              Day {String(dayNumber).padStart(2, '0')}
            </span>
            <span
              className="inline-flex items-center h-5 px-2 rounded-full text-[10px] uppercase tracking-[0.06em] font-medium shrink-0"
              style={{ color: dom.color, background: dom.bg, border: `0.5px solid ${dom.border}` }}
            >
              {dom.label}
            </span>
            <span className="text-[14px] leading-[20px] text-white truncate">{title}</span>
          </div>
          <a
            href={vercelUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-[11px] text-white/55 hover:text-white transition-colors shrink-0"
          >
            Open in new tab
            <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
              <path d="M3 7L7 3M7 3H4M7 3V6" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </a>
        </div>
      </div>
    </div>
  )
}

function UpcomingCard({ dayNumber, title, releaseDate, dom }: DailyBuild & { dom: DomStyle }) {
  return (
    <div
      className="relative w-full shrink-0 h-[140px] rounded-[24px] flex flex-col p-5"
      style={{
        background: 'linear-gradient(180deg, rgba(56,61,64,0.10) 0%, rgba(30,32,35,0.10) 100%)',
        border: '1px dashed rgba(255,255,255,0.08)',
      }}
    >
      <div className="flex items-center justify-between">
        <span className="font-mono text-[11px] uppercase tracking-[0.08em] text-white/40">
          Day {String(dayNumber).padStart(2, '0')}
        </span>
        <span
          className="inline-flex items-center h-5 px-2 rounded-full text-[10px] uppercase tracking-[0.06em] font-medium"
          style={{ color: dom.color, background: dom.bg, border: `0.5px solid ${dom.border}` }}
        >
          {dom.label}
        </span>
      </div>
      <h3 className="m-0 mt-3 text-[15px] leading-[20px] font-medium text-white/80 tracking-[-0.01em]">
        {title}
      </h3>
      <div className="mt-auto flex items-center justify-between">
        <span className="text-[11px] text-white/35">{releaseDate}</span>
        <span className="font-mono text-[10px] uppercase tracking-[0.12em] text-white/30">
          Coming {releaseDate}
        </span>
      </div>
    </div>
  )
}
