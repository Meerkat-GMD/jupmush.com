// The tables of PaperVillage's tools/PlayData/analyze.py, computed in the browser from the runs table.
// Keep the two in step: same filters, same battle types, same concept rule.

export type Choice = { Offered?: string[]; Chosen?: boolean; Picked?: string }
export type Step = {
  BattleIndex?: number
  Act?: number
  Key?: string
  Strong?: boolean
  Wolf?: boolean
  StartHp?: number
  EndHp?: number
  Turns?: number
  Over?: boolean
  Lost?: boolean
  Card?: Choice
  GiftCard?: Choice
  Relic?: Choice
}
export type Summary = {
  Result?: number
  Act?: number
  Path?: Step[]
  Relics?: string[]
  Deck?: { Card: string; Count?: number }[]
}
export type Row = { install_id: string; run_id: string; version: string; received_at?: string; summary: Summary }

type SimSlot = { fought: number; hp: number; lost: number; turns: number }
type SimPool = {
  concept: string[]
  wins: number
  runs: number
  died: number[]
  slots: Record<string, SimSlot>
  adopt: Record<string, { owners: number; wins: number; adopted: number; win_owned: number }>
}
export type Sim = { label: string; created_at: string; data: { pools: Record<string, SimPool>; starter: Record<string, number> } }

export type Table = { title: string; note?: string; headers: string[]; rows: string[][] }
export type Report = {
  runs: number
  won: number
  lost: number
  abandoned: number
  installs: number
  winRate: number
  tables: Table[]
}

const WON = 1
const LOST = 2
const ABANDONED = 3 // RunResult: 0 InProgress, 1 Won, 2 Lost, 3 Abandoned
const BATTLES_PER_ACT = 9
const TYPES = ['easy', 'hard', 'strong', 'wolf']

const pct = (part: number, whole: number) => (whole ? (100 * part) / whole : 0)
const f1 = (x: number) => x.toFixed(1)
const f2 = (x: number) => x.toFixed(2)
const count = <T,>(items: T[], test: (item: T) => boolean) => items.reduce((n, item) => n + (test(item) ? 1 : 0), 0)

/** The simulation's slot: the act's last battle is the wolf, then strong villages, the first three easy, the rest hard. */
function battleType(step: Step) {
  if (step.Wolf) return 'wolf'
  if (step.Strong) return 'strong'
  return (step.BattleIndex ?? 0) % BATTLES_PER_ACT < 3 ? 'easy' : 'hard'
}

function deckCounts(summary: Summary) {
  const counts = new Map<string, number>()
  for (const row of summary.Deck ?? []) counts.set(row.Card, (counts.get(row.Card) ?? 0) + (row.Count ?? 1))
  return counts
}

/** The concept with the most of its cards in the final deck, starter copies not counted. */
function conceptOf(summary: Summary, sim: Sim) {
  const counts = deckCounts(summary)
  const scores = Object.entries(sim.data.pools).map(([name, pool]) => [
    name,
    pool.concept.reduce((n, card) => n + Math.max(0, (counts.get(card) ?? 0) - (sim.data.starter[card] ?? 0)), 0),
  ] as const)
  const best = Math.max(0, ...scores.map(([, score]) => score))
  if (best === 0) return 'none'
  const leaders = scores.filter(([, score]) => score === best)
  return leaders.length === 1 ? leaders[0][0] : 'mixed'
}

function groupBy<T>(items: T[], key: (item: T) => string) {
  const groups = new Map<string, T[]>()
  for (const item of items) {
    const k = key(item)
    groups.set(k, [...(groups.get(k) ?? []), item])
  }
  return groups
}

export function report(rows: Row[], sim: Sim | null): Report {
  const summaries = rows.map((r) => r.summary)
  const finished = summaries.filter((s) => s.Result === WON || s.Result === LOST)
  const won = count(finished, (s) => s.Result === WON)
  const lostRuns = finished.filter((s) => s.Result === LOST)
  const pools = sim ? Object.entries(sim.data.pools) : []
  const tables: Table[] = []

  if (sim) {
    tables.push({
      title: '시뮬레이션 승률',
      headers: ['pool', 'runs', 'win%'],
      rows: pools.map(([name, p]) => [name, String(p.runs), f1(pct(p.wins, p.runs))]),
    })
  }

  // Deaths by act: the act of the battle the run was lost in.
  const diedAct = [0, 0, 0, 0]
  let diedWolf = 0
  for (const s of lostRuns) {
    const step = [...(s.Path ?? [])].reverse().find((p) => p.Lost)
    const act = step?.Act ?? s.Act ?? 0
    if (act >= 1 && act <= 3) diedAct[act]++
    if (step?.Wolf) diedWolf++
  }
  tables.push({
    title: '막별 사망',
    note: `패배 ${lostRuns.length}런 중 늑대전 사망 ${f1(pct(diedWolf, lostRuns.length))}%`,
    headers: ['act', 'died', 'died% of runs', 'loss share%', ...pools.map(([n]) => `sim ${n} share%`)],
    rows: [1, 2, 3].map((a) => [
      String(a),
      String(diedAct[a]),
      f1(pct(diedAct[a], finished.length)),
      f1(pct(diedAct[a], lostRuns.length)),
      ...pools.map(([, p]) => f1(pct(p.died.slice((a - 1) * 4, a * 4).reduce((x, y) => x + y, 0), p.runs - p.wins))),
    ]),
  })

  // Battles: every closed step of every run, abandoned runs included.
  const steps = summaries.flatMap((s) => (s.Path ?? []).filter((p) => p.Over))
  const battleCells = (items: Step[]) => {
    const n = items.length
    const sum = (f: (p: Step) => number) => items.reduce((x, p) => x + f(p), 0)
    return [
      String(n),
      f1(pct(count(items, (p) => !!p.Lost), finished.length)),
      f1(sum((p) => p.StartHp ?? 0) / n),
      f1(sum((p) => (p.StartHp ?? 0) - Math.max(0, p.EndHp ?? 0)) / n),
      f2(sum((p) => p.Turns ?? 0) / n),
    ]
  }
  const bySlot = [...groupBy(steps, (p) => `${p.Act ?? 0} ${battleType(p)}`)].sort(
    ([a], [b]) => Number(a.split(' ')[0]) - Number(b.split(' ')[0]) || TYPES.indexOf(a.split(' ')[1]) - TYPES.indexOf(b.split(' ')[1]),
  )
  const simRuns = pools.reduce((n, [, p]) => n + p.runs, 0)
  tables.push({
    title: '막·유형별 전투',
    note: 'died%는 승리+패배 런 대비. 시뮬레이션 열은 풀 전체를 전투 수로 가중 평균',
    headers: ['act', 'type', 'fought', 'died%', 'hp at start', 'hp lost', 'turns', ...(sim ? ['sim fought', 'sim died%', 'sim hp lost', 'sim turns'] : [])],
    rows: bySlot.map(([slot, items]) => {
      const [act, kind] = slot.split(' ')
      const cells = [act, kind, ...battleCells(items)]
      if (!sim) return cells
      const parts = pools.map(([, p]) => [p.slots[slot], p.died[(Number(act) - 1) * 4 + TYPES.indexOf(kind)] ?? 0] as const)
      const fought = parts.reduce((n, [s]) => n + (s?.fought ?? 0), 0)
      const weighted = (f: (s: SimSlot) => number) => parts.reduce((n, [s]) => n + (s ? f(s) * s.fought : 0), 0) / fought
      return [
        ...cells,
        String(fought),
        f1(pct(parts.reduce((n, [, d]) => n + d, 0), simRuns)),
        fought ? f1(weighted((s) => s.lost)) : '-',
        fought ? f2(weighted((s) => s.turns)) : '-',
      ]
    }),
  })

  const byKey = [...groupBy(steps, (p) => `${p.Act ?? 0}\u0000${p.Key ?? ''}`)].sort(([a], [b]) => a.localeCompare(b))
  tables.push({
    title: '조우별 전투',
    headers: ['act', 'encounter', 'fought', 'died%', 'hp at start', 'hp lost', 'turns'],
    rows: byKey.map(([key, items]) => [...key.split('\u0000'), ...battleCells(items)]),
  })

  // Reward offers: only answered offers count; an empty pick is a skip.
  for (const [kind, title] of [['Card', '카드 보상'], ['GiftCard', '선물 카드 보상'], ['Relic', '유물 보상']] as const) {
    const offered = new Map<string, number>()
    const picked = new Map<string, number>()
    let answered = 0
    let skipped = 0
    for (const p of steps) {
      const choice = p[kind]
      if (!choice?.Chosen || !choice.Offered?.length) continue
      answered++
      for (const item of new Set(choice.Offered)) offered.set(item, (offered.get(item) ?? 0) + 1)
      if (choice.Picked) picked.set(choice.Picked, (picked.get(choice.Picked) ?? 0) + 1)
      else skipped++
    }
    const rate = (item: string) => pct(picked.get(item) ?? 0, offered.get(item) ?? 0)
    tables.push({
      title,
      note: `응답한 제시 ${answered}회, 건너뜀 ${f1(pct(skipped, answered))}%`,
      headers: ['item', 'offered', 'picked', 'pick%'],
      rows: [...offered]
        .sort(([a, n], [b, m]) => rate(b) - rate(a) || m - n || a.localeCompare(b))
        .map(([item, n]) => [item, String(n), String(picked.get(item) ?? 0), f1(rate(item))]),
    })
  }

  // Final deck and relics against the result.
  const simAdopt = Object.assign({}, ...pools.map(([, p]) => p.adopt)) as SimPool['adopt']
  for (const [title, ownedOf, withSim] of [
    ['최종 덱 카드', (s: Summary) => new Set(deckCounts(s).keys()), true],
    ['최종 유물', (s: Summary) => new Set(s.Relics ?? []), false],
  ] as const) {
    const owners = new Map<string, [number, number]>()
    for (const s of finished)
      for (const item of ownedOf(s)) {
        const [n, w] = owners.get(item) ?? [0, 0]
        owners.set(item, [n + 1, w + (s.Result === WON ? 1 : 0)])
      }
    const showSim = sim && withSim
    tables.push({
      title,
      note: `승리+패배 ${finished.length}런 기준` + (showSim ? '. 시뮬레이션은 런 중 한 번이라도 가진 카드를 센다' : ''),
      headers: ['item', 'owned runs', 'owned wins', 'owned%', 'win-if-owned%', ...(showSim ? ['sim owned%', 'sim win-if-owned%'] : [])],
      rows: [...owners]
        .sort(([a, [n]], [b, [m]]) => m - n || a.localeCompare(b))
        .map(([item, [n, w]]) => {
          const a = simAdopt[item]
          return [item, String(n), String(w), f1(pct(n, finished.length)), f1(pct(w, n)),
            ...(showSim ? (a ? [f1(a.adopted), f1(a.win_owned)] : ['-', '-']) : [])]
        }),
    })
  }

  if (sim) {
    const byConcept = groupBy(finished, (s) => conceptOf(s, sim))
    tables.push({
      title: '덱 컨셉',
      note: '최종 덱에 가장 많이 든 컨셉 카드 기준, 시작 덱 장수는 제외',
      headers: ['concept', 'runs', 'wins', 'win%', 'sim win%'],
      rows: [...pools.map(([n]) => n), 'mixed', 'none'].map((c) => {
        const runs = byConcept.get(c) ?? []
        const w = count(runs, (s) => s.Result === WON)
        const p = sim.data.pools[c]
        return [c, String(runs.length), String(w), f1(pct(w, runs.length)), p ? f1(pct(p.wins, p.runs)) : '-']
      }),
    })
  }

  return {
    runs: summaries.length,
    won,
    lost: lostRuns.length,
    abandoned: count(summaries, (s) => s.Result === ABANDONED),
    installs: new Set(rows.map((r) => r.install_id)).size,
    winRate: pct(won, finished.length),
    tables,
  }
}

/** Newest release first: 0.1.10 above 0.1.9. */
export function compareVersions(a: string, b: string) {
  const pa = a.split('.').map(Number)
  const pb = b.split('.').map(Number)
  for (let i = 0; i < Math.max(pa.length, pb.length); i++) {
    const d = (pb[i] ?? 0) - (pa[i] ?? 0)
    if (d) return d
  }
  return 0
}
