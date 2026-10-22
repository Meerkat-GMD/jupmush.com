import type { ReactNode } from 'react'

import { siteText, studio, type Lang } from '@/content'
import { localPath } from '@/lib/lang'

// Links start with "/" so they work from every page.

export function SectionTitle({ children }: { children: ReactNode }) {
  return (
    <h2 className="mb-3 border-b pb-1 text-sm font-semibold tracking-widest text-heading uppercase">
      {children}
    </h2>
  )
}

// altHref is the same page in the other language; pages without one show no language link.
export function SiteHeader({ lang, altHref }: { lang: Lang; altHref?: string }) {
  const s = siteText[lang]
  const home = localPath(lang, '/')
  return (
    <header className="sticky top-0 z-20 border-b bg-header text-foreground">
      <div className="mx-auto flex max-w-[1100px] items-center gap-x-6 px-4 py-2 sm:px-8">
        <a href={home} className="flex shrink-0 items-center gap-3 font-semibold text-heading">
          <img src="/images/logo.png" alt="" width={48} height={64} className="pixelated h-16 w-12" />
          <span className="max-sm:sr-only">{studio[lang].name}</span>
        </a>
        <nav aria-label="Main" className="ml-auto flex items-center gap-5 text-sm font-medium">
          <a href={`${home}#games`} className="hover:text-highlight">{s.games}</a>
          <a href={`${home}#about`} className="hover:text-highlight">{s.about}</a>
          <a href={`${home}#contact`} className="hover:text-highlight">{s.contact}</a>
          {altHref && (
            <a
              href={altHref}
              hrefLang={lang === 'ko' ? 'en' : 'ko'}
              lang={lang === 'ko' ? 'en' : 'ko'}
              className="rounded-full border px-3 py-1 hover:border-highlight hover:text-highlight"
            >
              {s.switchLabel}
            </a>
          )}
        </nav>
      </div>
    </header>
  )
}

export function SiteFooter({ lang }: { lang: Lang }) {
  const t = studio[lang]
  return (
    <footer className="border-t bg-header text-foreground">
      <div className="mx-auto max-w-[1100px] px-4 py-8 text-sm text-muted-foreground sm:px-8">
        <p className="font-semibold text-heading">{t.name}</p>
        <p className="mt-1">{t.tagline}</p>
        <p className="mt-4">
          <a href="/privacy/" className="underline-offset-4 hover:text-heading hover:underline">
            {siteText[lang].privacy}
          </a>
        </p>
        <p className="mt-4 text-xs">© 2026 {studio.en.name}. {siteText[lang].rights}</p>
      </div>
    </footer>
  )
}
