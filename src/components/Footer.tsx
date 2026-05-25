// GEEBOY wordmark footer: 48px on mobile, 96px on desktop, framed by a hairline
// above and below.
export function Footer() {
  return (
    <footer className="w-full mt-12">
      <div className="h-px w-full bg-white/10" />
      <div className="flex justify-center py-8">
        <span className="font-body font-bold leading-none tracking-[-0.03em] text-white text-[48px] xl:text-[96px]">
          GEEBOY
        </span>
      </div>
      <div className="h-px w-full bg-white/10" />
    </footer>
  )
}
