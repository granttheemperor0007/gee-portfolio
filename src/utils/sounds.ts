import swingSrc from '../assets/swing.mp3'

let swingBuffer: AudioBuffer | null = null
let ctx: AudioContext | null = null

function getCtx() {
  if (!ctx) ctx = new (window.AudioContext || (window as any).webkitAudioContext)()
  return ctx
}

// Preload and decode the swing sound
fetch(swingSrc)
  .then(res => res.arrayBuffer())
  .then(buf => getCtx().decodeAudioData(buf))
  .then(decoded => { swingBuffer = decoded })

export function playSwipeSound() {
  const c = getCtx()
  if (!swingBuffer) return

  const source = c.createBufferSource()
  source.buffer = swingBuffer

  const gain = c.createGain()
  gain.gain.setValueAtTime(0.125, c.currentTime)
  gain.gain.linearRampToValueAtTime(0, c.currentTime + 1)

  source.connect(gain)
  gain.connect(c.destination)

  source.start(c.currentTime, 0, 1) // start at 0s, play for 1s
}

export function playClickSound() {
  const c = getCtx()

  const osc1 = c.createOscillator()
  const osc2 = c.createOscillator()
  const gain = c.createGain()

  osc1.type = 'square'
  osc1.frequency.setValueAtTime(1800, c.currentTime)
  osc1.frequency.exponentialRampToValueAtTime(400, c.currentTime + 0.03)

  osc2.type = 'square'
  osc2.frequency.setValueAtTime(2400, c.currentTime)
  osc2.frequency.exponentialRampToValueAtTime(600, c.currentTime + 0.02)

  gain.gain.setValueAtTime(0.02, c.currentTime)
  gain.gain.exponentialRampToValueAtTime(0.0005, c.currentTime + 0.04)

  osc1.connect(gain)
  osc2.connect(gain)
  gain.connect(c.destination)

  osc1.start(c.currentTime)
  osc2.start(c.currentTime)
  osc1.stop(c.currentTime + 0.04)
  osc2.stop(c.currentTime + 0.04)
}
