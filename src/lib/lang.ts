import type { Lang } from '@/content'

// Korean pages live under /ko/; each page's <html lang> says which one it is.

export function pageLang(): Lang {
  return document.documentElement.lang === 'ko' ? 'ko' : 'en'
}

export function localPath(lang: Lang, path: string) {
  return lang === 'ko' ? `/ko${path}` : path
}
