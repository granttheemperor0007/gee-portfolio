export type BuildDomain = 'gaming' | 'saas' | 'ai' | 'web3' | 'capstone' | 'meta'

export type DailyBuild = {
  dayNumber: number
  title: string
  domain: BuildDomain
  description: string
  releaseDate: string
  vercelUrl?: string
  skill?: string
}

export const DAILY_BUILDS: DailyBuild[] = [
  {
    dayNumber: 1,
    title: 'CoD K/D Ratio Tracker',
    domain: 'gaming',
    description: 'Live K/D ratio dashboard pulling from match telemetry.',
    releaseDate: 'May 4',
  },
  {
    dayNumber: 2,
    title: 'Pricing Page Generator',
    domain: 'saas',
    description: 'Generate calm, conversion-tuned pricing pages from a config.',
    releaseDate: 'May 5',
  },
  {
    dayNumber: 3,
    title: 'CLAUDE.md Upgrade',
    domain: 'meta',
    description: 'Lighter day. Build the doc Claude reads at the start of every session.',
    releaseDate: 'May 4',
  },
  {
    dayNumber: 4,
    title: 'Floating Ask Anything Widget',
    domain: 'ai',
    description: 'Drop-in Claude assistant widget that streams responses.',
    releaseDate: 'May 5',
  },
  {
    dayNumber: 5,
    title: 'Wallet Address Utility',
    domain: 'web3',
    description: 'Validate, format, and identify EVM addresses at a glance.',
    releaseDate: 'May 8',
  },
  {
    dayNumber: 6,
    title: 'Brazil Match Countdown',
    domain: 'gaming',
    description: 'Logo, opponent, kickoff, days/hours/minutes ticking.',
    releaseDate: 'May 7',
  },
  {
    dayNumber: 7,
    title: 'Empty State Library',
    domain: 'saas',
    description: '5 polished empty-state components in one library.',
    releaseDate: 'May 8',
  },
  {
    dayNumber: 8,
    title: 'Chat Interface Mockup',
    domain: 'ai',
    description: 'Message bubbles, streaming animation, model picker.',
    releaseDate: 'May 9',
  },
  {
    dayNumber: 9,
    title: 'Crypto Price Ticker Band',
    domain: 'web3',
    description: 'Sleek scrolling marquee of 8 tokens with 24h change.',
    releaseDate: 'May 10',
  },
  {
    dayNumber: 10,
    title: 'CoD Loadout Export Card',
    domain: 'gaming',
    description: 'Pick weapons + perks, get a polished shareable card.',
    releaseDate: 'May 11',
  },
  {
    dayNumber: 11,
    title: 'Onboarding Step Indicator',
    domain: 'saas',
    description: '3 polished variants on one page.',
    releaseDate: 'May 12',
  },
  {
    dayNumber: 12,
    title: 'Prompt Library Widget',
    domain: 'ai',
    description: 'Categories sidebar, prompt cards, copy button, localStorage.',
    releaseDate: 'May 13',
  },
  {
    dayNumber: 13,
    title: 'NFT Card Grid',
    domain: 'web3',
    description: '9 dummy NFTs, hover lift, rarity badge, floor price.',
    releaseDate: 'May 14',
  },
  {
    dayNumber: 14,
    title: 'Messi vs Ronaldo Stat Compare',
    domain: 'gaming',
    description: 'Goals, assists, trophies, big radar chart.',
    releaseDate: 'May 15',
  },
  {
    dayNumber: 15,
    title: 'Account Settings Page',
    domain: 'saas',
    description: 'Sidebar sections, profile form, danger zone, billing.',
    releaseDate: 'May 16',
  },
  {
    dayNumber: 16,
    title: 'Voice Memo Summary Card',
    domain: 'ai',
    description: 'Paste transcript, get action items + decisions + sentiment.',
    releaseDate: 'May 17',
  },
  {
    dayNumber: 17,
    title: 'Prediction Market Card (Long John tribute)',
    domain: 'web3',
    description: 'Question, yes/no shares, odds, and volume.',
    releaseDate: 'May 18',
  },
  {
    dayNumber: 18,
    title: 'Tournament Bracket',
    domain: 'gaming',
    description: '8 teams, 3 rounds, animated winner advancement.',
    releaseDate: 'May 19',
  },
  {
    dayNumber: 19,
    title: 'Notification Center',
    domain: 'saas',
    description: 'Bell icon, grouped notifications, unread dots.',
    releaseDate: 'May 20',
  },
  {
    dayNumber: 20,
    title: 'Streaming Response UI',
    domain: 'ai',
    description: 'Token-by-token reveal, cursor blink, regenerate.',
    releaseDate: 'May 21',
  },
  {
    dayNumber: 21,
    title: 'Stablecoin Swap UI',
    domain: 'web3',
    description: 'From/to inputs, slippage, route preview, gas estimate.',
    releaseDate: 'May 22',
  },
  {
    dayNumber: 22,
    title: 'GameXpay Top-up Screen',
    domain: 'gaming',
    description: 'Pick CoD Points pack, NGN price, payment method, confirm.',
    releaseDate: 'May 23',
  },
  {
    dayNumber: 23,
    title: 'Analytics Dashboard',
    domain: 'saas',
    description: '4 stat cards top, big line chart middle, filter bar.',
    releaseDate: 'May 24',
  },
  {
    dayNumber: 24,
    title: 'Agent Task List',
    domain: 'ai',
    description: 'Tasks tick off in real-time with status, sub-tasks, and progress.',
    releaseDate: 'May 25',
  },
]
