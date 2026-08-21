import { useState, useEffect, useRef, useLayoutEffect } from 'react'
import { flushSync } from 'react-dom'
import Lenis from 'lenis'
import { useRive } from '@rive-app/react-canvas'
import { Sidebar } from './components/Sidebar'
import { BottomBar } from './components/BottomBar'
import { Stars } from './components/Stars'
import { ClaudeLab } from './components/ClaudeLab'
import { ShotTile } from './components/ShotTile'
import type { Shot } from './components/ShotTile'
import { DAILY_BUILDS } from './data/daily-builds'
import { useMediaQuery } from './hooks/useMediaQuery'

// Badge on the Lab tab — derived so shipping a build can't leave it stale.
const SHIPPED_BUILDS = DAILY_BUILDS.filter((b) => !!b.vercelUrl).length

const DESIGN_SHOTS: Shot[] = [
  { src: '/shots/rive-switcher.mp4', title: 'Rive Game Character Switcher', video: true, sound: true, poster: '/shots/rive-switcher-poster.jpg' },
  { src: '/shots/car-world.mp4', title: 'Car World Driving Sim', video: true, sound: true, poster: '/shots/car-world-poster.jpg' },
  { src: '/shots/shot-taskbox.jpg', title: 'Task-box Board' },
  { src: '/shots/shot-pricerbox.jpg', title: 'Pricer-box' },
  { src: '/shots/shot-9.jpg', title: 'Raychee Daily Planner' },
  { src: '/shots/shot-1.jpg', title: 'Temperature Corner' },
  { src: '/shots/shot-2.jpg', title: 'Nearest Care Finder' },
  { src: '/shots/shot-3.jpg', title: 'CosmoStation Wallet' },
  { src: '/shots/wed.mp4', title: 'Wedding', video: true, poster: '/shots/wed-poster.jpg' },
  { src: '/shots/shot-4.jpg', title: 'Stake-Fi Lending' },
  { src: '/shots/shot-7.jpg', title: 'Stakeron Staking' },
  { src: '/shots/shot-8.jpg', title: 'Origami Security Settings' },
]

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
  const isDesktop = useMediaQuery('(min-width: 1280px)')
  const shotsRef = useRef<HTMLDivElement>(null)
  const lenisRef = useRef<Lenis | null>(null)
  const [activeTab, setActiveTab] = useState<'projects' | 'shots' | 'lab'>('shots')
  const [gridCols, setGridCols] = useState<1 | 2>(1)
  const [expandedVideo, setExpandedVideo] = useState<string | null>(null)
  const [lightboxShown, setLightboxShown] = useState(false)
  const [videoMuted, setVideoMuted] = useState(false)
  const expandedShot = DESIGN_SHOTS.find((s) => s.src === expandedVideo)
  const [shotsAnimating, setShotsAnimating] = useState(false)
  const projectsTabRef = useRef<HTMLButtonElement>(null)
  const shotsTabRef = useRef<HTMLButtonElement>(null)
  const labTabRef = useRef<HTMLButtonElement>(null)
  const mShotsTabRef = useRef<HTMLButtonElement>(null)
  const mLabTabRef = useRef<HTMLButtonElement>(null)
  const mProjectsTabRef = useRef<HTMLButtonElement>(null)
  const grayLineRef = useRef<HTMLDivElement>(null)
  const [indicatorStyle, setIndicatorStyle] = useState({ left: 0, width: 90 })

  useLayoutEffect(() => {
    const refs: Record<string, React.RefObject<HTMLButtonElement | null>> = isDesktop
      ? { projects: projectsTabRef, shots: shotsTabRef, lab: labTabRef }
      : { projects: mProjectsTabRef, shots: mShotsTabRef, lab: mLabTabRef }
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
  }, [activeTab, isDesktop])
  const { RiveComponent: TopFireAnimation } = useRive({
    src: '/fire.riv',
    autoplay: true,
    shouldDisableRiveListeners: true,
  })

  useEffect(() => {
    // Lenis hijacks scroll on the fixed desktop content pane. On mobile the
    // page scrolls natively, so keep it off there to avoid fighting touch.
    if (!isDesktop) return
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
    lenisRef.current = lenis

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
      lenisRef.current = null
    }
  }, [isDesktop])

  // Switching tabs swaps content but keeps the pane's scroll offset, so a new tab
  // could open mid-page. Reset to the top — and keep it pinned until the visitor
  // actually scrolls, because embedded Lab iframes autofocus on load and would
  // otherwise drag the pane down to themselves (e.g. the K/D Tracker build).
  useEffect(() => {
    const wrapper = shotsRef.current
    const toTop = () => {
      if (lenisRef.current) lenisRef.current.scrollTo(0, { immediate: true })
      else if (wrapper) wrapper.scrollTop = 0
    }
    toTop()
    let pinned = true
    const release = () => { pinned = false }
    const repin = () => { if (pinned) toTop() }
    const passive = { passive: true } as AddEventListenerOptions
    window.addEventListener('wheel', release, passive)
    window.addEventListener('touchstart', release, passive)
    window.addEventListener('keydown', release)
    wrapper?.addEventListener('scroll', repin, passive)
    const auto = window.setTimeout(release, 3000)
    return () => {
      window.removeEventListener('wheel', release)
      window.removeEventListener('touchstart', release)
      window.removeEventListener('keydown', release)
      wrapper?.removeEventListener('scroll', repin)
      window.clearTimeout(auto)
    }
  }, [activeTab])

  const closeVideo = () => {
    setLightboxShown(false)
    window.setTimeout(() => setExpandedVideo(null), 320)
  }

  // Fade + scale the lightbox in on the frame after it mounts, and let Escape close it.
  useEffect(() => {
    if (!expandedVideo) return
    const raf = requestAnimationFrame(() => setLightboxShown(true))
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeVideo()
    }
    window.addEventListener('keydown', onKey)
    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('keydown', onKey)
    }
  }, [expandedVideo])

  return (
    <>
    <main className="min-h-screen px-4 py-6 font-body" style={{ background: 'var(--color-bg-app)' }}>
      <Sidebar />
      <div id="rightside" className="relative w-full xl:w-auto max-w-[720px] mx-auto flex justify-center xl:max-w-none xl:mx-0 xl:fixed xl:top-6 xl:right-6 xl:bottom-0 xl:left-[392px]">
       <div className="relative flex flex-col w-full h-auto max-w-full xl:block xl:h-full xl:max-w-[1024px]">
        <div
          ref={shotsRef}
          id="rightdiv2"
          className={`relative order-2 flex flex-col overflow-visible pt-4 pb-32 xl:absolute xl:inset-0 xl:overflow-y-auto xl:pt-[104px] xl:pb-[400px] ${activeTab === 'shots' && gridCols === 2 ? 'xl:grid xl:grid-cols-2' : 'xl:flex xl:flex-col'} [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]`}
          style={{ rowGap: activeTab === 'shots' && gridCols === 2 ? '12px' : '12px', columnGap: activeTab === 'shots' && gridCols === 2 ? '12px' : '0px', gridAutoRows: 'min-content', alignContent: 'start' }}
        >
          {activeTab === 'lab' && <ClaudeLab />}
          {activeTab === 'projects' && (
            <div
              className="group relative w-full shrink-0 aspect-[4/3] max-h-[664px] rounded-[24px] overflow-hidden"
              style={{
                background:
                  'linear-gradient(180deg, rgba(56,61,64,0.2) 0%, rgba(30,32,35,0.2) 35%, rgba(40,43,46,0.2) 65%, rgba(56,61,64,0.2) 100%)',
                boxShadow: 'inset 0 0 0 1px rgba(72,72,79,0.155)',
              }}
            >
              <iframe
                src="https://termii-web.vercel.app/"
                title="Termii"
                loading="lazy"
                sandbox="allow-scripts allow-same-origin allow-popups allow-popups-to-escape-sandbox allow-forms allow-modals"
                className="absolute top-0 left-0 origin-top-left w-[calc(100%/0.35)] h-[calc(100%/0.35)] scale-[0.35] xl:w-[calc(100%/0.6)] xl:h-[calc(100%/0.6)] xl:scale-[0.6]"
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
                  <span className="text-[14px] leading-[20px] text-white truncate">Termii</span>
                  <a
                    href="https://termii-web.vercel.app/"
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
          )}
          {activeTab === 'shots' && DESIGN_SHOTS.map((shot, i) => (
            <ShotTile
              key={shot.src}
              shot={shot}
              index={i}
              onExpand={() => { setVideoMuted(false); setExpandedVideo(shot.src) }}
            />
          ))}

        </div>
        <div
          aria-hidden
          className="hidden xl:block pointer-events-none absolute top-0 left-0 right-0 h-[140px] z-10"
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
          className="hidden xl:block pointer-events-none absolute bottom-0 left-[-16px] right-[-16px] h-[140px] z-10"
          style={{
            backdropFilter: 'blur(28px)',
            WebkitBackdropFilter: 'blur(28px)',
            background: 'linear-gradient(to top, rgba(24,24,27,0.45) 0%, rgba(24,24,27,0.25) 55%, rgba(24,24,27,0) 100%)',
            maskImage: 'linear-gradient(to top, black 0%, black 60%, transparent 100%)',
            WebkitMaskImage: 'linear-gradient(to top, black 0%, black 60%, transparent 100%)',
          }}
        />
       <div className="relative z-20 order-1">
        <div className="xl:hidden mt-1 h-px w-full bg-[#252525]" />
        <div id="rightdiv1" className="relative flex items-center justify-between w-full gap-3 mt-3 xl:mt-0">
          <div className="flex xl:hidden min-w-0 items-center gap-4 overflow-x-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
            <button
              ref={mShotsTabRef}
              type="button"
              onClick={() => setActiveTab('shots')}
              className={`shrink-0 bg-transparent px-0 text-[13px] font-medium leading-[20px] tracking-[-0.015em] whitespace-nowrap transition-colors ${activeTab === 'shots' ? 'text-white' : 'text-white/50'}`}
            >
              Design Shots
            </button>
            <button
              ref={mLabTabRef}
              type="button"
              onClick={() => setActiveTab('lab')}
              className={`shrink-0 flex items-center gap-1 bg-transparent px-0 text-[13px] font-medium leading-[20px] tracking-[-0.015em] whitespace-nowrap transition-colors ${activeTab === 'lab' ? 'text-white' : 'text-white/50'}`}
            >
              Claude Lab
              <span className="shrink-0 flex items-center h-4 px-2 rounded-full bg-[#D85A2C] text-[10px] leading-none text-white font-medium">{SHIPPED_BUILDS}</span>
            </button>
            <button
              ref={mProjectsTabRef}
              type="button"
              onClick={() => setActiveTab('projects')}
              className={`shrink-0 bg-transparent px-0 text-[13px] font-medium leading-[20px] tracking-[-0.015em] whitespace-nowrap transition-colors ${activeTab === 'projects' ? 'text-white' : 'text-white/50'}`}
            >
              My Projects
            </button>
          </div>
          <div className="hidden xl:flex gap-6 h-full items-center">
            <button
              ref={shotsTabRef}
              onClick={() => setActiveTab('shots')}
              className={`bg-transparent border-0 px-0 flex h-full items-center focus:outline-none transition-colors ${activeTab === 'shots' ? 'text-white' : 'text-white/50 hover:text-white/80'}`}
            >
              <span className="text-[14px] font-normal leading-[20px] tracking-[-0.015em] whitespace-nowrap">Design Shots</span>
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
                <span className="text-[14px] font-normal leading-[20px] tracking-[-0.015em] whitespace-nowrap">Claude Lab</span>
                <span
                  className="shrink-0 flex items-center gap-1 h-5 pl-1 pr-2 rounded-[999px] bg-[#D85A2C]"
                >
                  <svg width="11" height="13" viewBox="0 0 11 13" fill="none" xmlns="http://www.w3.org/2000/svg" className="bell-animate shrink-0">
                    <path fillRule="evenodd" clipRule="evenodd" d="M6.83458 10.7637H3.49219C3.53027 11.6537 4.26392 12.3637 5.16339 12.3637C6.06284 12.3637 6.79648 11.6537 6.83458 10.7637Z" fill="white" />
                    <path fillRule="evenodd" clipRule="evenodd" d="M5.16367 1.01807C2.79385 1.01807 0.872733 2.93918 0.872733 5.309V8.77237C0.36905 8.91483 0 9.37793 0 9.92722C0 10.1482 0.179085 10.3272 0.400003 10.3272H10.0728C10.2937 10.3272 10.4728 10.1482 10.4728 9.92722C10.4728 9.37793 10.1038 8.91483 9.60006 8.77237V5.309C9.60006 2.93918 7.67894 1.01807 5.30913 1.01807H5.16367Z" fill="white" />
                    <path d="M8.29085 0.36377C9.29501 0.36377 10.109 1.1778 10.109 2.18196C10.109 3.18612 9.29501 4.00016 8.29085 4.00016C7.28669 4.00016 6.47266 3.18612 6.47266 2.18196C6.47266 1.1778 7.28669 0.36377 8.29085 0.36377Z" fill="#FF666B" />
                    <path d="M8.29085 0.36377C9.29501 0.36377 10.109 1.1778 10.109 2.18196C10.109 3.18612 9.29501 4.00016 8.29085 4.00016C7.28669 4.00016 6.47266 3.18612 6.47266 2.18196C6.47266 1.1778 7.28669 0.36377 8.29085 0.36377Z" stroke="#4CDC51" strokeWidth="0.727277" />
                  </svg>
                  <span className="text-[12px] leading-none text-white whitespace-nowrap font-medium">{SHIPPED_BUILDS} new</span>
                </span>
              </div>
            </button>
            <button
              ref={projectsTabRef}
              onClick={() => setActiveTab('projects')}
              className={`bg-transparent border-0 px-0 flex h-full items-center justify-center focus:outline-none transition-colors ${activeTab === 'projects' ? 'text-white' : 'text-white/50 hover:text-white/80'}`}
            >
              <span className="text-[14px] font-normal leading-[20px] tracking-[-0.015em] whitespace-nowrap">My Projects</span>
            </button>
          </div>
          <div className="flex shrink-0 items-center gap-3 py-2">
            <div className="hidden xl:flex gap-3 h-full items-center">
              <span className="font-mono font-medium text-[12px] leading-[28px] tracking-[-0.015em] uppercase text-white/50 whitespace-nowrap">{date}</span>
              <span className="w-[5px] h-[5px] rounded-full bg-[#F27313] inline-block" />
              <span className="font-mono font-medium text-[12px] leading-[28px] tracking-[-0.015em] uppercase text-white/50 whitespace-nowrap">{time}</span>
            </div>
            <button
              onClick={() => window.open('https://wa.me/2349021077403', '_blank', 'noopener,noreferrer')}
              className="btn-chat group rounded-full pl-3 pr-4 h-6 text-[12px] font-body text-white hidden xl:flex items-center"
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
          className="relative h-px w-full bg-[#252525] mt-3 xl:mt-0"
        >
          <span
            className="block absolute top-0 h-px bg-[#ff7043] transition-all duration-300 ease-out"
            style={{ left: indicatorStyle.left, width: indicatorStyle.width }}
          />
        </div>
       </div>
        <div className="relative z-20 mt-1 hidden xl:flex items-center justify-between">
          <h2 className="text-[18px] leading-[28px] tracking-[-0.015em] text-white font-medium">
            {activeTab === 'shots'
              ? 'Design Shots by Yours Truly'
              : activeTab === 'lab'
                ? 'Claude Lab'
                : 'My Projects'}
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
            className={`${activeTab === 'shots' ? 'hidden xl:flex' : 'hidden'} items-center -my-7 -mr-3 bg-transparent border-0 p-0 cursor-pointer focus:outline-none leading-none`}
          >
          <svg width="88" height="80" viewBox="0 0 88 80" fill="none" xmlns="http://www.w3.org/2000/svg">
            <g filter="url(#filter0_d_638_4549)">
              <rect x="20" y="24" width="48" height="24" rx="12" fill="url(#paint0_linear_638_4549)" shapeRendering="crispEdges"/>
              <rect x="20.5" y="24.5" width="47" height="23" rx="11.5" stroke="url(#paint1_linear_638_4549)" shapeRendering="crispEdges"/>
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
              <linearGradient id="paint0_linear_638_4549" x1="44" y1="24" x2="44" y2="48" gradientUnits="userSpaceOnUse">
                <stop stopColor="#191919"/>
                <stop offset="1" stopColor="#262626"/>
              </linearGradient>
              <linearGradient id="paint1_linear_638_4549" x1="44" y1="24" x2="44" y2="48" gradientUnits="userSpaceOnUse">
                <stop stopColor="#333131"/>
                <stop offset="1" stopColor="#191919"/>
              </linearGradient>
            </defs>
          </svg>
          </button>
        </div>
        <div id="rightdiv3" className="fixed bottom-4 left-0 right-0 flex justify-center pointer-events-none z-30 xl:absolute xl:bottom-8">
          <div className="pointer-events-auto">
            <BottomBar />
          </div>
        </div>
       </div>
      </div>
    </main>
    <Stars />
    {expandedVideo && (
      <div
        onClick={closeVideo}
        className="fixed inset-0 z-[100] flex items-center justify-center p-6"
        style={{
          background: lightboxShown ? 'rgba(0,0,0,0.72)' : 'rgba(0,0,0,0)',
          backdropFilter: lightboxShown ? 'blur(8px)' : 'blur(0px)',
          WebkitBackdropFilter: lightboxShown ? 'blur(8px)' : 'blur(0px)',
          transition: 'background 320ms ease, backdrop-filter 320ms ease',
        }}
      >
        <video
          src={expandedVideo}
          poster={expandedShot?.poster}
          autoPlay
          loop
          muted={expandedShot?.sound ? videoMuted : true}
          // React doesn't reliably sync the muted attribute after mount, so set it on the node directly.
          ref={(el) => { if (el) el.muted = expandedShot?.sound ? videoMuted : true }}
          playsInline
          onClick={(e) => e.stopPropagation()}
          className="max-w-[92vw] max-h-[88vh] w-auto h-auto rounded-[24px]"
          style={{
            boxShadow: '0 24px 80px rgba(0,0,0,0.6)',
            opacity: lightboxShown ? 1 : 0,
            transform: lightboxShown ? 'scale(1)' : 'scale(0.92)',
            transition:
              'opacity 320ms cubic-bezier(0.22,1,0.36,1), transform 320ms cubic-bezier(0.22,1,0.36,1)',
          }}
        />
        {expandedShot?.sound && (
          <button
            type="button"
            onClick={(e) => { e.stopPropagation(); setVideoMuted((m) => !m) }}
            aria-label={videoMuted ? 'Unmute video' : 'Mute video'}
            className="absolute top-5 right-16 flex items-center justify-center w-9 h-9 rounded-full text-white/80 hover:text-white backdrop-blur-md transition-colors"
            style={{
              background: 'rgba(20,20,22,0.55)',
              border: '0.5px solid rgba(255,255,255,0.14)',
              opacity: lightboxShown ? 1 : 0,
              transition: 'opacity 320ms ease',
            }}
          >
            {videoMuted ? (
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path d="M2 5.25v3.5h2l3 2.5v-8.5l-3 2.5H2z" fill="currentColor" />
                <path d="M9.5 5.5l3 3M12.5 5.5l-3 3" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
              </svg>
            ) : (
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path d="M2 5.25v3.5h2l3 2.5v-8.5l-3 2.5H2z" fill="currentColor" />
                <path d="M9.5 5a3.2 3.2 0 010 4M11 3.5a5.2 5.2 0 010 7" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
              </svg>
            )}
          </button>
        )}
        <button
          type="button"
          onClick={closeVideo}
          aria-label="Close video"
          className="absolute top-5 right-5 flex items-center justify-center w-9 h-9 rounded-full text-white/80 hover:text-white backdrop-blur-md transition-colors"
          style={{
            background: 'rgba(20,20,22,0.55)',
            border: '0.5px solid rgba(255,255,255,0.14)',
            opacity: lightboxShown ? 1 : 0,
            transition: 'opacity 320ms ease',
          }}
        >
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path d="M3.5 3.5l7 7M10.5 3.5l-7 7" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
          </svg>
        </button>
      </div>
    )}
    </>
  )
}

export default App
