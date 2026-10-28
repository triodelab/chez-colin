import type { Metadata, Viewport } from 'next'
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

// Keeps Safari's browser chrome and the iPhone safe area aligned with the
// burgundy footer when visitors reach the end of the page.
export const viewport: Viewport = {
  themeColor: '#961208',
  viewportFit: 'cover',
}

export default function SiteLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html className={`${bitter.variable} ${barlowCondensed.variable}`} lang="no"><body>{children}</body></html>
}
