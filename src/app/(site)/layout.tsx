import type { Metadata } from 'next'
import { Barlow_Condensed, Bitter } from 'next/font/google'
import './site.css'

const bitter = Bitter({
  subsets: ['latin'],
  style: ['normal', 'italic'],
  display: 'swap',
  variable: '--font-bitter',
})

const barlowCondensed = Barlow_Condensed({
  subsets: ['latin'],
  weight: ['500', '600', '700'],
  display: 'swap',
  variable: '--font-barlow-condensed',
})

export const metadata: Metadata = {
  title: 'Chez Colin — Fransk restaurant på Fredensborg',
  description: 'Fransk kjøkken, gode viner og lange kvelder på Fredensborg i Oslo.',
}

export default function SiteLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html className={`${bitter.variable} ${barlowCondensed.variable}`} lang="no"><body>{children}</body></html>
}
