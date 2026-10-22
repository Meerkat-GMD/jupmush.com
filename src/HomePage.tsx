import { ArrowRight, Mail } from 'lucide-react'

import { SiteFooter, SiteHeader } from '@/components/Site'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { siteText, studio, vargold, type Lang } from '@/content'
import { localPath } from '@/lib/lang'

function SectionHeading({ id, children }: { id: string; children: string }) {
  return (
    <h2 id={id} className="mb-6 scroll-mt-28 text-sm font-semibold tracking-widest text-muted-foreground uppercase">
      {children}
    </h2>
  )
}

export default function HomePage({ lang }: { lang: Lang }) {
  const t = studio[lang]
  const s = siteText[lang]
  const g = vargold[lang]
  return (
    <div className="min-h-svh">
      <SiteHeader lang={lang} altHref={localPath(lang === 'ko' ? 'en' : 'ko', '/')} />
      <main className="mx-auto max-w-[1100px] px-4 sm:px-8">
        <section className="py-16 sm:py-24">
          <h1 className="max-w-[20ch] animate-in text-4xl leading-tight font-semibold tracking-tight text-heading duration-500 fade-in slide-in-from-bottom-2 motion-reduce:animate-none sm:text-5xl">
            {t.tagline}
          </h1>
        </section>

        <section className="pb-20">
          <SectionHeading id="games">{s.games}</SectionHeading>
          <a
            href={localPath(lang, vargold.path)}
            className="group grid overflow-hidden rounded-2xl border bg-card transition duration-200 hover:-translate-y-0.5 hover:shadow-lg motion-reduce:hover:translate-y-0 md:grid-cols-[3fr_2fr]"
          >
            <img
              src="/images/games/night-of-vargold/card.webp"
              alt=""
              width={1232}
              height={706}
              className="aspect-[1232/706] w-full object-cover"
            />
            <div className="flex flex-col gap-3 p-6">
              <div className="flex flex-wrap items-center gap-2">
                <h3 className="text-2xl font-semibold text-heading">{g.title}</h3>
                <Badge variant="secondary">{g.status}</Badge>
              </div>
              <p className="text-sm font-medium text-muted-foreground">{g.genre}</p>
              <p className="leading-relaxed">{g.shortDescription}</p>
              <ArrowRight
                aria-hidden
                className="mt-auto size-6 text-highlight transition group-hover:translate-x-1 motion-reduce:group-hover:translate-x-0"
              />
            </div>
          </a>
        </section>

        <div className="grid gap-12 pb-24 md:grid-cols-2">
          <section>
            <SectionHeading id="about">{s.about}</SectionHeading>
            <div className="flex items-start gap-6">
              <img
                src="/images/logo.png"
                alt=""
                width={48}
                height={64}
                className="pixelated h-32 w-24 shrink-0"
              />
              <p className="leading-relaxed">{t.about}</p>
            </div>
          </section>
          <section>
            <SectionHeading id="contact">{s.contact}</SectionHeading>
            <p className="leading-relaxed">{s.contactBody}</p>
            <Button asChild size="lg" className="mt-4">
              <a href={`mailto:${studio.email}`}>
                <Mail />
                {studio.email}
              </a>
            </Button>
          </section>
        </div>
      </main>
      <SiteFooter lang={lang} />
    </div>
  )
}
