import { Mail } from 'lucide-react'

import { SectionTitle, SiteFooter, SiteHeader } from '@/components/Site'
import { Button } from '@/components/ui/button'
import { privacy, studio } from '@/content'

export default function PrivacyPage() {
  return (
    <div id="top" className="min-h-svh">
      <SiteHeader lang="en" />
      <main className="mx-auto max-w-[1000px] px-4 pt-6 pb-16">
        <p className="text-xs text-muted-foreground">
          <a href="/" className="hover:text-heading">Home</a> <span aria-hidden>›</span> {privacy.title}
        </p>
        <h1 className="mt-1 text-2xl font-normal text-heading sm:text-[26px]">{privacy.title}</h1>
        <p className="mt-1 mb-6 text-xs text-muted-foreground">
          {privacy.game} · Last updated {privacy.updated}
        </p>

        <article className="max-w-[680px] text-sm leading-relaxed">
          {privacy.intro.map((p) => (
            <p key={p.slice(0, 24)} className="mb-8 text-base text-heading">{p}</p>
          ))}
          {privacy.sections.map((s) => (
            <section key={s.title} className="mb-8">
              <SectionTitle>{s.title}</SectionTitle>
              <div className="flex flex-col gap-3">
                {s.paragraphs?.map((p) => <p key={p.slice(0, 24)}>{p}</p>)}
                {s.list && (
                  <ul className="flex flex-col gap-1.5 border-l-2 border-highlight/70 pl-3">
                    {s.list.map((item) => <li key={item}>{item}</li>)}
                  </ul>
                )}
                {s.after?.map((p) => <p key={p.slice(0, 24)}>{p}</p>)}
              </div>
              {s.contact && (
                <Button asChild className="mt-3 rounded-sm bg-secondary px-4 text-heading hover:bg-accent hover:text-accent-foreground">
                  <a href={`mailto:${studio.email}`}>
                    <Mail />
                    {studio.email}
                  </a>
                </Button>
              )}
            </section>
          ))}
        </article>
      </main>
      <SiteFooter lang="en" />
    </div>
  )
}
