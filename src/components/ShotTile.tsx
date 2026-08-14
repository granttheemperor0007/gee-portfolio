import { useEffect, useRef, useState } from 'react'
import { ShotInfoBar } from './ShotInfoBar'

export type Shot = {
  src: string
  title: string
  video?: boolean
  sound?: boolean
  poster?: string
}

const TILE_BG =
  'linear-gradient(180deg, rgba(56,61,64,0.2) 0%, rgba(30,32,35,0.2) 35%, rgba(40,43,46,0.2) 65%, rgba(56,61,64,0.2) 100%)'
const TILE_INSET_BORDER = 'inset 0 0 0 1px rgba(72,72,79,0.155)'

/**
 * A single design-shot tile.
 *
 * Videos are the expensive part of this grid, so they stay inert until they
 * actually matter: no bytes are fetched until the tile is near the viewport,
 * and playback is paused the moment it scrolls away. That keeps at most the
 * one or two visible clips decoding instead of every clip on the page.
 */
export function ShotTile({ shot, index, onExpand }: { shot: Shot; index: number; onExpand?: () => void }) {
  const tileRef = useRef<HTMLDivElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const [shouldLoad, setShouldLoad] = useState(false)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    if (!shot.video) return
    const el = tileRef.current
    if (!el) return

    // Two thresholds off one observer: a generous margin decides when it's
    // worth fetching, a tight one decides when it's worth playing.
    const near = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShouldLoad(true)
          near.disconnect()
        }
      },
      { rootMargin: '300px' }
    )
    const onscreen = new IntersectionObserver(
      ([entry]) => setVisible(entry.isIntersecting),
      { threshold: 0.15 }
    )
    near.observe(el)
    onscreen.observe(el)
    return () => {
      near.disconnect()
      onscreen.disconnect()
    }
  }, [shot.video])

  useEffect(() => {
    const v = videoRef.current
    if (!v || !shouldLoad) return
    if (visible) {
      const p = v.play()
      // Autoplay can still be refused (low power mode, reduced motion); the
      // poster stays up in that case, so there's nothing to recover from.
      if (p) p.catch(() => {})
    } else {
      v.pause()
    }
  }, [visible, shouldLoad])

  return (
    <div
      ref={tileRef}
      onClick={shot.video ? onExpand : undefined}
      className={`shot-tile group relative w-full shrink-0 aspect-[4/3] max-h-[664px] rounded-[24px] overflow-hidden ${
        shot.video ? 'cursor-pointer' : ''
      }`}
      style={{ background: TILE_BG, boxShadow: TILE_INSET_BORDER }}
    >
      {shot.video ? (
        <video
          ref={videoRef}
          src={shouldLoad ? shot.src : undefined}
          poster={shot.poster}
          preload="none"
          loop
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-cover"
        />
      ) : (
        <img
          src={shot.src}
          alt={shot.title}
          // The top couple of tiles are the first paint — everything below
          // waits until it's scrolled toward.
          loading={index < 2 ? 'eager' : 'lazy'}
          decoding="async"
          draggable={false}
          className="absolute inset-0 w-full h-full object-cover"
        />
      )}

      {shot.video && (
        <span
          className="absolute top-3 right-3 flex items-center gap-1.5 h-8 pl-2.5 pr-3 rounded-full text-[12px] font-medium text-white/90 backdrop-blur-md opacity-0 translate-y-1 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300"
          style={{ background: 'rgba(20,20,22,0.55)', border: '0.5px solid rgba(255,255,255,0.14)' }}
        >
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
            <path
              d="M4.5 1.5H1.5V4.5M7.5 1.5H10.5V4.5M4.5 10.5H1.5V7.5M7.5 10.5H10.5V7.5"
              stroke="currentColor"
              strokeWidth="1.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          Expand
        </span>
      )}

      {/* Videos get the same slide-up info bar as the stills — the Expand pill
          sits top-right, so the two never collide. */}
      <div className="absolute left-3 right-3 bottom-3 translate-y-[calc(100%+12px)] group-hover:translate-y-0 transition-transform duration-500 ease-[cubic-bezier(0.23,1,0.32,1)]">
        <ShotInfoBar title={shot.title} />
      </div>
    </div>
  )
}
