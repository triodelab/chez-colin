'use client'

import { useEffect } from 'react'

const controls = 'button:not(:disabled), .hero-booking, .booking-button, .menu-giftcard, .header-about, .pressable'

export function PressFeedback() {
  useEffect(() => {
    let press: { element: HTMLElement; id: number; x: number; y: number } | null = null
    const clear = () => {
      press?.element.removeAttribute('data-pressed')
      press = null
    }
    const down = (event: PointerEvent) => {
      if (!event.isPrimary || event.button !== 0 || !(event.target instanceof Element)) return
      const element = event.target.closest<HTMLElement>(controls)
      if (!element?.closest('main')) return
      clear()
      press = { element, id: event.pointerId, x: event.clientX, y: event.clientY }
      element.setAttribute('data-pressed', '')
    }
    const move = (event: PointerEvent) => {
      if (!press || press.id !== event.pointerId) return
      if (Math.hypot(event.clientX - press.x, event.clientY - press.y) > 10) clear()
    }
    const release = (event: PointerEvent) => {
      if (press?.id === event.pointerId) clear()
    }

    // Passive listeners add immediate touch-down feedback without capturing gestures or clicks.
    document.addEventListener('pointerdown', down, { passive: true })
    document.addEventListener('pointermove', move, { passive: true })
    document.addEventListener('pointerup', release, { passive: true })
    document.addEventListener('pointercancel', release, { passive: true })
    document.addEventListener('visibilitychange', clear)
    window.addEventListener('blur', clear)
    return () => {
      clear()
      document.removeEventListener('pointerdown', down)
      document.removeEventListener('pointermove', move)
      document.removeEventListener('pointerup', release)
      document.removeEventListener('pointercancel', release)
      document.removeEventListener('visibilitychange', clear)
      window.removeEventListener('blur', clear)
    }
  }, [])

  return null
}
