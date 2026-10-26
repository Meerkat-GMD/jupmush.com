import { useState, type FormEvent } from 'react'

import { Button } from '@/components/ui/button'
import { supabase } from '@/lib/supabase'

export function SignIn({ title }: { title: string }) {
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
      <h1 className="text-lg text-heading">{title}</h1>
      <input className={field} type="email" autoComplete="username" placeholder="이메일" value={email} onChange={(e) => setEmail(e.target.value)} required />
      <input className={field} type="password" autoComplete="current-password" placeholder="비밀번호" value={password} onChange={(e) => setPassword(e.target.value)} required />
      <Button type="submit" size="lg" disabled={busy}>로그인</Button>
      {error && <p className="text-xs text-destructive">{error}</p>}
    </form>
  )
}
