import { useState } from 'react'

import { battleType, conceptOf, labeler, type Names, type Row, type Sim, type Step } from '@/playdata/stats'

const RESULTS: Record<number, [string, string]> = {
  0: ['진행 중', 'text-muted-foreground'],
  1: ['승리', 'text-emerald-400'],
  2: ['패배', 'text-destructive'],
  3: ['포기', 'text-muted-foreground'],
}
const BATTLES_PER_ACT = 9
const TYPE_NAMES: Record<string, string> = { easy: '쉬움', hard: '어려움', strong: '강한 마을', wolf: '늑대' }

const when = (utc?: string) => (utc ? new Date(utc).toLocaleString('ko-KR', { dateStyle: 'short', timeStyle: 'short' }) : '-')

/** Every run on its own, newest first: a one-line summary that opens to its battles, final deck and relics. */
export function RunList({ rows, sim, names }: { rows: Row[]; sim: Sim | null; names: Names | null }) {
  const l = labeler(names)
  const [install, setInstall] = useState<string | null>(null)
  const sorted = rows.filter((r) => !install || r.install_id === install).sort((a, b) => (b.received_at ?? '').localeCompare(a.received_at ?? ''))
  const choice = (c: Step['Card'], label: (id: string) => string) =>
    !c?.Offered?.length ? '' : !c.Chosen ? '고르지 않음' : c.Picked ? label(c.Picked) : '건너뜀'

  if (sorted.length === 0) return <p className="text-xs text-muted-foreground">데이터 없음</p>
  return (
    <div className="flex flex-col gap-2">
      {install && (
        <p className="flex items-center gap-2 text-xs text-muted-foreground">
          설치 {install.slice(0, 8)}의 런만 보는 중 · {sorted.length}런
          <button type="button" className="underline hover:text-heading" onClick={() => setInstall(null)}>모두 보기</button>
        </p>
      )}
      {sorted.map((r) => {
        const s = r.summary
        const [result, color] = RESULTS[s.Result ?? 0] ?? RESULTS[0]
        const steps = (s.Path ?? []).filter((p) => p.Over)
        const deck = [...(s.Deck ?? [])].sort((a, b) => (b.Count ?? 1) - (a.Count ?? 1))
        return (
          <details key={`${r.install_id}/${r.run_id}`} className="rounded-lg bg-card ring-1 ring-foreground/10">
            <summary className="flex cursor-pointer flex-wrap items-baseline gap-x-3 gap-y-0.5 px-3 py-2 text-sm">
              <span className={`w-10 ${color}`}>{result}</span>
              <span className="text-heading tabular-nums">{s.Act ?? '-'}막 · 전투 {s.Battle ?? steps.length}</span>
              <span className="text-xs text-muted-foreground tabular-nums">체력 {s.Hp ?? '-'}/{s.MaxHp ?? '-'}</span>
              {sim && <span className="text-xs text-muted-foreground">{l.concept(conceptOf(s, sim))}</span>}
              {!!s.LostTo?.length && <span className="text-xs text-muted-foreground">{s.LostTo.map(l.enemy).join(', ')}에게 패배</span>}
              <span className="ml-auto text-xs text-muted-foreground tabular-nums">
                {when(r.received_at)} · {r.version} ·{' '}
                <button
                  type="button"
                  className="underline decoration-dotted hover:text-heading"
                  title="이 설치의 런만 보기"
                  onClick={(e) => {
                    e.preventDefault()
                    setInstall(install === r.install_id ? null : r.install_id)
                  }}
                >
                  {r.install_id.slice(0, 8)}
                </button>
              </span>
            </summary>

            <div className="flex flex-col gap-3 border-t border-secondary px-3 py-3 text-xs">
              <div className="overflow-x-auto">
                <table className="w-full tabular-nums">
                  <thead>
                    <tr className="border-b border-secondary text-muted-foreground">
                      {['전투', '조우', '유형', '체력', '턴', '카드 보상', '선물 카드', '유물'].map((h) => (
                        <th key={h} className="px-2 py-1 text-left font-normal whitespace-nowrap">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {steps.map((p) => (
                      <tr key={p.BattleIndex} className={`border-b border-secondary/40 last:border-0 ${p.Lost ? 'text-destructive' : ''}`}>
                        <td className="px-2 py-1 whitespace-nowrap">{p.Act}막 {((p.BattleIndex ?? 0) % BATTLES_PER_ACT) + 1}</td>
                        <td className="px-2 py-1 whitespace-nowrap">{l.encounter(p.Key ?? '')}</td>
                        <td className="px-2 py-1 whitespace-nowrap">{TYPE_NAMES[battleType(p)]}</td>
                        <td className="px-2 py-1 whitespace-nowrap">{p.StartHp} → {Math.max(0, p.EndHp ?? 0)}</td>
                        <td className="px-2 py-1">{p.Turns}</td>
                        <td className="px-2 py-1 whitespace-nowrap" title={p.Card?.Offered?.map(l.card).join(', ')}>{choice(p.Card, l.card)}</td>
                        <td className="px-2 py-1 whitespace-nowrap" title={p.GiftCard?.Offered?.map(l.card).join(', ')}>{choice(p.GiftCard, l.card)}</td>
                        <td className="px-2 py-1 whitespace-nowrap" title={p.Relic?.Offered?.map(l.relic).join(', ')}>{choice(p.Relic, l.relic)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div>
                <p className="mb-1 text-muted-foreground">최종 덱 · {deck.reduce((n, c) => n + (c.Count ?? 1), 0)}장</p>
                <p className="leading-relaxed text-heading">
                  {deck
                    .map((c) => `${l.card(c.Card)} ×${c.Count ?? 1}` + (c.Inscriptions?.length ? ` (${c.Inscriptions.map(l.inscription).join(', ')})` : ''))
                    .join(' · ')}
                </p>
              </div>
              <div>
                <p className="mb-1 text-muted-foreground">유물 · {s.Relics?.length ?? 0}개</p>
                <p className="leading-relaxed text-heading">{(s.Relics ?? []).map(l.relic).join(' · ') || '없음'}</p>
              </div>
            </div>
          </details>
        )
      })}
    </div>
  )
}
