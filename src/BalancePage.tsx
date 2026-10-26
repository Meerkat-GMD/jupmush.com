import type { Session } from '@supabase/supabase-js'
import { useCallback, useEffect, useMemo, useState, type ReactNode } from 'react'

import { Scatter, type Point } from '@/balance/Scatter'
import { CONCEPTS, conceptStyle, fmt, isScored, signed, verdicts, type Card, type Scored, type Snapshot } from '@/balance/model'
import { Button } from '@/components/ui/button'
import { SignIn } from '@/components/SignIn'
import { supabase } from '@/lib/supabase'

async function loadSnapshots() {
  const { data, error } = await supabase.from('card_values').select('created_at,commit,data').order('id', { ascending: false }).limit(2)
  if (error) throw error
  return data as Snapshot[]
}

function Tip({ card, flag }: { card: Scored; flag: number }) {
  const v = verdicts(card, flag)
  return (
    <>
      <p className="text-sm text-heading">{card.name}</p>
      <p className="text-muted-foreground">{card.concept} · {card.rarity} · 코스트 {card.cost} · {card.shape}</p>
      <p className="mt-1">{card.formula}</p>
      <p className="mt-1 tabular-nums">효율: 효과 {fmt(card.vp)} / 예산 {fmt(card.budget)} → {signed(card.diff)} ({signed(Math.round(card.percent))}%)</p>
      <p className="tabular-nums">덱 기여: {signed(card.contribution)}</p>
      {v.length > 0 && <p className="mt-1 text-highlight">{v.join(' · ')}</p>}
    </>
  )
}

/** Identical coordinates move a little apart so every card stays visible. */
function spread<T>(items: T[], at: (t: T) => [number, number], nudge: (v: number, n: number) => number) {
  const seen = new Map<string, number>()
  return items.map((t) => {
    const [x, y] = at(t)
    const key = `${x}|${y}`
    const n = seen.get(key) ?? 0
    seen.set(key, n + 1)
    return { item: t, x: nudge(x, n), y: nudge(y, n) }
  })
}

const ticks = (min: number, max: number, step: number) => {
  const out: number[] = []
  for (let t = Math.ceil(min / step) * step; t <= max; t += step) out.push(t)
  return out
}

type SortKey = 'name' | 'concept' | 'rarity' | 'cost' | 'vp' | 'budget' | 'percent' | 'contribution' | 'change'

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="space-y-2">
      <h2 className="text-base text-heading">{title}</h2>
      {children}
    </section>
  )
}

export default function BalancePage() {
  const [session, setSession] = useState<Session | null | undefined>(undefined)
  const [snapshots, setSnapshots] = useState<Snapshot[] | null>(null)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [hidden, setHidden] = useState<Set<string>>(new Set())
  const [query, setQuery] = useState('')
  const [sort, setSort] = useState<{ key: SortKey; desc: boolean }>({ key: 'percent', desc: true })

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setSession(data.session))
    const { data } = supabase.auth.onAuthStateChange((_event, next) => setSession(next))
    if (import.meta.env.DEV) Object.assign(window, { __balance: (latest: Snapshot, previous?: Snapshot) => setSnapshots(previous ? [latest, previous] : [latest]) })
    return () => data.subscription.unsubscribe()
  }, [])

  const admin = !!session?.user.app_metadata?.playdata_admin

  const refresh = useCallback(async () => {
    setLoading(true)
    setError('')
    try {
      setSnapshots(await loadSnapshots())
    } catch (e) {
      setError(`불러오지 못했습니다: ${(e as { message?: string }).message ?? e}`)
    }
    setLoading(false)
  }, [])

  useEffect(() => {
    if (admin) refresh()
  }, [admin, refresh])

  const latest = snapshots?.[0]?.data
  const previous = useMemo(() => new Map((snapshots?.[1]?.data.cards ?? []).map((c) => [c.id, c])), [snapshots])
  const cards = useMemo(() => (latest?.cards ?? []).filter((c) => !hidden.has(c.concept)), [latest, hidden])
  const scored = useMemo(() => cards.filter(isScored), [cards])

  if (!latest) {
    if (snapshots === null && session === undefined) return null
    if (snapshots === null && !session) return <SignIn title="카드 밸런스" />
    if (snapshots === null && !admin)
      return (
        <div className="mx-auto mt-16 max-w-xs text-sm">
          <p>이 계정에는 카드 밸런스를 읽을 권한이 없습니다.</p>
          <Button variant="link" className="px-0" onClick={() => supabase.auth.signOut()}>로그아웃</Button>
        </div>
      )
    return (
      <p className="mt-16 text-center text-sm text-muted-foreground">
        {error || (snapshots ? '아직 올라온 점수가 없습니다. PaperVillage에서 tools/CardValue로 올리면 나타납니다.' : '불러오는 중…')}
      </p>
    )
  }

  const p = latest.prices
  const B = latest.baseline
  const flag = latest.flagPercent
  const change = (c: Card) => {
    const before = previous.get(c.id)
    if (!snapshots?.[1]) return undefined
    if (!before) return '새 카드'
    if (!isScored(c) || !isScored(before)) return c.formula === before.formula ? undefined : '공식 바뀜'
    const d = c.diff - before.diff
    const k = c.contribution - before.contribution
    if (Math.abs(d) < 0.005 && Math.abs(k) < 0.005) return c.formula === before.formula ? undefined : '공식 바뀜'
    return `효율 ${signed(d)} · 기여 ${signed(k)}`
  }

  const quad = spread(scored, (c) => [c.diff, c.contribution], (v, n) => v + n * 0.35)
  const xs = scored.map((c) => c.diff)
  const ys = scored.map((c) => c.contribution)
  // Room past the outermost cards keeps the corner names clear of them.
  const qx = { min: Math.floor(Math.min(-5, ...xs) / 5) * 5 - 2, max: Math.ceil(Math.max(5, ...xs) / 5) * 5 + 2 }
  const qy = { min: Math.floor(Math.min(-5, ...ys) / 5) * 5 - 2, max: Math.ceil(Math.max(5, ...ys) / 5) * 5 + 5 }
  const point = (c: Scored, x: number, y: number, label: boolean): Point => {
    const s = conceptStyle(c.concept)
    return { id: c.id, x, y, color: s.color, shape: s.shape, hollow: c.kind === 'unmeasured', label: label ? c.name : undefined, tip: <Tip card={c} flag={flag} /> }
  }
  const quadPoints = quad.map(({ item, x, y }) => point(item, x, y, Math.abs(item.diff) >= 5 || item.contribution >= 12 || item.contribution <= -4))
  const curve = spread(scored, (c) => [c.budget, c.vp], (v, n) => v * (1 + n * 0.035))
  const lo = Math.min(1, ...scored.map((c) => Math.min(c.budget, c.vp))) * 0.8
  const hi = Math.max(40, ...scored.map((c) => Math.max(c.budget, c.vp))) * 1.05
  const curvePoints = curve.map(({ item, x, y }) => point(item, x, y, Math.abs(item.diff) >= 5))

  const shown = cards
    .filter((c) => !query || c.name.includes(query.trim()))
    .sort((a, b) => {
      const key = sort.key
      const val = (c: Card): number | string =>
        key === 'change' ? (change(c) ?? '') : key === 'name' || key === 'concept' || key === 'rarity' ? c[key] : (c[key] ?? -Infinity)
      const va = val(a)
      const vb = val(b)
      const r = typeof va === 'number' && typeof vb === 'number' ? va - vb : String(va).localeCompare(String(vb), 'ko')
      return sort.desc ? -r : r
    })
  const count = (v: string) => (latest.cards ?? []).filter((c) => verdicts(c, flag).includes(v)).length
  const stats = [
    ['카드', latest.cards.length],
    ['강', count('강')],
    ['약', count('약')],
    ['희석', count('희석')],
    ['측정 전', count('측정 전')],
    ['공식 없음', count('공식 없음')],
  ] as const
  const header = (key: SortKey, label: string, right = true) => (
    <th className={`px-2 py-1.5 font-normal whitespace-nowrap ${right ? 'text-right' : 'text-left'}`}>
      <button className="hover:text-heading" onClick={() => setSort((s) => ({ key, desc: s.key === key ? !s.desc : true }))}>
        {label}{sort.key === key ? (sort.desc ? ' ↓' : ' ↑') : ''}
      </button>
    </th>
  )

  return (
    <main className="mx-auto flex max-w-[1100px] flex-col gap-5 px-4 py-5">
      <header className="flex flex-wrap items-center gap-x-3 gap-y-2">
        <h1 className="mr-auto text-lg text-heading">카드 밸런스</h1>
        <Button variant="secondary" size="sm" onClick={refresh} disabled={loading}>{loading ? '불러오는 중…' : '새로고침'}</Button>
        <Button variant="ghost" size="sm" onClick={() => supabase.auth.signOut().then(() => setSnapshots(null))}>로그아웃</Button>
      </header>
      <p className="-mt-3 text-xs text-muted-foreground">
        빨간 망토의 카드 {latest.cards.length}장 · PaperVillage 커밋 {latest.commit} · {new Date(latest.generatedAt).toLocaleString('ko-KR')} 계산
        {snapshots?.[1] ? ` · 비교: 커밋 ${snapshots[1].data.commit}` : ''}
      </p>
      {error && <p className="text-xs text-destructive">{error}</p>}

      <div className="grid grid-cols-3 gap-2 sm:grid-cols-6">
        {stats.map(([label, value]) => (
          <div key={label} className="rounded-lg bg-card px-3 py-2 ring-1 ring-foreground/10">
            <p className="text-xs text-muted-foreground">{label}</p>
            <p className="text-lg text-heading tabular-nums">{value}</p>
          </div>
        ))}
      </div>

      <div className="flex flex-wrap items-center gap-2 text-xs">
        <span className="text-muted-foreground">개념</span>
        {CONCEPTS.map((c) => (
          <button
            key={c.key}
            onClick={() => setHidden((h) => { const n = new Set(h); if (n.has(c.key)) n.delete(c.key); else n.add(c.key); return n })}
            className={`flex items-center gap-1.5 rounded-md bg-secondary px-2.5 py-1 text-heading ${hidden.has(c.key) ? 'opacity-40' : ''}`}
          >
            <svg width="10" height="10" viewBox="-6 -6 12 12" aria-hidden><circle r="5" fill={c.color} /></svg>
            {c.key} {(latest.cards ?? []).filter((x) => x.concept === c.key).length}
          </button>
        ))}
        <span className="text-muted-foreground">모양: ● 스타터 ■ 공통 ▲ 돌 ◆ 회수 ★ 철거 · 속이 빈 점은 측정 전</span>
      </div>

      <section className="rounded-lg bg-card p-3 ring-1 ring-foreground/10">
        <h2 className="mb-1 text-sm text-heading">효율과 덱 기여</h2>
        <Scatter
          points={quadPoints}
          x={{ ...qx, title: '효율: 효과 VP − 예산 (오른쪽일수록 비용 대비 강함)', ticks: ticks(qx.min, qx.max, 5) }}
          y={{ ...qy, title: `덱 기여 (B = ${fmt(B)})`, ticks: ticks(qy.min, qy.max, 5) }}
          guides={[
            { from: [0, qy.min], to: [0, qy.max], label: '곡선 (효율 0)', strong: true },
            { from: [qx.min, 0], to: [qx.max, 0], label: '기준선 B (덱 기여 0)', strong: true },
          ]}
          corners={['비싸지만 집을 만함', '강하고 집을 만함', '약하고 덱을 희석', '싸지만 덱을 희석']}
          ariaLabel="가로축은 효율 차이, 세로축은 덱 기여인 카드 산점도"
        />
      </section>

      <section className="rounded-lg bg-card p-3 ring-1 ring-foreground/10">
        <h2 className="mb-1 text-sm text-heading">
          예산과 효과 (로그 축) <span className="text-xs text-muted-foreground">· 점선은 곡선에서 ±{fmt(flag)}%</span>
        </h2>
        <Scatter
          points={curvePoints}
          x={{ min: lo, max: hi, log: true, title: '예산 VP (비용 × 희귀도)', ticks: [1, 2, 5, 10, 20, 40].filter((t) => t >= lo && t <= hi) }}
          y={{ min: lo, max: hi, log: true, title: '효과 VP', ticks: [1, 2, 5, 10, 20, 40].filter((t) => t >= lo && t <= hi) }}
          guides={[
            { from: [lo, lo], to: [hi, hi], label: '곡선 (효과 = 예산)', strong: true },
            { from: [lo, lo * (1 + flag / 100)], to: [hi / (1 + flag / 100), hi], dashed: true },
            { from: [lo / (1 - flag / 100), lo], to: [hi, hi * (1 - flag / 100)], dashed: true },
          ]}
          ariaLabel="가로축은 예산, 세로축은 효과 VP인 로그 축 카드 산점도"
        />
      </section>

      <section className="rounded-lg bg-card ring-1 ring-foreground/10">
        <div className="flex flex-wrap items-center gap-2 px-3 pt-3 pb-2">
          <h2 className="mr-auto text-sm text-heading">카드 점수표</h2>
          <input
            className="h-8 w-44 rounded-md bg-secondary px-2 text-xs text-heading outline-none focus:ring-2 focus:ring-ring"
            placeholder="카드 이름 검색"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
        <div className="overflow-x-auto pb-2">
          <table className="w-full text-xs tabular-nums">
            <thead>
              <tr className="border-b border-secondary text-muted-foreground">
                {header('name', '카드', false)}
                {header('concept', '개념', false)}
                {header('rarity', '등급', false)}
                {header('cost', '코스트/모양', false)}
                <th className="px-2 py-1.5 text-left font-normal">계산</th>
                {header('vp', '효과 VP')}
                {header('budget', '예산')}
                {header('percent', '효율')}
                {header('contribution', '덱 기여')}
                <th className="px-2 py-1.5 text-left font-normal whitespace-nowrap">판정</th>
                {header('change', '지난 갱신 대비', false)}
              </tr>
            </thead>
            <tbody>
              {shown.map((c) => (
                <tr key={c.id} className="border-b border-secondary/40 last:border-0">
                  <td className="sticky left-0 bg-card px-2 py-1 whitespace-nowrap text-heading">{c.name}</td>
                  <td className="px-2 py-1 whitespace-nowrap">{c.concept}</td>
                  <td className="px-2 py-1 whitespace-nowrap">{c.rarity}</td>
                  <td className="px-2 py-1 whitespace-nowrap">
                    {c.cost}/{c.shape}{c.exhaust ? ' · 가건물' : ''}{c.freeCells ? ' · 칸 비용 없음' : ''}
                  </td>
                  <td className="min-w-56 px-2 py-1">{c.formula}</td>
                  <td className="px-2 py-1 text-right">{isScored(c) ? fmt(c.vp) : '–'}</td>
                  <td className="px-2 py-1 text-right">{fmt(c.budget)}</td>
                  <td className="px-2 py-1 text-right whitespace-nowrap">{isScored(c) ? `${signed(Math.round(c.percent))}% (${signed(c.diff)})` : '–'}</td>
                  <td className="px-2 py-1 text-right">{isScored(c) ? signed(c.contribution) : '–'}</td>
                  <td className="px-2 py-1 whitespace-nowrap text-highlight">{verdicts(c, flag).join(', ')}</td>
                  <td className="px-2 py-1 whitespace-nowrap text-muted-foreground">{change(c) ?? (snapshots?.[1] ? '' : '–')}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <article className="space-y-6 text-sm leading-relaxed text-foreground/90 [&_li]:ml-4 [&_li]:list-disc [&_table]:text-xs [&_td]:border-b [&_td]:border-secondary/40 [&_td]:px-2 [&_td]:py-1 [&_th]:px-2 [&_th]:py-1 [&_th]:text-left [&_th]:font-normal [&_th]:text-muted-foreground">
        <Section title="이 페이지">
          <p>
            빨간 망토가 가질 수 있는 카드를 PaperVillage의 카드 가치 기준(docs/card-value-guide-ko.md)으로 점수 매긴 결과입니다.
            기준은 2026-10-26에 정했고, 모든 가격과 기대 개수는 실험값입니다. 이 점수는 판단을 돕는 도구일 뿐이며 봇 시뮬레이션이나
            플레이 체감을 대신하지 않습니다. 점수와 체감이 어긋나는 카드가 가장 먼저 살펴볼 카드입니다.
          </p>
        </Section>

        <Section title="그래프는 어떻게 그렸나">
          <p>점 하나가 카드 한 장입니다. 색과 모양은 덱 개념을 나타내고, 속이 빈 점은 아직 실측하지 않은 지속 카드입니다. 점을 누르거나 마우스를 올리면 계산식이 나옵니다.</p>
          <ul>
            <li><b>예산</b>은 카드가 치른 비용을 VP로 바꾼 값입니다. 피해 1 = 1 VP입니다.</li>
            <li><b>효과 VP</b>는 카드 효과를 같은 단위로 바꾼 값입니다.</li>
            <li><b>효율</b>은 효과 VP − 예산입니다. 0이면 비용에 딱 맞는 카드입니다.</li>
            <li><b>덱 기여</b>는 이 카드 한 장이 스타터 한 장(B = {fmt(B)} VP)보다 얼마나 나은지입니다. 덱에서 카드를 지울 방법이 적어서, 효율이 좋아도 한 장의 힘이 약하면 좋은 카드를 뽑을 기회를 빼앗습니다.</li>
          </ul>
        </Section>

        <Section title="첫 번째 그래프 읽는 법">
          <p>가운데 세로줄이 <b>곡선</b>(효율 0)이고, 가운데 가로줄이 <b>기준선 B</b>(덱 기여 0)입니다. 두 줄이 화면을 네 칸으로 나눕니다.</p>
          <table>
            <thead><tr><th>위치</th><th>뜻</th><th>설계에서 할 일</th></tr></thead>
            <tbody>
              <tr><td>오른쪽 위</td><td>싸고 강하며 집을 만함</td><td>멀리 떨어질수록 하향 후보</td></tr>
              <tr><td>왼쪽 위</td><td>비싸지만 한 장에 많이 담아 집을 만함</td><td>대체로 괜찮음</td></tr>
              <tr><td>오른쪽 아래</td><td>효율은 좋지만 한 장의 힘이 약해 덱을 희석함</td><td>수치를 몰아 주거나 정리할 후보</td></tr>
              <tr><td>왼쪽 아래</td><td>약하고 덱도 희석함</td><td>상향하거나 삭제할 후보</td></tr>
            </tbody>
          </table>
          <p>균형이 잘 맞은 일반 카드는 원점에서 조금 위(효율 0 근처, 덱 기여 +3 안팎)에 모입니다. 곡선에서 5 VP 넘게 벗어났거나, 덱 기여가 +12 이상이거나 −4 이하인 카드에는 이름을 붙였습니다.</p>
        </Section>

        <Section title="두 번째 그래프 읽는 법">
          <p>
            가로축은 예산, 세로축은 효과 VP입니다. 대각선 실선이 곡선이고, 점선은 곡선에서 ±{fmt(flag)}% 떨어진 선입니다. 점선 밖의 카드가 "강" 또는 "약"입니다.
            0코스트 카드는 예산이 2 근처에 몰려 있어서 두 축 모두 로그 눈금으로 그렸습니다. 같은 1 VP 차이라도 예산이 작은 카드에서는 퍼센트가 크게 나온다는 점을 함께 보세요.
          </p>
        </Section>

        <Section title="계산 방법">
          <p><b>예산</b> = (비용 VP + 가건물 {fmt(p.exhaust)}) × 희귀도 배율</p>
          <ul>
            <li>비용 VP = {fmt(p.actionCost)} × 배치 코스트 + {fmt(p.extraCell)} × (칸 수 − 1) + 모양 보정 + {fmt(p.cardBase)}. 모양 보정은 1~2칸 0, 3칸(일자·ㄱ자) +1, 2×2 +2입니다.</li>
            <li>철거·피격 효과가 있는 건물과 재건축 건물은 추가 칸 비용이 없습니다. 습격 칸에 맞고 싶거나 기존 건물 위에 짓기 때문입니다.</li>
            <li>희귀도 배율은 일반 1, 희귀 {fmt(p.rare)}, 영웅 {fmt(p.epic)}입니다. 스타터는 곡선보다 {fmt(p.starterGap)} 낮게 둡니다.</li>
          </ul>
          <p><b>효과 가격</b> (1 VP = 피해 1)</p>
          <ul>
            <li>피해 {fmt(p.damage)}, 방어 {fmt(p.block)}, 돌 {fmt(p.stone)}, 약화 {fmt(p.weak)}, 회복 {fmt(p.heal)}, 체력 잃기 {fmt(p.hpLoss)}</li>
            <li>드로우 {fmt(p.draw)} (적이 공격하는 도중이면 다음 턴 손패로 넘어가므로 {fmt(p.attackDraw)}), 행동 획득 {fmt(p.actionGain)}, 회수 {fmt(p.recall)}, 재건축 기존 건물 1채당 {fmt(p.rebuild)}</li>
            <li>모든 적 대상 × {fmt(p.allEnemies)}. 공격(피해·돌)과 방어(방어·약화·회복)가 섞이면 작은 쪽 × {fmt(p.mixedMinor)}</li>
          </ul>
          <p><b>발동 조건</b></p>
          <ul>
            <li>건설·철거 × 1, 접기 × {fmt(p.fold)}, 피격은 내구도 × {fmt(p.hitShare)}회, 턴 시작·턴 종료 {fmt(p.turns)}회, 클릭은 (효과 − {fmt(p.actionCost)} × 클릭 코스트) × {fmt(p.clicks)}회</li>
            <li>지속은 이벤트 1회 가치 × 턴당 이벤트 수 × 서 있는 {fmt(p.turns)}턴입니다.</li>
            <li>"~마다" 수치는 기대 개수를 곱하고, 충족 여부만 따지는 조건은 {fmt(p.condition * 100)}%로 봅니다. 쓴 기대 개수는 카드별 계산식에 나옵니다.</li>
          </ul>
          <p><b>덱 기여</b> = (드로우를 뺀 효과 VP) − B × (1 − 드로우 수) + B × 행동·드로우 짝의 수</p>
          <ul>
            <li>카드를 뽑는 카드는 자기 자리를 다른 카드로 채우므로 덱을 희석하지 않습니다. 0코스트에 드로우 1인 카드의 덱 기여는 0입니다.</li>
            <li>행동과 드로우를 함께 주면 카드 한 장을 더 쓰는 것이므로 짝마다 B를 더합니다.</li>
          </ul>
        </Section>

        <Section title="판정">
          <ul>
            <li><b>강·약</b>: 효율이 ±{fmt(flag)}%를 넘음 · <b>희석</b>: 덱 기여가 0보다 작음 · <b>측정 전</b>: 기대 횟수가 임시값인 지속 카드</li>
            <li><b>규칙 변경</b>: 규칙을 바꾸는 영웅이라 공식으로 평가하지 않음 · <b>보류</b>: 효과의 가격이 아직 없음 · <b>공식 없음</b>: 계산식을 아직 쓰지 않은 카드</li>
          </ul>
        </Section>

        <Section title="한계와 갱신">
          <ul>
            <li>기대 개수, 피격 × {fmt(p.hitShare)}, {fmt(p.turns)}턴 같은 값은 임시값입니다. 봇으로 건물마다 실제 발동 횟수와 생존 턴을 재면 바꿀 예정입니다.</li>
            <li>점수는 PaperVillage의 tools/CardValue가 카탈로그의 수치를 직접 읽어 계산합니다. 수치만 바꾼 밸런스 조정은 그대로 반영되고, 효과를 바꾸거나 새 카드를 넣으면 그 카드의 계산식을 고쳐야 합니다.</li>
            <li>PaperVillage의 main에 카드 파일을 바꾼 커밋이 생기면 자동으로 다시 계산해 올립니다. "지난 갱신 대비" 열은 바로 전에 올린 결과와 비교한 변화입니다.</li>
          </ul>
        </Section>
      </article>
    </main>
  )
}
