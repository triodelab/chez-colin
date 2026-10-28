'use client'

import type { MouseEvent, ReactNode } from 'react'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

export function RestaurantLink({ children, className }: { children: ReactNode; className?: string }) {
  const scrollToRestaurant = (event: MouseEvent<HTMLAnchorElement>) => {
    if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return
    const section = document.getElementById('restaurant')
    if (!section) return

    event.preventDefault()
    const animation = ScrollTrigger.getById('restaurant-depth')
    // Start at the blank first frame so the reveal begins when the section reaches the viewport.
    const top = animation
      ? animation.start
      : section.getBoundingClientRect().top + window.scrollY

    section.focus({ preventScroll: true })
    if (window.location.hash !== '#restaurant') window.history.pushState(null, '', '#restaurant')
    window.scrollTo({ top, behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth' })
  }

  return <a className={className} href="#restaurant" onClick={scrollToRestaurant}>{children}</a>
}
