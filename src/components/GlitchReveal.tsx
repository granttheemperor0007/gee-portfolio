import { useEffect, useRef, useState } from 'react'

const SCRAMBLE_CHARS = '!<>-_\\/[]{}—=+*^?#$%&'

const scramble = (text: string, chars: string) =>
  text
    .split('')
    .map((c) => (c === ' ' ? ' ' : chars[Math.floor(Math.random() * chars.length)]))
    .join('')

type Props = {
  text: string
  className?: string
  style?: React.CSSProperties
  speed?: number
  charsPerStep?: number
  repeatEvery?: number
  scrambleChars?: string
}

export function GlitchReveal({
  text,
  className,
  style,
  speed = 28,
  charsPerStep = 0.5,
  repeatEvery,
  scrambleChars = SCRAMBLE_CHARS,
}: Props) {
  const ref = useRef<HTMLSpanElement>(null)
  const [trigger, setTrigger] = useState(0)
  const wasInViewRef = useRef(false)
  const [display, setDisplay] = useState(() => scramble(text, scrambleChars))
  const repeatTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !wasInViewRef.current) {
          wasInViewRef.current = true
          setTrigger((t) => t + 1)
        } else if (!entry.isIntersecting && wasInViewRef.current) {
          wasInViewRef.current = false
          setDisplay(scramble(text, scrambleChars))
          if (repeatTimerRef.current) {
            clearTimeout(repeatTimerRef.current)
            repeatTimerRef.current = null
          }
        }
      },
      { threshold: 0.4 }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [text, scrambleChars])

  useEffect(() => {
    if (trigger === 0) return

    let revealedFloat = 0
    const total = text.length
    setDisplay(scramble(text, scrambleChars))

    const interval = setInterval(() => {
      revealedFloat += charsPerStep
      const revealed = Math.floor(revealedFloat)

      const next = text
        .split('')
        .map((char, i) => {
          if (char === ' ') return ' '
          if (i < revealed) return char
          return scrambleChars[Math.floor(Math.random() * scrambleChars.length)]
        })
        .join('')

      setDisplay(next)

      if (revealed >= total) {
        setDisplay(text)
        clearInterval(interval)
        if (repeatEvery && repeatEvery > 0) {
          if (repeatTimerRef.current) clearTimeout(repeatTimerRef.current)
          repeatTimerRef.current = setTimeout(() => {
            setTrigger((t) => t + 1)
          }, repeatEvery)
        }
      }
    }, speed)

    return () => {
      clearInterval(interval)
      if (repeatTimerRef.current) {
        clearTimeout(repeatTimerRef.current)
        repeatTimerRef.current = null
      }
    }
  }, [trigger, text, speed, charsPerStep, repeatEvery, scrambleChars])

  return (
    <span ref={ref} className={className} style={style}>
      {display}
    </span>
  )
}
