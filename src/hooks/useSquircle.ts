import { useRef, useEffect, useCallback } from 'react'
import { getSvgPath } from 'figma-squircle'

export function useSquircle(cornerRadius: number, cornerSmoothing = 0.6) {
  const ref = useRef<HTMLDivElement>(null)

  const updateClipPath = useCallback(() => {
    const el = ref.current
    if (!el) return

    const { width, height } = el.getBoundingClientRect()
    if (width === 0 || height === 0) return

    const path = getSvgPath({
      width,
      height,
      cornerRadius,
      cornerSmoothing,
    })

    el.style.clipPath = `path('${path}')`
  }, [cornerRadius, cornerSmoothing])

  useEffect(() => {
    updateClipPath()

    const observer = new ResizeObserver(updateClipPath)
    if (ref.current) observer.observe(ref.current)

    return () => observer.disconnect()
  }, [updateClipPath])

  return ref
}
