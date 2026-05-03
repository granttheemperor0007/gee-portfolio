import type { Config } from 'tailwindcss'

export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        body: ['TWK Lausanne', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      borderRadius: {
        outer: '32px',
        card: '24px',
        'inner-card': '20px',
        video: '16px',
        pill: '40px',
        icon: '4px',
      },
      colors: {
        portfolio: {
          primary: '#ffffff',
          muted: 'rgba(255,255,255,0.5)',
          subtle: 'rgba(255,255,255,0.7)',
          disabled: '#6f6f77',
        },
      },
    },
  },
  corePlugins: {
    preflight: false,
  },
  plugins: [],
} satisfies Config
