import videoThumbnail from '../assets/images/video-thumbnail.png'
import blurOverlay from '../assets/images/blur-overlay.png'
import avatar from '../assets/images/avatar.png'
import { useRef, useCallback, useState, useEffect, useLayoutEffect } from 'react'
import { useRive } from '@rive-app/react-canvas'
import { useSquircle } from '../hooks/useSquircle'
import figmaIcon from '../assets/icons/figma.png'
import codexIcon from '../assets/icons/codex.png'
import claudeIcon from '../assets/icons/claude.png'
import aeIcon from '../assets/icons/aftereffects.png'
import riveIcon from '../assets/icons/rive.png'
import { playSwipeSound, playClickSound } from '../utils/sounds'
import termiiLogo from '../assets/icons/termii.png'
import hashitLogo from '../assets/icons/hashit.png'
import digitalLogo from '../assets/icons/digital.png'
import partyjorLogo from '../assets/icons/partyjor.png'
import gamexpayLogo from '../assets/icons/gamexpay.png'
import { GlitchReveal } from './GlitchReveal'

export function Sidebar() {
  const [chatHovered, setChatHovered] = useState(false)
  const { RiveComponent: FireAnimation } = useRive({
    src: '/fire.riv',
    autoplay: true,
    shouldDisableRiveListeners: true,
  })

  const sidebarRef = useSquircle(32)
  const innerCardRef = useSquircle(24)
  const contentRef = useRef<HTMLDivElement>(null)

  const thumbnailRef = useSquircle(20)
  const div1Ref = useSquircle(20)
  const compDivRef = useSquircle(24)
  const stackDivRef = useSquircle(24)
  const chatBtnRef = useSquircle(18)
  const resumeBtnRef = useSquircle(18)
  const playBtnRef = useRef<SVGSVGElement>(null)

  const handleThumbnailClick = useCallback(() => {
    const el = playBtnRef.current
    if (!el) return
    el.classList.add('tapped')
    setTimeout(() => el.classList.remove('tapped'), 200)
  }, [])

  const companies = [
    { name: 'Termii', logo: termiiLogo, current: true },
    { name: 'Hashit', logo: hashitLogo },
    { name: 'Digital abundance', logo: digitalLogo },
    { name: 'Partyjor', logo: partyjorLogo },
    { name: 'GameXpay', logo: gamexpayLogo },
  ]

  const [companyVisibleCount, setCompanyVisibleCount] = useState(companies.length)
  const [needsScroll, setNeedsScroll] = useState(false)
  const [resizeKey, setResizeKey] = useState(0)

  useEffect(() => {
    const onResize = () => {
      setCompanyVisibleCount(companies.length)
      setNeedsScroll(false)
      setResizeKey((k) => k + 1)
    }
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [companies.length])

  useLayoutEffect(() => {
    const sidebar = sidebarRef.current
    if (!sidebar) return
    const overflow = sidebar.scrollHeight > sidebar.clientHeight + 1
    if (overflow && companyVisibleCount > 0) {
      setCompanyVisibleCount((c) => c - 1)
    } else if (overflow && companyVisibleCount === 0 && !needsScroll) {
      setNeedsScroll(true)
    }
  }, [companyVisibleCount, needsScroll, resizeKey, sidebarRef])

  const visibleCompanies = companies.slice(0, companyVisibleCount)
  const hiddenCompanies = companies.slice(companyVisibleCount)
  const chipFillStyle = {
    background: 'radial-gradient(ellipse at center, rgba(255,255,255,0.08), rgba(153,153,153,0.08))',
    boxShadow: '0 4px 4px 0 rgba(0, 0, 0, 0.08), inset 0 0 0 0.5px rgba(255,255,255,0.095)',
  }


  return (
    <aside
      ref={sidebarRef}
      className={`fixed top-6 left-6 bottom-6 w-[344px] border border-white/[0.06] p-2 flex flex-col [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] ${needsScroll ? 'overflow-y-auto' : 'overflow-hidden'}`}
      style={{ background: 'rgba(34, 34, 37, 0.5)', filter: 'drop-shadow(0 4px 12px rgba(0, 0, 0, 0.25))' }}
    >
      <div
        ref={innerCardRef}
        className="p-1"
        style={{
          background: 'linear-gradient(180deg, rgba(56,61,64,0.2) 0%, rgba(30,32,35,0.2) 35%, rgba(40,43,46,0.2) 65%, rgba(56,61,64,0.2) 100%)',
          boxShadow: '0 4px 44px 0 rgba(0, 0, 0, 0.25), inset 0 0 0 1px rgba(72,72,79,0.155)',
        }}
      >
        <div ref={contentRef} className="flex flex-col gap-2 pt-1 px-1 pb-3">
          <div style={{ borderRadius: '20px', boxShadow: '0 4px 20px 0 rgba(0,0,0,0.25)' }}>
            <div id="div1" ref={div1Ref} className="flex w-full items-start gap-3 rounded-[20px] p-3"
                style={{
                  background: 'linear-gradient(180deg, #191919, #262626) padding-box, linear-gradient(180deg, #333131, #191919) border-box',
                  border: '1px solid transparent',
                }}>
                <img src={avatar} alt="Avatar" className="h-12 w-12 rounded-full" />
                <div className="flex flex-col gap-[2px]">
                  <span className="text-[16px] leading-[24px] font-normal tracking-[-0.015em] text-white">Jahgrant Aiyedun</span>
                  <span className="text-[14px] leading-[20px] font-normal font-body tracking-[-0.02em] text-white/50">Design Engineer</span>
                </div>
              </div>
          </div>
          <div id="div2" className="flex flex-col gap-6 px-4 pb-4">
              <div className="flex flex-col gap-1">
                <h1 className="text-[24px] leading-[32px] tracking-[-0.025em] text-white" style={{ fontWeight: 450 }}>
                  <GlitchReveal
                    text="Crafting High Quality Experiences for Web3 & Gaming Products."
                    repeatEvery={10000}
                    scrambleChars="abcdefghijklmnopqrstuvwxyz"
                    charsPerStep={1.4}
                    speed={32}
                  />
                </h1>
                <div className="flex items-center gap-2">
                <svg className="glow-dot" width="10" height="10" viewBox="0 0 10 10" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="5" cy="5" r="5" fill="url(#paint0_radial_381_4509)"/>
                  <defs>
                    <radialGradient id="paint0_radial_381_4509" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(2 3) rotate(66.8014) scale(7.61577)">
                      <stop stopColor="#00FF1E"/>
                      <stop offset="0.596154" stopColor="#00FFEE"/>
                      <stop offset="1" stopColor="#00FF5E"/>
                    </radialGradient>
                  </defs>
                </svg>
                <span className="text-[14px] leading-[20px] text-white/50">Available for work</span>
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  ref={chatBtnRef as unknown as React.RefObject<HTMLButtonElement>}
                  className="btn-sidebar relative flex-1 h-9 rounded-[18px] px-4 text-[14px] leading-[20px] text-white overflow-hidden flex items-center justify-center gap-1"
                  onMouseEnter={() => { playSwipeSound(); setChatHovered(true) }}
                  onMouseLeave={() => setChatHovered(false)}
                  onMouseDown={playClickSound}
                  style={{
                    background: 'radial-gradient(ellipse at center, rgba(255,255,255,0.08), rgba(153,153,153,0.08))',
                    border: 'none',
                    boxShadow: '0 4px 4px 0 rgba(0, 0, 0, 0.08), inset 0 0 0 0.5px rgba(255,255,255,0.095)',
                  }}
                >
                  <div className="w-8 h-8 shrink-0 rounded overflow-hidden">
                    <FireAnimation />
                  </div>
                  <span className="whitespace-nowrap">Chat me up</span>
                </button>
                <button
                  ref={resumeBtnRef as unknown as React.RefObject<HTMLButtonElement>}
                  className="btn-sidebar relative flex-1 h-9 rounded-[18px] px-4 text-[14px] leading-[20px] text-white overflow-hidden"
                  onMouseEnter={playSwipeSound}
                  onMouseDown={playClickSound}
                  style={{
                    background: 'radial-gradient(ellipse at center, rgba(255,255,255,0.08), rgba(153,153,153,0.08))',
                    border: 'none',
                    boxShadow: '0 4px 4px 0 rgba(0, 0, 0, 0.08), inset 0 0 0 0.5px rgba(255,255,255,0.095)',
                  }}
                >
                  My Resume
                </button>
              </div>
            </div>
        </div>

        <div
          ref={thumbnailRef}
          className="video-thumbnail relative flex h-[251px] w-full items-center justify-center bg-cover bg-center overflow-hidden cursor-pointer"
          onClick={handleThumbnailClick}
          style={{ backgroundImage: `url(${videoThumbnail})` }}
        >
          <div
            className="absolute inset-0"
            style={{ background: 'linear-gradient(to bottom, transparent 30%, rgba(0, 0, 0, 0.85) 100%)' }}
          />
          <img
            src={blurOverlay}
            alt=""
            className="absolute bottom-0 left-1/2 z-[1] -translate-x-1/2 w-[200%] translate-y-1/2 pointer-events-none"
          />
          <svg ref={playBtnRef} className="play-btn relative z-10" width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M16 10L38 24L16 38V10Z" fill="white" stroke="white" strokeWidth="4" strokeLinejoin="round" />
          </svg>
        </div>
      </div>

      <div
        id="compdiv"
        ref={compDivRef}
        className="mt-2 p-6"
        style={{
          background: 'linear-gradient(180deg, rgba(56,61,64,0.2) 0%, rgba(30,32,35,0.2) 35%, rgba(40,43,46,0.2) 65%, rgba(56,61,64,0.2) 100%)',
          boxShadow: '0 4px 44px 0 rgba(0, 0, 0, 0.25), inset 0 0 0 1px rgba(72,72,79,0.155)',
          borderRadius: '24px',
        }}
      >
        <div className="flex items-center gap-2">
          <svg className="glow-dot-orange" width="10" height="10" viewBox="0 0 10 10" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="5" cy="5" r="5" fill="url(#paint0_radial_comp)"/>
            <defs>
              <radialGradient id="paint0_radial_comp" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(2 3) rotate(66.8014) scale(7.61577)">
                <stop stopColor="#8800FF"/>
                <stop offset="0.478763" stopColor="#FF7300"/>
                <stop offset="1" stopColor="#FF0000"/>
              </radialGradient>
            </defs>
          </svg>
          <span className="text-[12px] leading-[20px] tracking-[-0.02em] uppercase font-mono text-white/50">Companies</span>
        </div>
        <h2 className="text-[18px] leading-[32px] tracking-[-0.025em] text-white mt-2" style={{ fontWeight: 450 }}>
          Companies I've had Impacts on
        </h2>
        <div className="flex flex-wrap gap-2 mt-4">
          {visibleCompanies.map((c) =>
            c.current ? (
              <div key={c.name} className="flex items-center -space-x-[1px]">
                <div className="flex items-center gap-2 rounded-l-[18px] rounded-r-none py-[6px] px-3 text-[14px] leading-[20px] text-white/70 company-chip" style={chipFillStyle}>
                  <img src={c.logo} alt={c.name} className="w-4 h-4 rounded" />
                  <span>{c.name}</span>
                </div>
                <div className="flex items-center gap-2 rounded-r-[18px] rounded-l-none py-[5px] px-3 text-[14px] leading-[20px] text-white/70"
                  style={{
                    borderTop: '1px solid rgba(255,255,255,0.095)',
                    borderRight: '1px solid rgba(255,255,255,0.095)',
                    borderBottom: '1px solid rgba(255,255,255,0.095)',
                    borderLeft: '0px solid transparent',
                  }}>
                  <span className="glow-dot-blue w-2 h-2 rounded-full bg-blue-500" />
                  <span className="text-[12px] tracking-[-0.02em] uppercase font-mono text-white/30">CURRENT</span>
                </div>
              </div>
            ) : (
              <div key={c.name} className="flex items-center gap-2 rounded-[18px] py-[6px] px-3 text-[14px] leading-[20px] text-white/70 company-chip" style={chipFillStyle}>
                <img src={c.logo} alt={c.name} className="w-4 h-4 rounded" />
                <span>{c.name}</span>
              </div>
            )
          )}
          {hiddenCompanies.length > 0 && (
            <div
              className="flex items-center gap-2 rounded-[18px] py-[6px] px-3 text-[14px] leading-[20px] text-white/70 company-chip"
              style={chipFillStyle}
            >
              <div className="flex items-center -space-x-[6px]">
                {hiddenCompanies.map((c) => (
                  <img
                    key={c.name}
                    src={c.logo}
                    alt={c.name}
                    className="w-4 h-4 rounded ring-2 ring-[#222225]"
                  />
                ))}
              </div>
              <span>+{hiddenCompanies.length}</span>
            </div>
          )}
        </div>
      </div>

      <div
        id="stackdiv"
        ref={stackDivRef}
        className="mt-2 p-6 flex-1"
        style={{
          background: 'linear-gradient(180deg, rgba(56,61,64,0.2) 0%, rgba(30,32,35,0.2) 35%, rgba(40,43,46,0.2) 65%, rgba(56,61,64,0.2) 100%)',
          boxShadow: '0 4px 44px 0 rgba(0, 0, 0, 0.25), inset 0 0 0 1px rgba(72,72,79,0.155)',
          borderRadius: '24px',
        }}
      >
        <div className="flex items-center gap-2">
          <svg className="glow-dot-orange" width="10" height="10" viewBox="0 0 10 10" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="5" cy="5" r="5" fill="url(#paint0_radial_stack)"/>
            <defs>
              <radialGradient id="paint0_radial_stack" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(2 3) rotate(66.8014) scale(7.61577)">
                <stop stopColor="#8800FF"/>
                <stop offset="0.478763" stopColor="#FF7300"/>
                <stop offset="1" stopColor="#FF0000"/>
              </radialGradient>
            </defs>
          </svg>
          <span className="text-[12px] leading-[20px] tracking-[-0.02em] uppercase font-mono text-white/50">Tech Stack</span>
        </div>
        <div className="flex items-center gap-3 mt-4">
          <img src={figmaIcon} alt="Figma" className="w-8 h-8 rounded-lg" />
          <img src={codexIcon} alt="Codex" className="w-8 h-8 rounded-lg" />
          <img src={claudeIcon} alt="Claude Code" className="w-8 h-8 rounded-lg" />
          <img src={aeIcon} alt="After Effects" className="w-8 h-8 rounded-lg" />
          <img src={riveIcon} alt="Rive" className="w-8 h-8 rounded-lg" />
        </div>
      </div>
    </aside>
  )
}
