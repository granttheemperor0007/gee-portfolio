import { useEffect, useRef, useState } from 'react'

type Props = {
  text: string
  className?: string
  style?: React.CSSProperties
  duration?: number
  repeatEvery?: number
}

export function SoftReveal({
  text,
  className,
  style,
  duration = 1400,
  repeatEvery,
}: Props) {
  const ref = useRef<HTMLSpanElement>(null)
  const [trigger, setTrigger] = useState(0)
  const [hasIntersected, setHasIntersected] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasIntersected) {
          setHasIntersected(true)
        }
      },
      { threshold: 0.4 }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [hasIntersected])

  useEffect(() => {
    if (!hasIntersected) return
    const el = ref.current
    if (!el) return

    const animation = el.animate(
      [
        { opacity: 0, filter: 'blur(8px)' },
        { opacity: 0.55, filter: 'blur(3px)', offset: 0.3 },
        { opacity: 0.32, filter: 'blur(4.5px)', offset: 0.36 },
        { opacity: 0.85, filter: 'blur(1.2px)', offset: 0.62 },
        { opacity: 0.62, filter: 'blur(2.2px)', offset: 0.7 },
        { opacity: 0.95, filter: 'blur(0.4px)', offset: 0.85 },
        { opacity: 1, filter: 'blur(0)' },
      ],
      {
        duration,
        easing: 'cubic-bezier(0.22, 1, 0.36, 1)',
        fill: 'forwards',
      }
    )

    let repeatTimer: ReturnType<typeof setTimeout> | null = null

    animation.onfinish = () => {
      if (repeatEvery && repeatEvery > 0) {
        repeatTimer = setTimeout(() => {
          setTrigger((t) => t + 1)
        }, repeatEvery)
      }
    }

    return () => {
      animation.cancel()
      if (repeatTimer) clearTimeout(repeatTimer)
    }
  }, [hasIntersected, trigger, duration, repeatEvery])

  return (
    <span
      ref={ref}
      className={className}
      style={{
        ...style,
        opacity: hasIntersected ? undefined : 0,
      }}
    >
      {text}
    </span>
  )
}
