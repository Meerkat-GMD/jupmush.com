// The card value snapshot PaperVillage's tools/CardValue uploads to card_values (docs/card-value-guide-ko.md).

export type Kind = 'scored' | 'unmeasured' | 'rule' | 'held' | 'missing'

export type Card = {
  id: string
  name: string
  concept: string
  rarity: string
  cost: number
  cells: number
  shape: string
  freeCells: boolean
  exhaust: boolean
  budget: number
  formula: string
  kind: Kind
  vp?: number
  diff?: number
  percent?: number
  contribution?: number
}

export type Prices = Record<
  | 'actionCost' | 'extraCell' | 'cardBase' | 'exhaust' | 'starterGap' | 'rare' | 'epic' | 'damage' | 'block' | 'stone' | 'weak'
  | 'heal' | 'hpLoss' | 'draw' | 'attackDraw' | 'actionGain' | 'allEnemies' | 'mixedMinor' | 'fold' | 'hitShare' | 'turns'
  | 'clicks' | 'condition' | 'recall' | 'rebuild',
  number
>

export type Data = {
  version: number
  commit: string
  generatedAt: string
  baseline: number
  flagPercent: number
  prices: Prices
  cards: Card[]
}

export type Snapshot = { created_at: string; commit: string; data: Data }

export type Scored = Card & { vp: number; diff: number; percent: number; contribution: number }

export const isScored = (c: Card): c is Scored => c.vp !== undefined

// Cove categorical palette, dark steps (validated on the navy card surface), each with its own marker shape.
export const CONCEPTS = [
  { key: '스타터', color: '#3987e5', shape: 'circle' },
  { key: '공통', color: '#d95926', shape: 'square' },
  { key: '돌', color: '#199e70', shape: 'triangle' },
  { key: '회수', color: '#c98500', shape: 'diamond' },
  { key: '철거', color: '#d55181', shape: 'star' },
] as const

export type Shape = (typeof CONCEPTS)[number]['shape']

export const conceptStyle = (concept: string) => CONCEPTS.find((c) => c.key === concept) ?? { key: concept, color: '#888780', shape: 'circle' as Shape }

/** The verdicts a card earns: 강 or 약 past the flag percent, 희석 below the baseline, and the kinds that have no score. */
export function verdicts(card: Card, flag: number): string[] {
  if (card.kind === 'rule') return ['규칙 변경']
  if (card.kind === 'held') return ['보류']
  if (card.kind === 'missing') return ['공식 없음']
  const out: string[] = []
  if (isScored(card)) {
    if (card.percent > flag) out.push('강')
    if (card.percent < -flag) out.push('약')
    if (card.contribution < 0) out.push('희석')
  }
  if (card.kind === 'unmeasured') out.push('측정 전')
  return out
}

export const fmt = (n: number) => String(Math.round(n * 100) / 100)
export const signed = (n: number) => (n > 0 ? '+' : n < 0 ? '−' : '') + fmt(Math.abs(n))
