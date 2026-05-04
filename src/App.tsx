import { useState, useEffect, useRef, useLayoutEffect } from 'react'
import { flushSync } from 'react-dom'
import Lenis from 'lenis'
import { useRive } from '@rive-app/react-canvas'
import { Sidebar } from './components/Sidebar'
import { BottomBar } from './components/BottomBar'
import { ShotInfoBar } from './components/ShotInfoBar'
import { GlitchReveal } from './components/GlitchReveal'
import { Stars } from './components/Stars'

function useNigerianTime() {
  const [now, setNow] = useState(() => new Date())

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000)
    return () => clearInterval(id)
  }, [])

  const formatter = new Intl.DateTimeFormat('en-NG', {
    timeZone: 'Africa/Lagos',
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })

  const timeFormatter = new Intl.DateTimeFormat('en-NG', {
    timeZone: 'Africa/Lagos',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  })

  return { date: formatter.format(now), time: timeFormatter.format(now) }
}

function App() {
  const { date, time } = useNigerianTime()
  const shotsRef = useRef<HTMLDivElement>(null)
  const testimonialsRef = useRef<HTMLDivElement>(null)
  const [testimonialsInView, setTestimonialsInView] = useState(false)
  const [activeTab, setActiveTab] = useState<'projects' | 'shots' | 'lab'>('shots')
  const [gridCols, setGridCols] = useState<1 | 2>(1)
  const [shotsAnimating, setShotsAnimating] = useState(false)
  const projectsTabRef = useRef<HTMLButtonElement>(null)
  const shotsTabRef = useRef<HTMLButtonElement>(null)
  const labTabRef = useRef<HTMLButtonElement>(null)
  const grayLineRef = useRef<HTMLDivElement>(null)
  const [indicatorStyle, setIndicatorStyle] = useState({ left: 0, width: 90 })

  useLayoutEffect(() => {
    const refs: Record<string, React.RefObject<HTMLButtonElement | null>> = {
      projects: projectsTabRef,
      shots: shotsTabRef,
      lab: labTabRef,
    }
    const update = () => {
      const tabRef = refs[activeTab]
      if (!tabRef?.current || !grayLineRef.current) return
      const tabRect = tabRef.current.getBoundingClientRect()
      const lineRect = grayLineRef.current.getBoundingClientRect()
      if (tabRect.width === 0) return
      setIndicatorStyle({
        left: tabRect.left - lineRect.left,
        width: tabRect.width,
      })
    }
    update()
    const raf1 = requestAnimationFrame(update)
    const raf2 = requestAnimationFrame(() => requestAnimationFrame(update))
    if (typeof document !== 'undefined' && document.fonts) {
      document.fonts.ready.then(update)
    }
    const observer = new ResizeObserver(update)
    if (grayLineRef.current) observer.observe(grayLineRef.current)
    Object.values(refs).forEach((r) => r.current && observer.observe(r.current))
    window.addEventListener('resize', update)
    return () => {
      cancelAnimationFrame(raf1)
      cancelAnimationFrame(raf2)
      observer.disconnect()
      window.removeEventListener('resize', update)
    }
  }, [activeTab])
  const { RiveComponent: TopFireAnimation } = useRive({
    src: '/fire.riv',
    autoplay: true,
    shouldDisableRiveListeners: true,
  })

  useEffect(() => {
    const el = testimonialsRef.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => setTestimonialsInView(entry.isIntersecting),
      { threshold: 0.25 }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    const wrapper = shotsRef.current
    if (!wrapper) return

    const lenis = new Lenis({
      wrapper,
      content: wrapper,
      lerp: 0.12,
      smoothWheel: true,
      wheelMultiplier: 0.9,
      touchMultiplier: 1.5,
      syncTouch: true,
      syncTouchLerp: 0.13,
    })

    let rafId = 0
    const raf = (time: number) => {
      lenis.raf(time)
      rafId = requestAnimationFrame(raf)
    }
    rafId = requestAnimationFrame(raf)

    const onPageWheel = (e: WheelEvent) => {
      const target = e.target as HTMLElement | null
      if (!target) return
      if (target.closest('aside') || target.closest('[data-no-scroll]')) return
      if (wrapper.contains(target)) return
      e.preventDefault()
      const delta = e.deltaMode === 1 ? e.deltaY * 16 : e.deltaY
      const next = wrapper.scrollTop + delta * 0.9
      lenis.scrollTo(next, { immediate: false, duration: 0.1 })
    }
    window.addEventListener('wheel', onPageWheel, { passive: false })

    return () => {
      cancelAnimationFrame(rafId)
      window.removeEventListener('wheel', onPageWheel)
      lenis.destroy()
    }
  }, [])

  return (
    <>
    <main className="min-h-screen px-4 py-6 font-body" style={{ background: 'var(--color-bg-app)' }}>
      <Sidebar />
      <div id="rightside" className="fixed top-6 right-6 bottom-0 left-[392px] flex justify-center">
       <div className="relative w-full h-full max-w-[1024px]">
        <div
          ref={shotsRef}
          id="rightdiv2"
          className={`absolute inset-0 overflow-y-auto pt-[104px] pb-[400px] ${gridCols === 2 ? 'grid grid-cols-2' : 'flex flex-col'} [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]`}
          style={{ rowGap: gridCols === 2 ? '12px' : '12px', columnGap: gridCols === 2 ? '12px' : '0px', gridAutoRows: 'min-content', alignContent: 'start' }}
        >
          {Array.from({ length: 10 }).map((_, i) => {
            const shotSrc = i === 0 ? '/shots/shot-1.jpg' : i === 1 ? '/shots/shot-2.jpg' : i === 2 ? '/shots/shot-3.jpg' : i === 3 ? '/shots/shot-4.jpg' : i === 4 ? '/shots/shot-7.jpg' : null
            return (
            <div
              key={i}
              className="shot-tile group relative w-full shrink-0 aspect-[3/2] max-h-[540px] rounded-[24px] overflow-hidden"
              style={{
                background:
                  'linear-gradient(180deg, rgba(56,61,64,0.2) 0%, rgba(30,32,35,0.2) 35%, rgba(40,43,46,0.2) 65%, rgba(56,61,64,0.2) 100%)',
                boxShadow: 'inset 0 0 0 1px rgba(72,72,79,0.155)',
              }}
            >
              {shotSrc && (
                <img
                  src={shotSrc}
                  alt=""
                  className="absolute inset-0 w-full h-full object-cover"
                />
              )}
              <div className="absolute left-3 right-3 bottom-3 translate-y-[calc(100%+12px)] group-hover:translate-y-0 transition-transform duration-500 ease-[cubic-bezier(0.23,1,0.32,1)]">
                <ShotInfoBar />
              </div>
            </div>
            )
          })}

          <div ref={testimonialsRef} className={`mt-8 shrink-0 ${gridCols === 2 ? 'col-span-2' : ''}`}>
            <div className="flex items-center gap-3 text-[12px] tracking-[-0.02em] uppercase font-mono text-white/50">
              <span>Testimonials</span>
              <span className="w-[5px] h-[5px] rounded-full bg-[#F27313] inline-block" />
              <span>Thoughts</span>
            </div>
            <h2 className="text-[18px] leading-[28px] tracking-[-0.02em] text-white mt-[7px]" style={{ fontWeight: 450 }}>
              <GlitchReveal text="What People Say About My Work" />
            </h2>
            <div id="testimonials-content" className="mt-4 flex flex-col gap-4">
              {/* testimonial entries go here */}
            </div>
          </div>
        </div>
        <div
          aria-hidden
          className="pointer-events-none absolute top-0 left-0 right-0 h-[140px] z-10"
          style={{
            backdropFilter: 'blur(12px)',
            WebkitBackdropFilter: 'blur(12px)',
            background: 'linear-gradient(to bottom, rgba(24,24,27,0.9) 0%, rgba(24,24,27,0.7) 50%, rgba(24,24,27,0.3) 80%, rgba(24,24,27,0) 100%)',
            maskImage: 'linear-gradient(to bottom, black 0%, black 70%, transparent 100%)',
            WebkitMaskImage: 'linear-gradient(to bottom, black 0%, black 70%, transparent 100%)',
          }}
        />
        <div
          aria-hidden
          className="pointer-events-none absolute bottom-0 left-[-16px] right-[-16px] h-[140px] z-10"
          style={{
            backdropFilter: 'blur(28px)',
            WebkitBackdropFilter: 'blur(28px)',
            background: 'linear-gradient(to top, rgba(24,24,27,0.45) 0%, rgba(24,24,27,0.25) 55%, rgba(24,24,27,0) 100%)',
            maskImage: 'linear-gradient(to top, black 0%, black 60%, transparent 100%)',
            WebkitMaskImage: 'linear-gradient(to top, black 0%, black 60%, transparent 100%)',
          }}
        />
       <div className="relative z-20">
        <div id="rightdiv1" className="relative flex items-center justify-between w-full">
          <button
            type="button"
            aria-label="Open menu"
            className="xl:hidden bg-transparent border-0 px-0 flex h-full items-center justify-center focus:outline-none text-white hover:text-white/80 transition-colors"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M15 15L18.379 11.621C18.576 11.424 18.8098 11.2678 19.0672 11.1612C19.3246 11.0547 19.6004 10.9999 19.879 11H20C20.5304 11 21.0391 11.2107 21.4142 11.5858C21.7893 11.9609 22 12.4696 22 13C22 13.5304 21.7893 14.0391 21.4142 14.4142C21.0391 14.7893 20.5304 15 20 15H4C3.46957 15 2.96086 14.7893 2.58579 14.4142C2.21071 14.0391 2 13.5304 2 13C2 12.4696 2.21071 11.9609 2.58579 11.5858C2.96086 11.2107 3.46957 11 4 11H8.515C10.106 11.0001 11.6319 11.6321 12.757 12.757L15 15ZM3 15H21V17C21 17.7956 20.6839 18.5587 20.1213 19.1213C19.5587 19.6839 18.7956 20 18 20H6C5.20435 20 4.44129 19.6839 3.87868 19.1213C3.31607 18.5587 3 17.7956 3 17V15Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M12.0001 4C7.37713 4 3.56813 5.756 3.05813 10C2.99213 10.55 3.44813 11 4.00013 11H20.0001C20.5521 11 21.0081 10.55 20.9421 10C20.4321 5.756 16.6231 4 12.0001 4Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
          <div className="hidden xl:flex gap-6 h-full items-center">
            <button
              ref={shotsTabRef}
              onClick={() => setActiveTab('shots')}
              className={`bg-transparent border-0 px-0 flex h-full items-center focus:outline-none transition-colors ${activeTab === 'shots' ? 'text-white' : 'text-white/50 hover:text-white/80'}`}
            >
              <div className="flex gap-2 items-center">
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M11.125 5.3999C11.125 5.00627 11.1245 4.737 11.1064 4.53955C11.088 4.3375 11.0555 4.28208 11.0454 4.26904C10.976 4.18042 10.8703 4.12734 10.7578 4.125C10.7417 4.12467 10.678 4.13127 10.5044 4.23828C10.3484 4.33448 10.1525 4.48002 9.875 4.68799L9.875 7.31201C10.1525 7.51999 10.3484 7.66551 10.5044 7.76172C10.678 7.86874 10.7417 7.87533 10.7578 7.875C10.8703 7.87265 10.976 7.82003 11.0454 7.73144C11.0553 7.71878 11.0879 7.66361 11.1064 7.46045C11.1245 7.26299 11.125 6.99377 11.125 6.6001L11.125 5.3999ZM6.75 3.625C7.09518 3.625 7.375 3.90482 7.375 4.25C7.375 4.59518 7.09518 4.875 6.75 4.875C6.40482 4.875 6.125 4.59518 6.125 4.25C6.125 3.90482 6.40482 3.625 6.75 3.625ZM0.875002 6.5C0.875002 7.20617 0.875205 7.71328 0.907717 8.11133C0.939883 8.50502 1.00163 8.75913 1.10645 8.96484C1.31018 9.36467 1.63533 9.68983 2.03516 9.89355C2.24087 9.99837 2.49498 10.0601 2.88867 10.0923C3.28672 10.1248 3.79383 10.125 4.5 10.125L5.5 10.125C6.20618 10.125 6.71328 10.1248 7.11133 10.0923C7.50502 10.0601 7.75913 9.99837 7.96485 9.89355C8.36467 9.68983 8.68983 9.36467 8.89356 8.96484C8.99837 8.75913 9.06012 8.50502 9.09229 8.11133C9.1248 7.71328 9.125 7.20617 9.125 6.5L9.125 5.5C9.125 4.79383 9.1248 4.28672 9.09229 3.88867C9.06012 3.49498 8.99837 3.24087 8.89356 3.03516C8.68983 2.63533 8.36467 2.31017 7.96485 2.10645C7.75913 2.00163 7.50502 1.93988 7.11133 1.90771C6.71328 1.8752 6.20618 1.875 5.5 1.875L4.5 1.875C3.79383 1.875 3.28672 1.8752 2.88867 1.90771C2.49498 1.93988 2.24087 2.00163 2.03516 2.10645C1.63533 2.31017 1.31018 2.63533 1.10645 3.03516C1.00163 3.24087 0.939883 3.49498 0.907717 3.88867C0.875205 4.28672 0.875002 4.79383 0.875002 5.5L0.875002 6.5ZM11.875 6.6001C11.875 6.97883 11.8754 7.28914 11.8535 7.52881C11.8322 7.76273 11.7853 8.00289 11.6357 8.19385C11.4276 8.45961 11.111 8.61797 10.7734 8.625C10.5309 8.63004 10.3108 8.52321 10.1108 8.3999C10.0265 8.34791 9.93517 8.28534 9.83545 8.21435C9.79821 8.6357 9.72385 8.98661 9.56153 9.30517C9.28589 9.84613 8.84614 10.2859 8.30518 10.5615C7.97611 10.7292 7.61244 10.8039 7.17237 10.8398C6.7367 10.8754 6.19378 10.875 5.5 10.875L4.5 10.875C3.80622 10.875 3.2633 10.8754 2.82764 10.8398C2.38757 10.8039 2.02389 10.7292 1.69483 10.5615C1.15387 10.2859 0.714113 9.84613 0.438479 9.30517C0.270812 8.97611 0.196114 8.61243 0.160159 8.17236C0.124576 7.7367 0.125002 7.19378 0.125002 6.5L0.125002 5.5C0.125002 4.80622 0.124576 4.2633 0.160159 3.82764C0.196114 3.38757 0.270812 3.02389 0.438479 2.69482C0.714113 2.15387 1.15387 1.71411 1.69483 1.43848C2.02389 1.27081 2.38757 1.19611 2.82764 1.16016C3.2633 1.12457 3.80622 1.125 4.5 1.125L5.5 1.125C6.19379 1.125 6.7367 1.12457 7.17237 1.16016C7.61244 1.19611 7.97611 1.27081 8.30518 1.43848C8.84614 1.71411 9.28589 2.15387 9.56153 2.69482C9.72378 3.01327 9.7982 3.36402 9.83545 3.78516C9.93506 3.71425 10.0266 3.65204 10.1108 3.6001C10.3108 3.4768 10.5309 3.37045 10.7734 3.37549C11.111 3.38252 11.4276 3.54078 11.6357 3.80664C11.7853 3.99764 11.8322 4.23773 11.8535 4.47168C11.8754 4.71131 11.875 5.0213 11.875 5.3999L11.875 6.6001Z" fill="currentColor" />
                </svg>
                <span className="text-[12px] font-normal leading-[20px] tracking-[-0.18px] whitespace-nowrap">Design Shots</span>
              </div>
            </button>
            <button
              ref={projectsTabRef}
              onClick={() => setActiveTab('projects')}
              className={`bg-transparent border-0 px-0 flex h-full items-center justify-center focus:outline-none transition-colors ${activeTab === 'projects' ? 'text-white' : 'text-white/50 hover:text-white/80'}`}
            >
              <div className="flex gap-2 items-center">
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M10.5 9.375C10.7071 9.375 10.875 9.54289 10.875 9.75C10.875 9.95711 10.7071 10.125 10.5 10.125C9.51312 10.125 8.80153 10.1872 8.16113 10.3618C7.5247 10.5354 6.93687 10.8261 6.20801 11.312C6.08205 11.396 5.91796 11.396 5.79199 11.312C5.06313 10.8261 4.4753 10.5354 3.83887 10.3618C3.19847 10.1872 2.48688 10.125 1.5 10.125C1.29289 10.125 1.125 9.9571 1.125 9.75C1.125 9.54289 1.29289 9.375 1.5 9.375C2.5131 9.375 3.30154 9.43784 4.03613 9.63818C4.70756 9.8213 5.31557 10.1147 6 10.5527C6.68443 10.1147 7.29244 9.8213 7.96387 9.63818C8.69846 9.43785 9.4869 9.375 10.5 9.375ZM10.625 1.37549C9.69626 1.37719 8.99801 1.39094 8.35645 1.50342C7.69879 1.61872 7.09438 1.84064 6.375 2.28027L6.375 8.34375C7.39119 7.79683 8.26741 7.62646 9.38281 7.57568C9.6812 7.5621 9.88432 7.55232 10.0391 7.53369C10.1919 7.51529 10.2609 7.49148 10.3013 7.46924C10.4189 7.40448 10.5012 7.31825 10.5605 7.19775C10.582 7.15408 10.6021 7.08666 10.6133 6.94483C10.6247 6.79914 10.625 6.60987 10.625 6.32861L10.625 1.37549ZM1.375 6.32861C1.375 6.60987 1.37529 6.79913 1.38672 6.94482C1.39786 7.08665 1.41796 7.15408 1.43945 7.19775C1.49879 7.31825 1.58106 7.40448 1.69873 7.46924C1.73915 7.49148 1.80811 7.51529 1.96094 7.53369C2.11568 7.55232 2.3188 7.5621 2.61719 7.57568C3.7326 7.62646 4.60882 7.79683 5.625 8.34375L5.625 2.28027C4.90563 1.84063 4.30121 1.61872 3.64356 1.50342C3.002 1.39094 2.30375 1.37719 1.375 1.37549L1.375 6.32861ZM11.375 6.32861C11.375 6.59791 11.3751 6.82158 11.3608 7.00342C11.3463 7.18912 11.3148 7.36406 11.2334 7.5293C11.1062 7.78762 10.9154 7.98761 10.6631 8.12647C10.4995 8.21649 10.3198 8.25533 10.1289 8.27832C9.93993 8.30108 9.70397 8.31165 9.41699 8.32471C8.20243 8.37999 7.35037 8.5776 6.20264 9.31543C6.07916 9.39476 5.92085 9.39476 5.79736 9.31543C4.64963 8.5776 3.79758 8.37999 2.58301 8.32471C2.29604 8.31164 2.06007 8.30108 1.87109 8.27832C1.68019 8.25533 1.50051 8.21649 1.33691 8.12646C1.08465 7.98761 0.893839 7.78762 0.766602 7.5293C0.685229 7.36405 0.653741 7.18912 0.639161 7.00342C0.624895 6.82157 0.625001 6.59791 0.625001 6.32861L0.625002 1C0.625002 0.900544 0.664539 0.80519 0.734865 0.734864C0.805192 0.664537 0.900546 0.625 1 0.625C2.10127 0.625001 2.97033 0.623945 3.77295 0.764649C4.5272 0.896888 5.21552 1.1523 6 1.6294C6.78448 1.1523 7.4728 0.896889 8.22705 0.76465C9.02968 0.623946 9.89873 0.625002 11 0.625002C11.2071 0.625002 11.375 0.792895 11.375 1L11.375 6.32861Z" fill="currentColor" />
                </svg>
                <span className="text-[12px] font-normal leading-[20px] tracking-[-0.18px] whitespace-nowrap">My Projects</span>
              </div>
            </button>
            <button
              ref={labTabRef}
              onClick={() => setActiveTab('lab')}
              className={`bg-transparent border-0 px-0 flex h-full items-center focus:outline-none transition-colors ${activeTab === 'lab' ? 'text-white' : 'text-white/50 hover:text-white/80'}`}
            >
              <div className="flex gap-2 items-center">
                <svg width="12" height="12.058" viewBox="0 0 12 12.058" fill="#FF7043" xmlns="http://www.w3.org/2000/svg">
                  <path d="M11.5189 4.71955L11.9409 4.96069V5.14068L11.8203 5.56181L6.70737 6.76491L6.22682 5.57042L11.5189 4.71955Z" />
                  <path d="M9.6068 1.18269L10.195 1.30584L10.3517 1.49875L10.5007 1.95949L10.4387 2.25402L7.00855 6.94499L5.86488 5.80218L9.02807 1.65118L9.6068 1.18269Z" />
                  <path d="M6.64757 0.449366L7.00842 0.208229L7.30898 0.328798L7.60954 0.750787L6.78537 5.70098L6.22558 5.32119L5.98531 4.65892L6.4073 0.929917L6.64757 0.449366Z" />
                  <path d="M2.78935 0.528843L3.15966 0.0551813L3.40166 6.42793e-05L3.88221 0.0698217L4.11904 0.255842L5.84489 4.0813L6.4684 5.89844L5.7381 6.30407L2.95556 1.25398L2.78935 0.528843Z" />
                  <path d="M0.99402 3.15616L0.873451 2.67389L1.23516 2.25362L1.65542 2.3139H1.77599L4.3019 4.17841L5.08387 4.77953L6.1664 5.62178L5.56528 6.64403L5.02359 6.2229L4.66274 5.86206L1.17487 3.39644L0.99402 3.15616Z" />
                  <path d="M0.27214 6.28322L0 5.9818V5.71482L0.27214 5.62181L3.33974 5.80267L6.3462 6.04294L6.24889 6.64148L0.513277 6.3435L0.27214 6.28322Z" />
                  <path d="M2.07657 9.4138H1.47545L1.23604 9.13821V8.80923L2.25743 8.08754L6.40842 5.44537L6.82783 6.16276L2.07657 9.4138Z" />
                  <path d="M3.21953 11.0949L2.97839 11.1552L2.61841 10.9743L2.6787 10.6729L6.22685 5.98278L6.7074 6.64419L4.06179 10.1321L3.21953 11.0949Z" />
                  <path d="M6.22691 11.6962L6.04606 11.9373L5.68521 12.0579L5.38465 11.8167L5.2038 11.455L6.10634 6.58494L6.64804 6.64522L6.22691 11.6962Z" />
                  <path d="M9.29352 10.3733V10.8538L9.23324 11.0347L8.99297 11.1552L8.57184 11.0984L5.68164 6.79583L6.8279 5.92257L7.78986 7.6665L7.88029 8.29777L9.29352 10.3733Z" />
                  <path d="M10.6773 9.65176L10.7376 9.95232L10.5567 10.1926L10.3759 10.1323L9.35365 9.41063L7.79057 8.02753L6.58747 7.18528L6.94831 6.04332L7.54943 6.40417L7.91113 7.06557L10.6773 9.65176Z" />
                  <path d="M9.89534 6.58371L11.399 6.70428L11.7598 6.94541L12.0001 7.3054V7.56548L11.3387 7.84709L7.97056 7.00484L6.58747 6.94455L6.94831 5.68203L7.91027 6.40372L9.89534 6.58371Z" />
                </svg>
                <span className="text-[12px] font-normal leading-[20px] tracking-[-0.18px] whitespace-nowrap">Claude Lab</span>
                <span
                  className="shrink-0 flex items-center gap-1 h-5 pl-1 pr-2 rounded-[999px] bg-[#D85A2C]"
                >
                  <svg width="11" height="13" viewBox="0 0 11 13" fill="none" xmlns="http://www.w3.org/2000/svg" className="bell-animate shrink-0">
                    <path fillRule="evenodd" clipRule="evenodd" d="M6.83458 10.7637H3.49219C3.53027 11.6537 4.26392 12.3637 5.16339 12.3637C6.06284 12.3637 6.79648 11.6537 6.83458 10.7637Z" fill="white" />
                    <path fillRule="evenodd" clipRule="evenodd" d="M5.16367 1.01807C2.79385 1.01807 0.872733 2.93918 0.872733 5.309V8.77237C0.36905 8.91483 0 9.37793 0 9.92722C0 10.1482 0.179085 10.3272 0.400003 10.3272H10.0728C10.2937 10.3272 10.4728 10.1482 10.4728 9.92722C10.4728 9.37793 10.1038 8.91483 9.60006 8.77237V5.309C9.60006 2.93918 7.67894 1.01807 5.30913 1.01807H5.16367Z" fill="white" />
                    <path d="M8.29085 0.36377C9.29501 0.36377 10.109 1.1778 10.109 2.18196C10.109 3.18612 9.29501 4.00016 8.29085 4.00016C7.28669 4.00016 6.47266 3.18612 6.47266 2.18196C6.47266 1.1778 7.28669 0.36377 8.29085 0.36377Z" fill="#FF666B" />
                    <path d="M8.29085 0.36377C9.29501 0.36377 10.109 1.1778 10.109 2.18196C10.109 3.18612 9.29501 4.00016 8.29085 4.00016C7.28669 4.00016 6.47266 3.18612 6.47266 2.18196C6.47266 1.1778 7.28669 0.36377 8.29085 0.36377Z" stroke="#4CDC51" strokeWidth="0.727277" />
                  </svg>
                  <span className="text-[12px] leading-none text-white whitespace-nowrap font-medium">2 new</span>
                </span>
              </div>
            </button>
          </div>
          <div className="flex items-center gap-3 py-2">
            <div className="hidden xl:flex gap-3 h-full items-center">
              <span className="font-mono font-medium text-[12px] leading-[28px] tracking-[-0.24px] uppercase text-white/50 whitespace-nowrap">{date}</span>
              <span className="w-[5px] h-[5px] rounded-full bg-[#F27313] inline-block" />
              <span className="font-mono font-medium text-[12px] leading-[28px] tracking-[-0.24px] uppercase text-white/50 whitespace-nowrap">{time}</span>
            </div>
            <button
              className="btn-sidebar group rounded-full pl-3 pr-4 h-6 text-[12px] font-body text-white flex items-center"
              style={{
                background: 'rgba(255,255,255,0.08)',
                border: '0.5px solid rgba(255,255,255,0.05)',
                boxShadow: '0 4px 4px 0 rgba(0,0,0,0.08)',
              }}
            >
              <div className="overflow-hidden flex items-center justify-center w-0 h-5 group-hover:w-5 group-hover:mr-1.5 transition-[width,margin] duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)]">
                <div className="w-5 h-5 shrink-0">
                  <TopFireAnimation />
                </div>
              </div>
              <span className="whitespace-nowrap">Chat me up</span>
            </button>
          </div>
        </div>
        <div
          ref={grayLineRef}
          className="relative h-px w-full bg-[#252525]"
        >
          <span
            className="hidden xl:block absolute top-0 h-px bg-[#ff7043] transition-all duration-300 ease-out"
            style={{ left: indicatorStyle.left, width: indicatorStyle.width }}
          />
        </div>
       </div>
        <div className={`relative z-20 mt-2 flex items-center justify-between origin-top transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)] ${testimonialsInView ? 'opacity-0 scale-90 pointer-events-none' : 'opacity-100 scale-100'}`}>
          <h2 className="text-[18px] leading-[28px] tracking-[-0.36px] text-white font-medium">
            Design Shots by Yours Truly
          </h2>
          <button
            type="button"
            onClick={() => {
              if (shotsAnimating) return
              const tiles = Array.from(
                document.querySelectorAll<HTMLDivElement>('#rightdiv2 .shot-tile')
              )
              const oldRects = new Map<HTMLDivElement, DOMRect>()
              tiles.forEach((t) => oldRects.set(t, t.getBoundingClientRect()))

              setShotsAnimating(true)
              flushSync(() => {
                setGridCols((g) => (g === 1 ? 2 : 1))
              })

              const easing = 'cubic-bezier(0.22, 1, 0.36, 1)'
              const duration = 520
              let remaining = tiles.length
              if (remaining === 0) {
                setShotsAnimating(false)
                return
              }

              tiles.forEach((tile) => {
                const oldRect = oldRects.get(tile)
                if (!oldRect) {
                  remaining--
                  if (remaining === 0) setShotsAnimating(false)
                  return
                }
                const newRect = tile.getBoundingClientRect()
                const dx = oldRect.left - newRect.left
                const dy = oldRect.top - newRect.top
                const sx = oldRect.width / Math.max(newRect.width, 1)
                const sy = oldRect.height / Math.max(newRect.height, 1)

                tile.style.transformOrigin = '0 0'
                tile.style.transition = 'none'
                tile.style.transform = `translate(${dx}px, ${dy}px) scale(${sx}, ${sy})`
                void tile.offsetWidth

                tile.style.transition = `transform ${duration}ms ${easing}`
                tile.style.transform = ''

                const onEnd = (e: TransitionEvent) => {
                  if (e.propertyName !== 'transform') return
                  tile.removeEventListener('transitionend', onEnd)
                  tile.style.transition = ''
                  tile.style.transform = ''
                  tile.style.transformOrigin = ''
                  remaining--
                  if (remaining === 0) setShotsAnimating(false)
                }
                tile.addEventListener('transitionend', onEnd)
              })
            }}
            aria-label={`Switch to ${gridCols === 1 ? 'two columns' : 'one column'}`}
            className="hidden xl:flex items-center -my-5 -mr-3 bg-transparent border-0 p-0 cursor-pointer focus:outline-none leading-none"
          >
          <svg width="88" height="80" viewBox="0 0 88 80" fill="none" xmlns="http://www.w3.org/2000/svg">
            <g filter="url(#filter0_d_638_4549)">
              <rect x="20" y="16" width="48" height="40" rx="20" fill="url(#paint0_linear_638_4549)" shapeRendering="crispEdges"/>
              <rect x="20.5" y="16.5" width="47" height="39" rx="19.5" stroke="url(#paint1_linear_638_4549)" shapeRendering="crispEdges"/>
              <text x="32" y="40" fontSize="12" fontFamily="inherit" fontWeight="500" fill="white" textAnchor="middle">{gridCols}</text>
              <path d="M58.4435 39.5527C58.6904 39.4294 58.9906 39.5297 59.1141 39.7766C59.2374 40.0236 59.137 40.3238 58.8901 40.4472L55.0861 42.3496C54.0627 42.8612 53.4655 43.1646 52.8302 43.2838C52.2818 43.3867 51.7185 43.3867 51.1701 43.2838C50.5348 43.1646 49.9376 42.8612 48.9142 42.3496L45.1102 40.4472C44.8633 40.3238 44.7629 40.0236 44.8862 39.7766C45.0097 39.5297 45.3098 39.4294 45.5568 39.5527L49.3615 41.455C50.4369 41.9927 50.8895 42.2141 51.355 42.3014C51.7813 42.3813 52.219 42.3813 52.6453 42.3014C53.1108 42.2141 53.5634 41.9927 54.6388 41.455L58.4435 39.5527ZM58.4435 36.2193C58.6904 36.096 58.9906 36.1964 59.1141 36.4433C59.2374 36.6902 59.137 36.9904 58.8901 37.1139L55.0861 39.0162C54.0627 39.5279 53.4655 39.8312 52.8302 39.9505C52.2818 40.0534 51.7185 40.0534 51.1701 39.9505C50.5348 39.8312 49.9376 39.5279 48.9142 39.0162L45.1102 37.1139C44.8633 36.9904 44.7629 36.6902 44.8862 36.4433C45.0097 36.1964 45.3098 36.096 45.5568 36.2193L49.3615 38.1217C50.4369 38.6594 50.8895 38.8807 51.355 38.968C51.7813 39.048 52.219 39.048 52.6453 38.968C53.1108 38.8807 53.5634 38.6594 54.6388 38.1217L58.4435 36.2193ZM51.4162 28.5357C51.8021 28.4633 52.1982 28.4633 52.5841 28.5357C53.036 28.6205 53.458 28.8369 54.1317 29.1738L56.4077 30.3111C57.0128 30.6137 57.498 30.8558 57.8537 31.0761C58.2029 31.2924 58.512 31.5367 58.6753 31.8808C58.9111 32.378 58.9111 32.9552 58.6753 33.4524C58.512 33.7966 58.2029 34.0408 57.8537 34.2571C57.498 34.4774 57.0128 34.7195 56.4077 35.0221L54.1317 36.1594C53.458 36.4963 53.036 36.7127 52.5841 36.7975C52.1982 36.8699 51.8021 36.8699 51.4162 36.7975C50.9643 36.7127 50.5423 36.4963 49.8686 36.1594L47.5926 35.0221C46.9875 34.7195 46.5023 34.4774 46.1466 34.2571C45.7974 34.0408 45.4883 33.7966 45.325 33.4524C45.0892 32.9552 45.0892 32.378 45.325 31.8808C45.4883 31.5367 45.7974 31.2924 46.1466 31.0761C46.5023 30.8558 46.9875 30.6137 47.5926 30.3111L49.8686 29.1738C50.5423 28.8369 50.9643 28.6205 51.4162 28.5357ZM52.3999 29.5188C52.1358 29.4693 51.8645 29.4693 51.6004 29.5188C51.3186 29.5717 51.041 29.7051 50.3159 30.0676L48.0399 31.2057C47.4169 31.5171 46.981 31.7358 46.6733 31.9264C46.3596 32.1207 46.2626 32.2378 46.2287 32.3092C46.1215 32.5352 46.1215 32.798 46.2287 33.024C46.2626 33.0954 46.3596 33.2125 46.6733 33.4068C46.981 33.5974 47.4169 33.8161 48.0399 34.1275L50.3159 35.2656C51.041 35.6281 51.3186 35.7615 51.6004 35.8144C51.8645 35.8639 52.1358 35.8639 52.3999 35.8144C52.6817 35.7615 52.9593 35.6281 53.6844 35.2656L55.9604 34.1275C56.5834 33.8161 57.0193 33.5974 57.327 33.4068C57.6407 33.2125 57.7377 33.0954 57.7716 33.024C57.8788 32.798 57.8788 32.5352 57.7716 32.3092C57.7377 32.2378 57.6407 32.1207 57.327 31.9264C57.0193 31.7358 56.5834 31.5171 55.9604 31.2057L53.6844 30.0676C52.9593 29.7051 52.6817 29.5717 52.3999 29.5188Z" fill="white"/>
            </g>
            <defs>
              <filter id="filter0_d_638_4549" x="0" y="0" width="88" height="80" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
                <feFlood floodOpacity="0" result="BackgroundImageFix"/>
                <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
                <feOffset dy="4"/>
                <feGaussianBlur stdDeviation="10"/>
                <feComposite in2="hardAlpha" operator="out"/>
                <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0"/>
                <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_638_4549"/>
                <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_638_4549" result="shape"/>
              </filter>
              <linearGradient id="paint0_linear_638_4549" x1="44" y1="16" x2="44" y2="56" gradientUnits="userSpaceOnUse">
                <stop stopColor="#191919"/>
                <stop offset="1" stopColor="#262626"/>
              </linearGradient>
              <linearGradient id="paint1_linear_638_4549" x1="44" y1="16" x2="44" y2="56" gradientUnits="userSpaceOnUse">
                <stop stopColor="#333131"/>
                <stop offset="1" stopColor="#191919"/>
              </linearGradient>
            </defs>
          </svg>
          </button>
        </div>
        <div id="rightdiv3" className="absolute bottom-8 left-0 right-0 flex justify-center pointer-events-none z-30">
          <div className="pointer-events-auto">
            <BottomBar />
          </div>
        </div>
       </div>
      </div>
    </main>
    <Stars />
    </>
  )
}

export default App
