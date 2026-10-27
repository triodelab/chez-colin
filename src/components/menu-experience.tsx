'use client'

// @refresh reset
// Remount this modal during code edits so Fast Refresh cannot reuse an older hook signature.

import { useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import { ArrowIcon } from './arrow-icon'
import styles from './menu-zoom.module.css'

const menus = [
  {
    title: 'À la carte',
    preview: '/images/menu-previews/a-la-carte.png',
    document: '/menus/a-la-carte.pdf',
  },
  {
    title: 'Dagens meny',
    preview: '/images/menu-previews/dagens-meny.png',
    document: '/menus/dagens-meny.pdf',
  },
  {
    title: 'Vinkart',
    preview: '/images/menu-previews/vinkart.png',
    document: '/menus/vinkart.pdf',
  },
]

export function MenuExperience({ giftCardUrl }: { giftCardUrl: string }) {
  const [selected, setSelected] = useState(0)
  const [isOpen, setIsOpen] = useState(false)
  const [isZoomed, setIsZoomed] = useState(false)
  const dialogRef = useRef<HTMLDialogElement>(null)
  const viewportRef = useRef<HTMLDivElement>(null)
  const menu = menus[selected]

  useEffect(() => {
    if (!isOpen) return
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = previousOverflow }
  }, [isOpen])

  useEffect(() => {
    const viewport = viewportRef.current
    if (viewport) viewport.scrollTo({ left: (viewport.scrollWidth - viewport.clientWidth) / 2, top: 0 })
  }, [isZoomed, isOpen, selected])

  const openMenu = () => {
    setIsZoomed(false)
    setIsOpen(true)
    dialogRef.current?.showModal()
  }

  const changeMenu = (direction: number) => {
    setSelected(current => (current + direction + menus.length) % menus.length)
    setIsZoomed(false)
  }

  return (
    <section id="meny" className="menu-section" aria-labelledby="menu-title">
      <div className="menu-background" />
      <div className="menu-experience-shell shell">
        <div className="menu-intro">
          <div className="menu-intro-copy">
            <h2 id="menu-title">Vår meny</h2>
            <p>Rett frem, gjennomført og alltid med rom for en god flaske vin.</p>
          </div>
          <a aria-label="Kjøp et gavekort til en fransk aften hos Chez Colin" className="menu-giftcard" href={giftCardUrl} rel="noreferrer" target="_blank">Kjøp gavekort <ArrowIcon /></a>
        </div>
        <div className={styles.previewStage}>
          <button
            aria-controls="menu-zoom"
            aria-haspopup="dialog"
            aria-label={`Forstørr ${menu.title}`}
            className={`menu-paper ${styles.trigger}`}
            onClick={openMenu}
            title="Klikk for å forstørre menyen"
            type="button"
          >
            <span className="menu-paper-content menu-document" id="menu-content">
              <Image
                alt={`Første side av Chez Colins ${menu.title.toLowerCase()}`}
                height={842}
                key={menu.preview}
                src={menu.preview}
                sizes="(max-width: 900px) 100vw, 600px"
                width={595}
              />
            </span>
          </button>
        </div>
        <div className="menu-side-tabs" aria-label="Velg meny">
          {menus.map((item, index) => (
            <button
              aria-current={selected === index ? 'true' : undefined}
              className={selected === index ? 'active' : ''}
              key={item.title}
              onClick={() => setSelected(index)}
              type="button"
            >
              {String(index + 1).padStart(2, '0')} {item.title}
            </button>
          ))}
        </div>
      </div>
      <dialog
        aria-labelledby="menu-zoom-title"
        className={styles.dialog}
        id="menu-zoom"
        onClose={() => setIsOpen(false)}
        ref={dialogRef}
      >
        {isOpen ? (
          <div className={styles.viewer}>
            <header className={styles.toolbar}>
              <h3 aria-atomic="true" aria-live="polite" id="menu-zoom-title">{menu.title}</h3>
              <div className={styles.actions}>
                <a href={menu.document} rel="noreferrer" target="_blank">Åpne PDF <ArrowIcon /></a>
                <button aria-pressed={isZoomed} className={styles.zoomControl} onClick={() => setIsZoomed(current => !current)} type="button">{isZoomed ? 'Tilpass' : 'Zoom inn'}</button>
                <button autoFocus onClick={() => dialogRef.current?.close()} type="button">Lukk <span aria-hidden="true">×</span></button>
              </div>
            </header>
            <div className={styles.viewport} ref={viewportRef}>
              <div className={`${styles.page} ${isZoomed ? styles.zoomed : ''}`}>
                <Image alt={`${menu.title} – første side`} height={1684} key={menu.preview} src={menu.preview} unoptimized width={1190} />
              </div>
            </div>
            <nav aria-label="Bla mellom menyer" className={styles.navigation}>
              <button aria-label={`Forrige meny: ${menus[(selected - 1 + menus.length) % menus.length].title}`} onClick={() => changeMenu(-1)} type="button"><ArrowIcon direction="left" /> Forrige meny</button>
              <span aria-label={`Meny ${selected + 1} av ${menus.length}`}>{String(selected + 1).padStart(2, '0')} / {String(menus.length).padStart(2, '0')}</span>
              <button aria-label={`Neste meny: ${menus[(selected + 1) % menus.length].title}`} onClick={() => changeMenu(1)} type="button">Neste meny <ArrowIcon direction="right" /></button>
            </nav>
          </div>
        ) : null}
      </dialog>
    </section>
  )
}
