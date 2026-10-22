import { SiteFooter, SiteHeader } from '@/components/Site'
import { vargold, vargoldLinks, type Lang } from '@/content'
import { localPath } from '@/lib/lang'

const art = '/images/games/night-of-vargold'

function PaperButton({ href, children }: { href: string; children: string }) {
  return (
    <a href={href} className="paper-button inline-flex items-center px-3 py-1 text-base font-semibold">
      {children}
    </a>
  )
}

function GhostButton({ href, children }: { href: string; children: string }) {
  return (
    <a
      href={href}
      className="inline-flex items-center rounded-xl border border-foreground/35 bg-foreground/10 px-5 py-3 text-base font-semibold text-heading transition hover:bg-foreground/20"
    >
      {children}
    </a>
  )
}

function DisplayHeading({ children }: { children: string }) {
  return <h2 className="font-display text-4xl leading-tight font-bold tracking-tight text-heading sm:text-5xl">{children}</h2>
}

export default function VargoldPage({ lang }: { lang: Lang }) {
  const g = vargold[lang]
  return (
    <div className="min-h-svh">
      <SiteHeader lang={lang} altHref={localPath(lang === 'ko' ? 'en' : 'ko', vargold.path)} />
      <main className="theme-vargold">
        <section>
          <div className="relative">
            <img
              src={`${art}/hero.webp`}
              alt={g.heroAlt}
              width={2400}
              height={775}
              fetchPriority="high"
              className="h-[260px] w-full object-cover object-[42%_50%] sm:h-auto"
            />
            <div aria-hidden className="absolute inset-0 bg-[linear-gradient(0deg,var(--night-table),transparent_40%)]" />
          </div>
          <div className="relative mx-auto -mt-10 max-w-[1100px] px-4 pb-4 sm:-mt-8 sm:px-8">
            <div className="animate-in duration-700 fade-in slide-in-from-bottom-3 motion-reduce:animate-none">
              <h1>
                <img
                  src={`${art}/title.webp`}
                  alt={g.titleArtAlt}
                  width={900}
                  height={310}
                  className="w-[min(440px,80vw)]"
                />
              </h1>
              <p className="mt-4 max-w-[46ch] text-base leading-relaxed text-heading sm:text-lg">
                {g.shortDescription}
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <PaperButton href={vargoldLinks.discord}>{g.joinDiscord}</PaperButton>
                {vargoldLinks.steam && <GhostButton href={vargoldLinks.steam}>{g.wishlist}</GhostButton>}
                {vargoldLinks.trailer && <GhostButton href={vargoldLinks.trailer}>{g.watchTrailer}</GhostButton>}
              </div>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-[1100px] px-4 py-16 sm:px-8 sm:py-24">
          <DisplayHeading>{g.aboutTitle}</DisplayHeading>
          <p className="mt-4 max-w-[65ch] text-lg leading-relaxed">{g.intro}</p>
          <ul className="mt-10 grid gap-6 md:grid-cols-3">
            {g.features.map((f) => (
              <li key={f.title} className="paper-sheet text-(--ink)">
                <h3 className="font-display text-2xl leading-tight font-bold tracking-tight">{f.title}</h3>
                <p className="mt-2 text-[15px] leading-relaxed text-(--faded-ink)">{f.body}</p>
              </li>
            ))}
          </ul>
        </section>

        <section className="mx-auto max-w-[1100px] px-4 pb-16 sm:px-8 sm:pb-24">
          <DisplayHeading>{g.story.title}</DisplayHeading>
          <p className="mt-4 max-w-[65ch] text-lg leading-relaxed">{g.story.body}</p>
          <h3 className="mt-12 mb-4 text-sm font-semibold tracking-widest text-muted-foreground uppercase">
            {g.screenshotsTitle}
          </h3>
          <ul className="grid gap-4 sm:grid-cols-2">
            {g.screenshots.map((s, i) => (
              <li key={s.file} className={i === 0 ? 'sm:col-span-2' : undefined}>
                <a href={`${art}/shots/${lang}/${s.file}.webp`} className="block overflow-hidden rounded-xl border">
                  <img
                    src={`${art}/shots/${lang}/${s.file}.webp`}
                    alt={s.alt}
                    width={1600}
                    height={900}
                    loading="lazy"
                    className="aspect-video w-full object-cover transition duration-300 hover:scale-[1.02] motion-reduce:hover:scale-100"
                  />
                </a>
              </li>
            ))}
          </ul>
        </section>

        <section className="mx-auto max-w-[1100px] px-4 pb-20 sm:px-8 sm:pb-28">
          <div className="flex flex-col items-start gap-6 rounded-2xl border bg-foreground/5 p-8 sm:flex-row sm:items-center">
            <div className="flex-1">
              <DisplayHeading>{g.communityTitle}</DisplayHeading>
              <p className="mt-2 text-lg leading-relaxed">{g.communityBody}</p>
            </div>
            <PaperButton href={vargoldLinks.discord}>{g.joinDiscord}</PaperButton>
          </div>
        </section>
      </main>
      <SiteFooter lang={lang} />
    </div>
  )
}
