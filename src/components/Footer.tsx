// Giant faint GEEBOY wordmark footer. The SVG's textLength locks the glyphs to
// the full viewBox width, so it stays edge-to-edge at any size. On mobile it
// breaks out of the page padding (-mx-4) to touch the true screen edges.
export function Footer() {
  return (
    <footer className="w-full -mx-4 xl:mx-0 mt-12">
      <div className="h-px w-full bg-white/10" />
      <svg
        viewBox="0 0 578 150"
        className="block w-full h-auto my-6"
        role="img"
        aria-label="GEEBOY"
      >
        <text
          x="0"
          y="118"
          textLength="578"
          lengthAdjust="spacingAndGlyphs"
          fontFamily="'TWK Lausanne', sans-serif"
          fontWeight={700}
          fontSize={150}
          fill="#ffffff"
          fillOpacity={0.2}
        >
          GEEBOY
        </text>
      </svg>
      <div className="h-px w-full bg-white/10" />
    </footer>
  )
}
