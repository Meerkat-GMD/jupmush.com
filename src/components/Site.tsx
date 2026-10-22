import type { ReactNode } from 'react'

import { Separator } from '@/components/ui/separator'
import { studio } from '@/content'

// Links start with "/" so they also work from the privacy page.

export function SectionTitle({ children }: { children: ReactNode }) {
  return (
    <h2 className="mb-3 border-b border-secondary pb-1 text-sm font-normal tracking-widest text-heading uppercase">
      {children}
    </h2>
  )
}

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-20 border-b border-border bg-header">
      <div className="mx-auto flex max-w-[1000px] items-center justify-between gap-x-6 px-4 py-2">
        <a href="/#top" className="shrink-0">
          <img
            src="/images/logo.png"
            alt={studio.name}
            width={48}
            height={64}
            className="pixelated h-16 w-12"
          />
        </a>
        <nav aria-label="Main" className="flex gap-5 text-sm font-medium tracking-wide uppercase">
          <a href="/#games" className="hover:text-heading">Games</a>
          <a href="/#about" className="hover:text-heading">About</a>
          <a href="/#contact" className="hover:text-heading">Contact</a>
        </nav>
      </div>
    </header>
  )
}

export function SiteFooter() {
  return (
    <footer className="border-t border-border bg-header">
      <div className="mx-auto max-w-[1000px] px-4 py-6 text-xs text-muted-foreground">
        <Separator className="mb-4 bg-secondary" />
        <p className="text-heading">{studio.name}</p>
        <p className="mt-1">{studio.tagline}</p>
        <p className="mt-3">
          <a href="/privacy/" className="text-accent hover:text-heading">Privacy Policy</a>
        </p>
        <p className="mt-3">© 2026 {studio.name}. All rights reserved.</p>
      </div>
    </footer>
  )
}
