import { Check, Mail } from 'lucide-react'
import type { ReactNode } from 'react'

import { MediaGallery } from '@/components/MediaGallery'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { game, studio } from '@/content'

function SectionTitle({ children }: { children: ReactNode }) {
  return (
    <h2 className="mb-3 border-b border-secondary pb-1 text-sm font-normal tracking-widest text-heading uppercase">
      {children}
    </h2>
  )
}

function SiteHeader() {
  return (
    <header className="sticky top-0 z-20 border-b border-border bg-header">
      <div className="mx-auto flex max-w-[1000px] items-center justify-between gap-x-6 px-4 py-2">
        <a href="#top" className="shrink-0">
          <img
            src="/images/logo.png"
            alt={studio.name}
            width={48}
            height={64}
            className="pixelated h-16 w-12"
          />
        </a>
        <nav aria-label="Main" className="flex gap-5 text-sm font-medium tracking-wide uppercase">
          <a href="#games" className="hover:text-heading">Games</a>
          <a href="#about" className="hover:text-heading">About</a>
          <a href="#contact" className="hover:text-heading">Contact</a>
        </nav>
      </div>
    </header>
  )
}

function InfoRow({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="grid grid-cols-[104px_1fr] gap-2 text-xs">
      <span className="text-muted-foreground uppercase">{label}</span>
      <span>{children}</span>
    </div>
  )
}

function GameHero() {
  return (
    <section id="games" className="scroll-mt-16">
      <p className="text-xs text-muted-foreground">
        All Games <span aria-hidden>›</span> {game.title}
      </p>
      <h1 className="mt-1 mb-3 text-2xl font-normal text-heading sm:text-[26px]">{game.title}</h1>

      <div className="grid gap-4 bg-panel p-0 lg:grid-cols-[minmax(0,1fr)_324px] lg:p-3">
        <MediaGallery shots={game.screenshots} />

        <aside className="flex flex-col gap-3 px-3 pb-3 lg:px-0 lg:pb-0">
          <img
            src={game.capsule}
            alt={`${game.title} key art: a paper village glowing under a giant night wolf.`}
            width={920}
            height={518}
            className="aspect-video w-full object-cover"
          />
          <p className="text-[13px] leading-snug">{game.shortDescription}</p>
          <div className="flex flex-col gap-1.5">
            <InfoRow label="Release date">{game.status}</InfoRow>
            <InfoRow label="Developer">
              <a href="#about" className="text-accent hover:text-heading">{game.developer}</a>
            </InfoRow>
          </div>
          <div>
            <p className="mb-1.5 text-xs text-muted-foreground">Tags for this game:</p>
            <ul className="flex flex-wrap gap-1">
              {game.tags.map((t) => (
                <li key={t}>
                  <Badge className="rounded-sm bg-tag px-2 font-normal text-tag-foreground">{t}</Badge>
                </li>
              ))}
            </ul>
          </div>
        </aside>
      </div>
    </section>
  )
}

function ComingSoonBox() {
  return (
    <div className="relative mt-6 bg-gradient-to-r from-teal/50 to-panel px-5 py-4">
      <h2 className="text-lg text-heading">{game.title} is coming soon</h2>
      <p className="mt-1 text-sm text-foreground">The game will be released on itch.io first.</p>
      <div className="mt-3 flex items-center gap-1 bg-background/70 p-1 sm:absolute sm:right-4 sm:-bottom-4 sm:mt-0 sm:w-auto">
        <span className="px-3 text-sm text-heading">Coming soon to itch.io</span>
        <Button disabled className="rounded-sm bg-primary px-4 text-primary-foreground disabled:opacity-80">
          Not yet available
        </Button>
      </div>
    </div>
  )
}

function AboutGame() {
  return (
    <div className="mt-10 grid gap-8 lg:grid-cols-[minmax(0,1fr)_308px]">
      <article>
        <SectionTitle>About this game</SectionTitle>
        <div className="flex flex-col gap-4 text-sm leading-relaxed">
          <p className="text-base text-heading">{game.lead}</p>
          {game.story.map((p) => (
            <p key={p.slice(0, 24)}>{p}</p>
          ))}
          {game.pillars.map((p) => (
            <p key={p.title}>
              <strong className="text-heading">{p.title}</strong> {p.body}
            </p>
          ))}
          <h3 className="mt-2 text-sm tracking-widest text-highlight uppercase">Features</h3>
          <ul className="flex flex-col gap-3">
            {game.features.map((f) => (
              <li key={f.title} className="border-l-2 border-highlight/70 pl-3">
                <strong className="block text-heading">{f.title}</strong>
                {f.body}
              </li>
            ))}
          </ul>
        </div>
      </article>

      <aside className="flex flex-col gap-4">
        <Card className="gap-3 rounded-sm bg-panel py-4 ring-0">
          <CardContent className="px-4">
            <h3 className="mb-2 text-xs tracking-widest text-heading uppercase">Languages</h3>
            <table className="w-full text-xs">
              <thead className="text-muted-foreground">
                <tr>
                  <th className="pb-1 text-left font-normal" />
                  <th className="pb-1 font-normal">Interface</th>
                </tr>
              </thead>
              <tbody>
                {game.languages.map((l) => (
                  <tr key={l} className="border-t border-secondary">
                    <td className="py-1.5">{l}</td>
                    <td className="py-1.5 text-center">
                      <Check className="mx-auto size-4 text-accent" aria-label="Supported" />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </CardContent>
        </Card>

        <Card className="gap-3 rounded-sm bg-panel py-4 ring-0">
          <CardContent className="px-4">
            <h3 className="mb-2 text-xs tracking-widest text-heading uppercase">Controls</h3>
            <ul className="flex flex-col gap-1.5 text-xs">
              {game.controls.map((c) => (
                <li key={c}>{c}</li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </aside>
    </div>
  )
}

function Studio() {
  return (
    <div className="mt-14 grid gap-8 md:grid-cols-2">
      <section id="about" className="scroll-mt-16">
        <SectionTitle>About the studio</SectionTitle>
        <div className="flex items-start gap-5">
          <img
            src="/images/logo.png"
            alt=""
            width={48}
            height={64}
            className="pixelated h-48 w-36 shrink-0 max-sm:h-32 max-sm:w-24"
          />
          <p className="text-sm leading-relaxed">{studio.about}</p>
        </div>
      </section>
      <section id="contact" className="scroll-mt-16">
        <SectionTitle>Contact</SectionTitle>
        <p className="text-sm">For questions, press or collaboration, write to us.</p>
        <Button asChild className="mt-3 rounded-sm bg-secondary px-4 text-heading hover:bg-accent hover:text-accent-foreground">
          <a href={`mailto:${studio.email}`}>
            <Mail />
            {studio.email}
          </a>
        </Button>
      </section>
    </div>
  )
}

export default function App() {
  return (
    <div id="top" className="min-h-svh">
      <SiteHeader />
      <main className="mx-auto max-w-[1000px] px-4 pt-6 pb-16">
        <GameHero />
        <ComingSoonBox />
        <AboutGame />
        <Studio />
      </main>
      <footer className="border-t border-border bg-header">
        <div className="mx-auto max-w-[1000px] px-4 py-6 text-xs text-muted-foreground">
          <Separator className="mb-4 bg-secondary" />
          <p className="text-heading">{studio.name}</p>
          <p className="mt-1">{studio.tagline}</p>
          <p className="mt-3">© 2026 {studio.name}. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}
