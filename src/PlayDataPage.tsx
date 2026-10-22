import { createClient, type Session } from '@supabase/supabase-js'
import { useCallback, useEffect, useMemo, useState, type FormEvent } from 'react'

import { Button } from '@/components/ui/button'
import { compareVersions, report, type Row, type Sim, type Table } from '@/playdata/stats'

// The game's publishable key: it may insert runs and read nothing. Reading needs an account flagged playdata_admin
// (PaperVillage tools/PlayData/schema.sql), so this page holds no secret.
const supabase = createClient('https://fctpvxgebtjmaxocbsxg.supabase.co', 'sb_publishable_oeaIdUG0RfqIajvptT1bSw_3gBPks9B')

const ALL = 'all'

async function loadRuns() {
  const rows: Row[] = []
  for (let page = 1000; ; ) {
    const { data, error } = await supabase
      .from('runs')
      .select('install_id,run_id,version,received_at,summary')
      .order('received_at')
      .order('install_id')
      .order('run_id')
      .range(rows.length, rows.length + page - 1)
    if (error) throw error
    rows.push(...(data as Row[]))
    if (data.length < page) return rows
  }
}

async function loadSim() {
  const { data, error } = await supabase.from('sim_snapshots').select('label,created_at,data').order('id', { ascending: false }).limit(1)
  if (error) throw error
  return (data[0] as Sim | undefined) ?? null
}

const isNumber = (cell: string) => /^-?[\d.]+$|^-$/.test(cell)

function DataTable({ table }: { table: Table }) {
  return (
    <section className="rounded-lg bg-card ring-1 ring-foreground/10">
      <div className="px-3 pt-3 pb-2">
        <h2 className="text-sm font-medium text-heading">{table.title}</h2>
        {table.note && <p className="mt-0.5 text-xs text-muted-foreground">{table.note}</p>}
      </div>
      {table.rows.length === 0 ? (
        <p className="px-3 pb-3 text-xs text-muted-foreground">데이터 없음</p>
      ) : (
        <div className="overflow-x-auto pb-2">
          <table className="w-full text-xs tabular-nums">
            <thead>
              <tr className="border-b border-secondary text-muted-foreground">
                {table.headers.map((h, i) => (
                  <th key={h} className={`px-3 py-1.5 font-normal whitespace-nowrap ${i === 0 ? 'sticky left-0 bg-card text-left' : 'text-right'}`}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {table.rows.map((row) => (
                <tr key={row.join('|')} className="border-b border-secondary/40 last:border-0">
                  {row.map((cell, i) => (
                    <td
                      key={i}
                      className={`px-3 py-1 whitespace-nowrap ${i === 0 ? 'sticky left-0 bg-card text-heading' : ''} ${isNumber(cell) ? 'text-right' : i === 0 ? 'text-left' : 'text-right'}`}
                    >
                      {cell}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  )
}

function SignIn() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)

  async function submit(event: FormEvent) {
    event.preventDefault()
    setBusy(true)
    setError('')
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) setError('로그인하지 못했습니다. 이메일과 비밀번호를 확인하세요.')
    setBusy(false)
  }

  const field = 'h-10 w-full rounded-md bg-secondary px-3 text-sm text-heading outline-none focus:ring-2 focus:ring-ring'
  return (
    <form onSubmit={submit} className="mx-auto mt-16 flex max-w-xs flex-col gap-3">
      <h1 className="text-lg text-heading">플레이 데이터</h1>
      <input className={field} type="email" autoComplete="username" placeholder="이메일" value={email} onChange={(e) => setEmail(e.target.value)} required />
      <input className={field} type="password" autoComplete="current-password" placeholder="비밀번호" value={password} onChange={(e) => setPassword(e.target.value)} required />
      <Button type="submit" size="lg" disabled={busy}>로그인</Button>
      {error && <p className="text-xs text-destructive">{error}</p>}
    </form>
  )
}

export default function PlayDataPage() {
  const [session, setSession] = useState<Session | null | undefined>(undefined)
  const [rows, setRows] = useState<Row[] | null>(null)
  const [sim, setSim] = useState<Sim | null>(null)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [version, setVersion] = useState<string | null>(null)
  const [dirty, setDirty] = useState(false)

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setSession(data.session))
    const { data } = supabase.auth.onAuthStateChange((_event, next) => setSession(next))
    if (import.meta.env.DEV)
      Object.assign(window, { __playdata: (r: Row[], s: Sim | null) => { setSim(s); setRows(r) } })
    return () => data.subscription.unsubscribe()
  }, [])

  const admin = !!session?.user.app_metadata?.playdata_admin

  const refresh = useCallback(async () => {
    setLoading(true)
    setError('')
    try {
      const [r, s] = await Promise.all([loadRuns(), loadSim()])
      setRows(r)
      setSim(s)
    } catch (e) {
      setError(`불러오지 못했습니다: ${(e as { message?: string }).message ?? e}`)
    }
    setLoading(false)
  }, [])

  useEffect(() => {
    if (admin) refresh()
  }, [admin, refresh])

  const shown = useMemo(() => (rows ?? []).filter((r) => dirty || !r.version.endsWith('-dirty')), [rows, dirty])
  const releases = useMemo(() => {
    const groups = new Map<string, Map<string, number>>()
    for (const r of shown) {
      const base = r.version.split('+')[0]
      const builds = groups.get(base) ?? new Map<string, number>()
      builds.set(r.version, (builds.get(r.version) ?? 0) + 1)
      groups.set(base, builds)
    }
    return [...groups].sort(([a], [b]) => compareVersions(a, b))
  }, [shown])
  // The newest release until a version is chosen.
  const selected = version ?? (releases[0] ? `base:${releases[0][0]}` : ALL)
  const filtered = useMemo(
    () =>
      shown.filter((r) =>
        selected === ALL ? true : selected.startsWith('base:') ? r.version.split('+')[0] === selected.slice(5) : r.version === selected.slice(2),
      ),
    [shown, selected],
  )
  const result = useMemo(() => report(filtered, sim), [filtered, sim])

  if (rows === null) {
    if (session === undefined) return null
    if (!session) return <SignIn />
    if (!admin)
      return (
        <div className="mx-auto mt-16 max-w-xs text-sm">
          <p>이 계정에는 플레이 데이터를 읽을 권한이 없습니다.</p>
          <Button variant="link" className="px-0" onClick={() => supabase.auth.signOut()}>로그아웃</Button>
        </div>
      )
    return <p className="mt-16 text-center text-sm text-muted-foreground">{error || '불러오는 중…'}</p>
  }

  const stats = [
    ['런', result.runs],
    ['승률', `${result.winRate.toFixed(1)}%`],
    ['승리', result.won],
    ['패배', result.lost],
    ['포기', result.abandoned],
    ['설치', result.installs],
  ] as const

  return (
    <main className="mx-auto flex max-w-[1100px] flex-col gap-4 px-4 py-5">
      <header className="flex flex-wrap items-center gap-x-3 gap-y-2">
        <h1 className="mr-auto text-lg text-heading">플레이 데이터</h1>
        <Button variant="secondary" size="sm" onClick={refresh} disabled={loading}>{loading ? '불러오는 중…' : '새로고침'}</Button>
        <Button variant="ghost" size="sm" onClick={() => supabase.auth.signOut().then(() => setRows(null))}>로그아웃</Button>
      </header>

      <div className="flex flex-wrap items-center gap-3 text-sm">
        <select
          className="h-9 min-w-0 flex-1 rounded-md bg-secondary px-2 text-heading sm:flex-none"
          value={selected}
          onChange={(e) => setVersion(e.target.value)}
          aria-label="버전"
        >
          <option value={ALL}>모든 버전 · {shown.length}런</option>
          {releases.map(([base, builds]) => (
            <optgroup key={base} label={base}>
              <option value={`base:${base}`}>{base} 전체 · {[...builds.values()].reduce((a, b) => a + b, 0)}런</option>
              {[...builds].sort(([a], [b]) => a.localeCompare(b)).map(([v, n]) => (
                <option key={v} value={`v:${v}`}>{v} · {n}런</option>
              ))}
            </optgroup>
          ))}
        </select>
        <label className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <input type="checkbox" checked={dirty} onChange={(e) => setDirty(e.target.checked)} />
          -dirty 빌드 포함
        </label>
      </div>
      {error && <p className="text-xs text-destructive">{error}</p>}

      <div className="grid grid-cols-3 gap-2 sm:grid-cols-6">
        {stats.map(([label, value]) => (
          <div key={label} className="rounded-lg bg-card px-3 py-2 ring-1 ring-foreground/10">
            <p className="text-xs text-muted-foreground">{label}</p>
            <p className="text-lg text-heading tabular-nums">{value}</p>
          </div>
        ))}
      </div>
      <p className="-mt-2 text-xs text-muted-foreground">
        승률은 포기한 런을 뺀 승리+패배 런 기준.{' '}
        {sim ? `시뮬레이션: ${sim.label} (${sim.created_at.slice(0, 10)})` : '시뮬레이션 스냅샷이 없어 비교 열과 덱 컨셉 표를 생략합니다.'}
      </p>

      {result.tables.map((t) => (
        <DataTable key={t.title} table={t} />
      ))}
    </main>
  )
}
