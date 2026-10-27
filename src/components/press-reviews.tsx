'use client'

import { useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import { ArrowIcon } from './arrow-icon'
import styles from './press-reviews.module.css'

const reviews = [
  { quote: 'Tartaren på Chez Colin er en innertier', outlet: 'Aftenposten', domain: 'aftenposten.no', date: '3. mars 2020', href: 'https://www.aftenposten.no/osloby/sulten/i/kJLjLQ/restaurantanmeldelse-tartaren-paa-chez-colin-er-en-innertier' },
  { quote: 'En perle', outlet: 'Dagbladet', domain: 'dagbladet.no', date: '31. januar 2020', href: 'https://www.dagbladet.no/mat/en-perle---hit-vil-jeg-tilbake/72073266' },
  { quote: 'Chez Colin lager sjelfull brasserimat', outlet: 'Dagens Næringsliv', domain: 'dn.no', date: '1. februar 2019', href: 'https://www.dn.no/smak/restaurantguiden/chez-colin/anmeldt/anmeldelser/chez-colin-lager-sjelfull-brasserimat/2-1-524933' },
  { quote: 'Erkefransk mat', outlet: 'Dagens Næringsliv', domain: 'dn.no', date: '9. mars 2018', href: 'https://www.dn.no/smak/2018/03/09/1345/Restaurantguiden/erkefransk-mat-med-et-av-byens-fineste-vinkart' },
  { quote: 'Je suis Colin', outlet: 'Aftenposten', domain: 'aftenposten.no', date: '25. oktober 2017', href: 'https://www.aftenposten.no/osloby/sulten/i/XPOdr/Matanmeldelse-Je-suis-Colin' },
  { quote: 'Brasserimat som treffer hjertet', outlet: 'Dagens Næringsliv', domain: 'dn.no', date: '10. februar 2017', href: 'https://www.dn.no/smak/2017/02/10/1417/Restaurantguiden/brasserimat-som-treffer-hjertet' },
  { quote: 'Fransk stemning', outlet: 'Godt.no', domain: 'godt.no', date: '14. januar 2016', href: 'http://www.godt.no/#!/artikkel/23595396/restaurantanmeldelse-av-chez-colin-fransk-stemning' },
  { quote: 'Fransk inn til margen', outlet: 'Dagsavisen', domain: 'dagsavisen.no', date: '7. november 2015', href: 'http://www.dagsavisen.no/helg-nye-inntrykk/2.726/2.766/fransk-inn-til-margen-1.432920' },
  { quote: 'En moderne klassiker', outlet: 'Dagbladet', domain: 'dagbladet.no', date: '21. august 2015', href: 'http://www.dagbladet.no/2015/08/21/tema/tema_aller/matsiden/robinson_fredag/robinson_og_fredag/40717505/' },
  { quote: 'Det Blide Brasserie', outlet: 'OsloBy', domain: 'aftenposten.no', date: '5. juni 2015', href: 'http://www.osloby.no/sulten/Chez-Colin-Det-blide-brasserie-8044947.html' },
  { quote: 'Fransk Hverdagsfest', outlet: 'Dagens Næringsliv', domain: 'dn.no', date: '5. juni 2015', href: 'http://www.dn.no/magasinet/2015/06/05/2112/Restaurantguiden/fransk-hverdagsfest' },
]

export function PressReviews() {
  const viewportRef = useRef<HTMLDivElement>(null)
  const trackRef = useRef<HTMLDivElement>(null)
  const groupRef = useRef<HTMLDivElement>(null)
  const pausedRef = useRef(false)
  const updatePlaybackRef = useRef<() => void>(() => {})
  const [isPaused, setIsPaused] = useState(false)

  useEffect(() => {
    const viewport = viewportRef.current
    const track = trackRef.current
    const group = groupRef.current
    if (!viewport || !track || !group) return

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)')
    let loop: gsap.core.Tween | null = null
    let distance = 0
    let isVisible = false
    let isHovered = false
    let isFocused = false
    let isKeyboardFocus = false

    const updatePlayback = () => {
      if (!loop || isFocused) return
      gsap.to(loop, {
        timeScale: pausedRef.current || isHovered || !isVisible ? 0 : 1,
        duration: .6,
        ease: 'power2.out',
        overwrite: true,
      })
    }
    updatePlaybackRef.current = updatePlayback

    const createLoop = () => {
      const progress = loop?.progress() ?? 0
      if (loop) {
        gsap.killTweensOf(loop)
        loop.kill()
        loop = null
      }
      gsap.set(track, { clearProps: 'transform' })
      if (reducedMotion.matches) return

      distance = group.getBoundingClientRect().width
      if (!distance) return
      loop = gsap.to(track, {
        x: -distance,
        duration: distance / 36,
        ease: 'none',
        repeat: -1,
      })
      loop.progress(progress).timeScale(0)
      if (isKeyboardFocus) loop.pause(0)
      updatePlayback()
    }

    const onPointerEnter = (event: PointerEvent) => {
      if (event.pointerType !== 'mouse') return
      isHovered = true
      updatePlayback()
    }
    const onPointerLeave = () => {
      isHovered = false
      updatePlayback()
    }
    const onFocusIn = (event: FocusEvent) => {
      if (!(event.target instanceof HTMLElement)) return
      const keyboardFocus = event.target.matches(':focus-visible')
      if (isFocused && (!keyboardFocus || isKeyboardFocus)) {
        if (keyboardFocus) event.target.scrollIntoView({ behavior: 'instant', block: 'nearest', inline: 'nearest' })
        return
      }
      isFocused = true
      isKeyboardFocus = keyboardFocus
      if (loop) {
        gsap.killTweensOf(loop)
        loop.timeScale(0)
        if (keyboardFocus) {
          loop.pause(0)
          viewport.scrollLeft = 0
        }
      }
      if (keyboardFocus) event.target.scrollIntoView({ behavior: 'instant', block: 'nearest', inline: 'nearest' })
    }
    const onFocusOut = (event: FocusEvent) => {
      if (event.relatedTarget instanceof Node && viewport.contains(event.relatedTarget)) return
      isFocused = false
      if (loop && isKeyboardFocus) {
        // Transfer native keyboard scrolling back into the loop without a visual jump.
        const offset = viewport.scrollLeft
        viewport.scrollLeft = 0
        loop.progress((offset % distance) / distance).paused(false)
      }
      isKeyboardFocus = false
      updatePlayback()
    }

    const resizeObserver = new ResizeObserver(createLoop)
    const visibilityObserver = new IntersectionObserver(([entry]) => {
      isVisible = entry.isIntersecting
      updatePlayback()
    })
    resizeObserver.observe(group)
    visibilityObserver.observe(viewport)
    reducedMotion.addEventListener('change', createLoop)
    viewport.addEventListener('pointerenter', onPointerEnter)
    viewport.addEventListener('pointerleave', onPointerLeave)
    viewport.addEventListener('focusin', onFocusIn)
    viewport.addEventListener('focusout', onFocusOut)

    return () => {
      resizeObserver.disconnect()
      visibilityObserver.disconnect()
      reducedMotion.removeEventListener('change', createLoop)
      viewport.removeEventListener('pointerenter', onPointerEnter)
      viewport.removeEventListener('pointerleave', onPointerLeave)
      viewport.removeEventListener('focusin', onFocusIn)
      viewport.removeEventListener('focusout', onFocusOut)
      if (loop) {
        gsap.killTweensOf(loop)
        loop.kill()
      }
      gsap.set(track, { clearProps: 'transform' })
      updatePlaybackRef.current = () => {}
    }
  }, [])

  useEffect(() => {
    pausedRef.current = isPaused
    updatePlaybackRef.current()
  }, [isPaused])

  return (
    <section className={`press-reviews ${styles.section}`} aria-labelledby="press-title">
      <div className="shell">
        <div className={styles.heading}>
          <h2 id="press-title">Les anmeldelser:</h2>
          <button
            aria-controls="press-track"
            aria-label={isPaused ? 'Spill av anmeldelser' : 'Sett anmeldelser på pause'}
            aria-pressed={isPaused}
            className={styles.pause}
            onClick={() => setIsPaused(current => !current)}
            type="button"
          >
            <svg aria-hidden="true" viewBox="0 0 24 24">
              {isPaused ? <path d="m9 5 10 7-10 7Z" /> : <path d="M9 5v14M15 5v14" />}
            </svg>
            <span>{isPaused ? 'Spill av' : 'Pause'}</span>
          </button>
        </div>
        <div className={styles.viewport} ref={viewportRef}>
          <div className={styles.track} id="press-track" ref={trackRef}>
            {[false, true].map(isDuplicate => (
              <div
                aria-hidden={isDuplicate ? true : undefined}
                className={styles.group}
                key={String(isDuplicate)}
                ref={isDuplicate ? undefined : groupRef}
                role={isDuplicate ? undefined : 'list'}
              >
                {reviews.map(review => (
                  <div className={styles.item} key={review.href} role={isDuplicate ? undefined : 'listitem'}>
                    <a className={styles.quote} href={review.href} rel="noreferrer" tabIndex={isDuplicate ? -1 : undefined} target="_blank">
                      <span aria-hidden="true" className={styles.quoteMark}>“</span>
                      <blockquote>{review.quote}</blockquote>
                      <div className={styles.attribution}>
                        <img alt="" className={styles.logo} decoding="async" height={48} loading="lazy" src={`https://www.google.com/s2/favicons?domain=${review.domain}&sz=128`} width={48} />
                        <span><strong>{review.outlet}</strong><small>{review.date}</small></span>
                        <ArrowIcon className={styles.arrow} />
                      </div>
                    </a>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
