'use client'

import type { MouseEvent, ReactNode } from 'react'

export function RestaurantLink({ children, className }: { children: ReactNode; className?: string }) {
  const scrollToRestaurant = (event: MouseEvent<HTMLAnchorElement>) => {
    if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return
    const section = document.getElementById('restaurant')
    if (!section) return

    event.preventDefault()
    // Bring the full section into view. Its own trigger starts the entrance
    // animation at the viewport edge during ordinary scrolling.
    const top = section.getBoundingClientRect().top + window.scrollY

    section.focus({ preventScroll: true })
    if (window.location.hash !== '#restaurant') window.history.pushState(null, '', '#restaurant')
    window.scrollTo({ top, behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth' })
  }

  return <a className={className} href="#restaurant" onClick={scrollToRestaurant}>{children}</a>
}
