import { useEffect, useRef } from 'react'

const SVG_W = 1902
const SVG_H = 641

const RAW_STARS: [number, number, number][] = [
  [220.939, 500.379, 0.1],
  [759.736, 539.379, 0.1],
  [643.424, 475.098, 0.1],
  [485.451, 166.239, 0.1],
  [582.873, 148.949, 0.1],
  [1718.92, 10.098, 0.8],
  [1216.42, 566.598, 0.8],
  [1349.89, 605.033, 0.1],
  [1625.47, 451.687, 0.1],
  [1689.12, 207.899, 0.1],
  [1624.11, 23.9437, 0.1],
  [1736.92, 68.598, 0.1],
  [1613.92, 104.598, 0.1],
  [1616.92, 265.098, 0.1],
  [1853.92, 290.598, 0.1],
  [595.424, 304.098, 0.1],
  [974.924, 527.598, 0.1],
  [771.482, 469.16, 0.1],
  [389.705, 558.764, 0.1],
  [1292.92, 13.098, 0.8],
  [598.424, 608.598, 0.8],
  [400.42, 82.098, 0.1],
  [584.924, 26.598, 0.8],
  [151.424, 418.098, 0.8],
  [240.857, 388.318, 0.1],
  [253.424, 214.098, 0.1],
  [242.924, 293.598, 0.1],
  [377.767, 614.865, 0.8],
  [582.361, 390.694, 0.1],
  [531.939, 330.538, 0.8],
  [331.902, 220.424, 0.8],
  [395.01, 445.91, 0.1],
  [868.424, 511.098, 0.1],
  [1076.92, 626.595, 0.1],
  [974.924, 580.098, 0.8],
  [1428.6, 371.542, 0.8],
  [572.096, 132.782, 0.1],
  [1536.37, 161.633, 0.1],
  [1558.45, 37.7494, 0.1],
  [1455.08, 310.83, 0.1],
  [148.424, 13.0951, 0.1],
  [1744.1, 117.08, 0.1],
  [988.42, 29.598, 0.1],
  [759.892, 421.776, 0.1],
  [850.541, 48.0951, 0.1],
  [1495.42, 469.098, 0.8],
  [219.17, 70.3236, 0.8],
  [4.42354, 86.598, 0.1],
  [225.463, 142.344, 0.1],
  [678.884, 49.098, 0.1],
  [716.006, 640.948, 0.1],
  [1676.92, 620.598, 0.1],
  [1202.45, 102.27, 0.1],
  [1263.04, 57.5394, 0.1],
  [277.424, 349.098, 0.1],
  [650.377, 129.94, 0.1],
  [1345.12, 471.304, 0.1],
  [1667.92, 391.098, 0.8],
  [1686.03, 304.866, 0.1],
  [544.576, 251.598, 0.1],
  [1023.08, 560.598, 0.1],
  [456.076, 538.063, 0.1],
  [882.076, 563.598, 0.1],
  [1075.58, 584.595, 0.1],
  [392.936, 409.192, 0.1],
  [307.902, 165.08, 0.1],
  [174.076, 391.461, 0.1],
  [1382, 47.848, 0.8],
  [1554.83, 451.782, 0.1],
  [1610, 518.551, 0.8],
  [1746.08, 190.098, 0.1],
  [1710.72, 147.606, 0.8],
  [1606.58, 350.598, 0.1],
  [1146.08, 1.098, 0.1],
  [1110.62, 16.8148, 0.1],
  [283.514, 511.095, 0.1],
  [100.58, 326.599, 0.1],
  [153.065, 295.733, 0.8],
  [415.826, 329.824, 0.1],
  [37.5763, 169.098, 0.1],
  [1775.97, 256.032, 0.1],
  [1843.6, 204.272, 0.8],
  [1807.1, 155.92, 0.1],
  [1219.32, 28.7425, 0.1],
  [318.483, 306.96, 0.1],
  [762.076, 17.598, 0.1],
  [683.108, 104.595, 0.1],
  [824.592, 105.02, 0.1],
  [578.358, 543.793, 0.1],
  [1599.83, 551.572, 0.8],
  [834.076, 580.098, 0.1],
  [936.076, 623.598, 0.8],
  [1118.44, 521.239, 0.8],
  [756.076, 587.598, 0.8],
  [817.576, 640.098, 0.1],
  [406.576, 127.098, 0.1],
  [1289.08, 530.573, 0.1],
  [1237.42, 511.453, 0.1],
  [1500.08, 241.099, 0.1],
  [1397.54, 87.3597, 0.8],
  [1318.58, 107.598, 0.1],
  [1426.34, 530.096, 0.1],
  [1406.21, 140.385, 0.1],
  [1491.08, 82.0951, 0.1],
  [1560.9, 365.994, 0.1],
  [1522.22, 294.38, 0.1],
  [1692.08, 466.098, 0.1],
  [1488.08, 407.598, 0.1],
  [1738.14, 419.118, 0.1],
  [311.842, 419.232, 0.1],
  [1501.83, 536.66, 0.1],
  [1143.08, 580.098, 0.1],
  [1478.86, 608.865, 0.8],
  [1284.14, 155.598, 0.8],
  [1465.64, 307.098, 0.1],
  [1398.72, 205.051, 0.8],
  [1388.56, 238.072, 0.8],
  [1480.8, 152.598, 0.1],
  [1290.55, 223.16, 0.1],
  [1267.58, 295.365, 0.8],
  [1395.35, 437.616, 0.1],
  [1780.31, 352.485, 0.1],
  [1901.6, 115.42, 0.1],
  [1167.39, 211.098, 0.8],
  [1137.59, 408.899, 0.1],
  [1072.58, 224.944, 0.1],
  [1185.39, 269.598, 0.1],
  [811.42, 358.098, 0.1],
  [1065.39, 466.098, 0.1],
  [1302.39, 491.598, 0.1],
  [741.388, 214.098, 0.8],
  [733.869, 415.133, 0.1],
  [1006.92, 238.749, 0.1],
  [903.549, 511.83, 0.1],
  [1192.57, 318.08, 0.1],
  [650.924, 303.27, 0.1],
  [711.506, 258.539, 0.1],
  [1134.5, 505.866, 0.1],
  [830.487, 248.848, 0.8],
  [1194.55, 391.098, 0.1],
  [1159.21, 348.606, 0.8],
  [1224.44, 457.032, 0.1],
  [1292.08, 405.272, 0.8],
  [1255.57, 356.92, 0.1],
  [667.795, 229.743, 0.1],
  [948.549, 442.099, 0.1],
  [846.006, 288.36, 0.8],
  [767.045, 308.598, 0.1],
  [854.682, 341.385, 0.1],
  [688.576, 335.595, 0.1],
  [970.694, 495.38, 0.1],
  [1350.07, 316.42, 0.1],
  [345.08, 367.098, 0.1],
  [652.58, 586.098, 0.1],
  [507.08, 578.598, 0.8],
  [646.58, 530.598, 0.1],
  [471.33, 410.824, 0.1],
  [644.893, 407.701, 0.1],
  [543.873, 498.19, 0.1],
  [1087.42, 64.098, 0.1],
  [1042.42, 197.598, 0.8],
  [900.076, 127.063, 0.1],
  [1022.36, 132.793, 0.1],
  [1096.58, 175.098, 0.1],
  [951.08, 167.598, 0.8],
  [1090.58, 119.598, 0.1],
  [987.873, 87.1898, 0.1],
  [301.975, 471.398, 0.8],
  [127.576, 116.598, 0.1],
  [491.764, 41.5697, 0.1],
  [330.717, 13.7396, 0.1],
  [330.08, 73.098, 0.1],
  [579.08, 83.598, 0.1],
  [193.576, 217.098, 0.1],
  [115.154, 198.254, 0.1],
]

type Star = {
  bx: number
  by: number
  o: number
  sx: number
  sy: number
  driftX: number
  driftY: number
  repelX: number
  repelY: number
  phaseX: number
  phaseY: number
  speedX: number
  speedY: number
  ampX: number
  ampY: number
  twinklePhase: number
  twinkleSpeed: number
  twinkleAmp: number
  blinkAt: number
  blinkStart: number
  blinkUntil: number
  blinkBoost: number
  scatterX: number
  scatterY: number
  scatterVx: number
  scatterVy: number
}

export function Stars() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const dpr = Math.min(window.devicePixelRatio || 1, 2)
    let w = window.innerWidth
    let h = window.innerHeight

    const stars: Star[] = []

    const buildStars = () => {
      stars.length = 0
      const passes: [number, number][] = [
        [0, 0],
        [SVG_W * 0.5, SVG_H * 0.5],
      ]
      for (const [ox, oy] of passes) {
        for (let i = 0; i < RAW_STARS.length; i += 1) {
          const [x, y, o] = RAW_STARS[i]
          const dimmedO = o >= 0.5 ? o * 0.5 : o
          const bx = ((x + ox) % SVG_W + SVG_W) % SVG_W
          const by = ((y + oy) % SVG_H + SVG_H) % SVG_H
          stars.push({
            bx,
            by,
            o: dimmedO,
            sx: 0,
            sy: 0,
            driftX: 0,
            driftY: 0,
            repelX: 0,
            repelY: 0,
            phaseX: Math.random() * Math.PI * 2,
            phaseY: Math.random() * Math.PI * 2,
            speedX: 0.25 + Math.random() * 0.5,
            speedY: 0.25 + Math.random() * 0.5,
            ampX: 7 + Math.random() * 12,
            ampY: 7 + Math.random() * 12,
            twinklePhase: Math.random() * Math.PI * 2,
            twinkleSpeed: 0.6 + Math.random() * 2.2,
            twinkleAmp: 0.55 + Math.random() * 0.4,
            blinkAt: performance.now() / 1000 + Math.random() * 6,
            blinkStart: 0,
            blinkUntil: 0,
            blinkBoost: 0,
            scatterX: 0,
            scatterY: 0,
            scatterVx: 0,
            scatterVy: 0,
          })
        }
      }
    }

    const resize = () => {
      w = window.innerWidth
      h = window.innerHeight
      canvas.width = Math.floor(w * dpr)
      canvas.height = Math.floor(h * dpr)
      canvas.style.width = w + 'px'
      canvas.style.height = h + 'px'
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)

      buildStars()

      const scaleX = w / SVG_W
      const scaleY = h / SVG_H
      for (const s of stars) {
        s.sx = s.bx * scaleX
        s.sy = s.by * scaleY
      }
    }
    resize()
    window.addEventListener('resize', resize)

    let mouseX = -10000
    let mouseY = -10000
    const onMove = (e: PointerEvent) => {
      mouseX = e.clientX
      mouseY = e.clientY
    }
    const onLeave = () => {
      mouseX = -10000
      mouseY = -10000
    }
    window.addEventListener('pointermove', onMove)
    window.addEventListener('pointerleave', onLeave)

    const SCATTER_RADIUS = 320
    const SCATTER_IMPULSE = 1400
    const onClick = (e: MouseEvent) => {
      const cx = e.clientX
      const cy = e.clientY
      for (const s of stars) {
        const dx = s.sx - cx
        const dy = s.sy - cy
        const dist = Math.hypot(dx, dy)
        if (dist < SCATTER_RADIUS && dist > 0.001) {
          const k = 1 - dist / SCATTER_RADIUS
          const f = k * k * SCATTER_IMPULSE
          s.scatterVx += (dx / dist) * f
          s.scatterVy += (dy / dist) * f
        }
      }
    }
    window.addEventListener('click', onClick)

    const REPEL_RADIUS = 90
    const REPEL_STRENGTH = 32

    type Shooter = {
      x: number
      y: number
      vx: number
      vy: number
      life: number
      maxLife: number
      length: number
      thickness: number
    }
    const shooters: Shooter[] = []
    let nextShooterAt = performance.now() / 1000 + 4 + Math.random() * 8

    const spawnShooter = () => {
      const edge = Math.floor(Math.random() * 4)
      const spread = (Math.PI * 2) / 3
      let x: number, y: number, angle: number
      if (edge === 0) {
        x = Math.random() * w
        y = -40
        angle = Math.PI / 2 + (Math.random() - 0.5) * spread
      } else if (edge === 1) {
        x = w + 40
        y = Math.random() * h
        angle = Math.PI + (Math.random() - 0.5) * spread
      } else if (edge === 2) {
        x = Math.random() * w
        y = h + 40
        angle = -Math.PI / 2 + (Math.random() - 0.5) * spread
      } else {
        x = -40
        y = Math.random() * h
        angle = 0 + (Math.random() - 0.5) * spread
      }
      const speed = 450 + Math.random() * 350
      shooters.push({
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        life: 0,
        maxLife: 3.2 + Math.random() * 1.6,
        length: 90 + Math.random() * 90,
        thickness: 1.2 + Math.random() * 0.8,
      })
    }

    let rafId = 0
    let last = performance.now()

    const tick = (now: number) => {
      const dt = Math.min(0.05, (now - last) / 1000)
      last = now
      const t = now / 1000

      ctx.clearRect(0, 0, w, h)

      for (const s of stars) {
        s.phaseX += dt * s.speedX
        s.phaseY += dt * s.speedY
        const targetDriftX = Math.sin(s.phaseX) * s.ampX
        const targetDriftY = Math.cos(s.phaseY) * s.ampY
        s.driftX += (targetDriftX - s.driftX) * 0.04
        s.driftY += (targetDriftY - s.driftY) * 0.04

        const ex = s.sx - mouseX
        const ey = s.sy - mouseY
        const dist = Math.hypot(ex, ey)
        let repelTargetX = 0
        let repelTargetY = 0
        if (dist < REPEL_RADIUS && dist > 0.001) {
          const k = 1 - dist / REPEL_RADIUS
          const f = k * k * REPEL_STRENGTH
          repelTargetX = (ex / dist) * f
          repelTargetY = (ey / dist) * f
        }
        s.repelX += (repelTargetX - s.repelX) * 0.05
        s.repelY += (repelTargetY - s.repelY) * 0.05

        const SCATTER_SPRING = 4.5
        const SCATTER_DRAG = 2.2
        s.scatterVx += -s.scatterX * SCATTER_SPRING * dt
        s.scatterVy += -s.scatterY * SCATTER_SPRING * dt
        s.scatterVx -= s.scatterVx * SCATTER_DRAG * dt
        s.scatterVy -= s.scatterVy * SCATTER_DRAG * dt
        s.scatterX += s.scatterVx * dt
        s.scatterY += s.scatterVy * dt

        const x = s.sx + s.driftX + s.repelX + s.scatterX
        const y = s.sy + s.driftY + s.repelY + s.scatterY

        s.twinklePhase += dt * s.twinkleSpeed
        const baseTwinkle = (1 - s.twinkleAmp) + s.twinkleAmp * (Math.sin(s.twinklePhase) * 0.5 + 0.5)

        let blinkFactor = 1
        if (s.blinkUntil === 0 && t >= s.blinkAt) {
          const dur = 0.2 + Math.random() * 0.6
          s.blinkStart = t
          s.blinkUntil = t + dur
          s.blinkBoost = 2 + Math.random() * 2
        }
        if (s.blinkUntil > 0) {
          if (t >= s.blinkUntil) {
            s.blinkUntil = 0
            s.blinkBoost = 0
            s.blinkStart = 0
            s.blinkAt = t + 0.6 + Math.random() * 6
          } else {
            const span = s.blinkUntil - s.blinkStart
            const progress = (t - s.blinkStart) / Math.max(0.001, span)
            const pulse = Math.sin(progress * Math.PI)
            blinkFactor = 1 + (s.blinkBoost - 1) * pulse
          }
        }

        const alpha = Math.min(1, s.o * baseTwinkle * blinkFactor)

        ctx.globalAlpha = alpha
        ctx.fillStyle = '#ffffff'
        ctx.beginPath()
        ctx.arc(x, y, 1.4, 0, Math.PI * 2)
        ctx.fill()
      }

      if (t >= nextShooterAt) {
        spawnShooter()
        if (Math.random() < 0.18) spawnShooter()
        nextShooterAt = t + 5 + Math.random() * 11
      }

      for (let i = shooters.length - 1; i >= 0; i--) {
        const sh = shooters[i]
        sh.life += dt
        sh.x += sh.vx * dt
        sh.y += sh.vy * dt

        const lifeT = sh.life / sh.maxLife
        const fade = lifeT < 0.15 ? lifeT / 0.15 : 1 - Math.max(0, (lifeT - 0.7) / 0.3)
        const alpha = Math.max(0, Math.min(1, fade))

        const speed = Math.hypot(sh.vx, sh.vy) || 1
        const ux = sh.vx / speed
        const uy = sh.vy / speed
        const tailX = sh.x - ux * sh.length
        const tailY = sh.y - uy * sh.length

        const grad = ctx.createLinearGradient(sh.x, sh.y, tailX, tailY)
        grad.addColorStop(0, `rgba(255,255,255,${0.95 * alpha})`)
        grad.addColorStop(0.4, `rgba(255,255,255,${0.45 * alpha})`)
        grad.addColorStop(1, 'rgba(255,255,255,0)')

        ctx.globalAlpha = 1
        ctx.strokeStyle = grad
        ctx.lineWidth = sh.thickness
        ctx.lineCap = 'round'
        ctx.beginPath()
        ctx.moveTo(tailX, tailY)
        ctx.lineTo(sh.x, sh.y)
        ctx.stroke()

        ctx.globalAlpha = alpha
        ctx.fillStyle = '#ffffff'
        ctx.beginPath()
        ctx.arc(sh.x, sh.y, sh.thickness * 1.4, 0, Math.PI * 2)
        ctx.fill()

        const off = sh.x < -120 || sh.x > w + 120 || sh.y < -120 || sh.y > h + 120
        if (sh.life >= sh.maxLife || off) {
          shooters.splice(i, 1)
        }
      }

      rafId = requestAnimationFrame(tick)
    }
    rafId = requestAnimationFrame(tick)

    return () => {
      cancelAnimationFrame(rafId)
      window.removeEventListener('resize', resize)
      window.removeEventListener('pointermove', onMove)
      window.removeEventListener('pointerleave', onLeave)
      window.removeEventListener('click', onClick)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      aria-hidden
      className="fixed inset-0 !pointer-events-none"
      style={{ zIndex: 9999, pointerEvents: 'none' }}
    />
  )
}
