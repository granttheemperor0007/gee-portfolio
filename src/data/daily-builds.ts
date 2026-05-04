export type BuildDomain = 'gaming' | 'saas' | 'ai' | 'web3' | 'capstone'

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
    dayNumber: 5,
    title: 'Wallet Address Utility',
    domain: 'web3',
    description: 'Validate, format, and identify EVM addresses at a glance.',
    releaseDate: 'May 8',
  },
]
