import { useMemo, useState, type ReactNode } from 'react'

import type { Shape } from '@/balance/model'

export type Point = {
  id: string
  x: number
  y: number
  color: string
  shape: Shape
  hollow: boolean
  label?: string
  tip: ReactNode
}

export type Guide = { from: [number, number]; to: [number, number]; label?: string; dashed?: boolean; strong?: boolean }

type Props = {
  points: Point[]
  x: { min: number; max: number; log?: boolean; title: string; ticks: number[] }
  y: { min: number; max: number; log?: boolean; title: string; ticks: number[] }
  guides: Guide[]
  corners?: [string, string, string, string] // top-left, top-right, bottom-left, bottom-right
  ariaLabel: string
}

const W = 1000
const H = 560
const M = { left: 56, right: 16, top: 14, bottom: 48 }

function scale(axis: Props['x'], from: number, to: number) {
  const f = (v: number) => (axis.log ? Math.log(v) : v)
  const lo = f(axis.min)
  const hi = f(axis.max)
  return (v: number) => from + ((f(Math.min(Math.max(v, axis.min), axis.max)) - lo) / (hi - lo)) * (to - from)
}

function marker(shape: Shape, r: number) {
  switch (shape) {
    case 'square':
      return `M${-r * 0.85},${-r * 0.85}h${r * 1.7}v${r * 1.7}h${-r * 1.7}z`
    case 'triangle':
      return `M0,${-r * 1.1}L${r},${r * 0.75}L${-r},${r * 0.75}z`
    case 'diamond':
      return `M0,${-r * 1.15}L${r * 1.05},0L0,${r * 1.15}L${-r * 1.05},0z`
    case 'star': {
      let d = ''
      for (let i = 0; i < 10; i++) {
        const a = (Math.PI / 5) * i - Math.PI / 2
        const k = i % 2 ? r * 0.5 : r * 1.25
        d += `${i ? 'L' : 'M'}${(Math.cos(a) * k).toFixed(2)},${(Math.sin(a) * k).toFixed(2)}`
      }
      return d + 'z'
    }
    default:
      return `M${r},0A${r},${r} 0 1 1 ${-r},0A${r},${r} 0 1 1 ${r},0z`
  }
}

/** A scatter plot in plain SVG: guides, recessive grid, marker shapes per series, labels for chosen points, hover/tap tips. */
export function Scatter({ points, x, y, guides, corners, ariaLabel }: Props) {
  const [active, setActive] = useState<string | null>(null)
  const sx = useMemo(() => scale(x, M.left, W - M.right), [x])
  const sy = useMemo(() => scale(y, H - M.bottom, M.top), [y])
  const shown = points.find((p) => p.id === active)

  // Points within a few pixels share one label so names do not pile up.
  const labels = useMemo(() => {
    const groups = new Map<string, { x: number; y: number; names: string[] }>()
    for (const p of points) {
      if (!p.label) continue
      const px = sx(p.x)
      const py = sy(p.y)
      const key = `${Math.round(px / 14)}|${Math.round(py / 14)}`
      const g = groups.get(key) ?? { x: px, y: py, names: [] }
      g.names.push(p.label)
      groups.set(key, g)
    }
    return [...groups.values()]
  }, [points, sx, sy])

  // Below 720px the plot keeps its size and scrolls sideways, so its 13px text stays readable on a phone.
  return (
    <div className="overflow-x-auto">
    <div className="relative min-w-[720px]">
      <svg viewBox={`0 0 ${W} ${H}`} className="block h-auto w-full select-none" role="img" aria-label={ariaLabel} onMouseLeave={() => setActive(null)}>
        {x.ticks.map((t) => (
          <g key={`x${t}`}>
            <line x1={sx(t)} x2={sx(t)} y1={M.top} y2={H - M.bottom} stroke="currentColor" className="text-foreground/8" />
            <text x={sx(t)} y={H - M.bottom + 18} textAnchor="middle" className="fill-muted-foreground text-[13px] tabular-nums">{t}</text>
          </g>
        ))}
        {y.ticks.map((t) => (
          <g key={`y${t}`}>
            <line x1={M.left} x2={W - M.right} y1={sy(t)} y2={sy(t)} stroke="currentColor" className="text-foreground/8" />
            <text x={M.left - 8} y={sy(t) + 4} textAnchor="end" className="fill-muted-foreground text-[13px] tabular-nums">{t}</text>
          </g>
        ))}
        <text x={(M.left + W - M.right) / 2} y={H - 8} textAnchor="middle" className="fill-muted-foreground text-[13px]">{x.title}</text>
        <text transform={`translate(16 ${(M.top + H - M.bottom) / 2}) rotate(-90)`} textAnchor="middle" className="fill-muted-foreground text-[13px]">
          {y.title}
        </text>

        {corners && (
          <g className="fill-muted-foreground/70 text-[14px]">
            <text x={M.left + 10} y={M.top + 20}>{corners[0]}</text>
            <text x={W - M.right - 10} y={M.top + 20} textAnchor="end">{corners[1]}</text>
            <text x={M.left + 10} y={H - M.bottom - 12}>{corners[2]}</text>
            <text x={W - M.right - 10} y={H - M.bottom - 12} textAnchor="end">{corners[3]}</text>
          </g>
        )}

        {guides.map((g, i) => {
          const x1 = sx(g.from[0])
          const y1 = sy(g.from[1])
          const x2 = sx(g.to[0])
          const y2 = sy(g.to[1])
          return (
            <g key={i}>
              <line x1={x1} y1={y1} x2={x2} y2={y2} stroke="currentColor" strokeWidth={g.strong ? 1.6 : 1.1}
                strokeDasharray={g.dashed ? '6 5' : undefined} className={g.strong ? 'text-foreground/55' : 'text-foreground/35'} />
              {g.label && (
                <text x={x2 - 6} y={y2 + (y2 < y1 ? 16 : -8)} textAnchor="end" className="fill-foreground/70 text-[13px]">{g.label}</text>
              )}
            </g>
          )
        })}

        {points.map((p) => (
          <path
            key={p.id}
            d={marker(p.shape, 6.5)}
            transform={`translate(${sx(p.x)} ${sy(p.y)})`}
            fill={p.hollow ? 'none' : p.color}
            stroke={p.hollow ? p.color : 'var(--card)'}
            strokeWidth={p.hollow ? 2 : 1.5}
            className="cursor-pointer"
            onMouseEnter={() => setActive(p.id)}
            onClick={() => setActive((a) => (a === p.id ? null : p.id))}
          />
        ))}
        {shown && (
          <circle cx={sx(shown.x)} cy={sy(shown.y)} r={11} fill="none" stroke="currentColor" strokeWidth={1.5} className="pointer-events-none text-heading" />
        )}

        {labels.map((l) => {
          const text = l.names.join(', ')
          const left = l.x > W - M.right - text.length * 13
          return (
            <text key={`${l.x}|${l.y}`} x={left ? l.x - 11 : l.x + 11} y={l.y + 4} textAnchor={left ? 'end' : 'start'}
              className="pointer-events-none fill-foreground text-[13px]">
              {text}
            </text>
          )
        })}
      </svg>

      {shown && (
        <div
          className="pointer-events-none absolute z-10 w-64 rounded-md bg-popover px-3 py-2 text-xs text-popover-foreground shadow-lg ring-1 ring-foreground/15"
          style={{
            left: `${(sx(shown.x) / W) * 100}%`,
            top: `${(sy(shown.y) / H) * 100}%`,
            transform: `translate(${sx(shown.x) > W * 0.6 ? 'calc(-100% - 14px)' : '14px'}, ${sy(shown.y) > H * 0.6 ? 'calc(-100% + 8px)' : '-8px'})`,
          }}
        >
          {shown.tip}
        </div>
      )}
    </div>
    </div>
  )
}
