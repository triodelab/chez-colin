'use client'

import Image from 'next/image'
import { useLayoutEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import styles from '../app/(site)/experience.module.css'

type RestaurantExperienceProps = {
  photoSources: readonly string[]
}

const photoLayouts = [
  { className: styles.one, depth: 34, sizes: '(max-width: 900px) 24vw, 13vw' },
  { className: styles.two, depth: 58, sizes: '(max-width: 900px) 32vw, 20vw' },
  { className: styles.three, depth: 22, sizes: '(max-width: 900px) 30vw, 20vw' },
  { className: styles.four, depth: 16, sizes: '(max-width: 900px) 24vw, 15vw' },
  { className: styles.five, depth: 45, sizes: '(max-width: 900px) 30vw, 20vw' },
  { className: styles.six, depth: 28, sizes: '(max-width: 900px) 25vw, 13vw' },
]

const paragraphs = [
  'Chez Colin er en hyggelig, uformell fransk restaurant på Fredensborg.',
  'Vi tilbyr en variert klassisk meny, der alt er hjemmelaget av gode og sesongbaserte råvarer. Du vil også finne et innholdsrikt og spennende vinkart.',
  'Vi har i tillegg en uteservering der man kan ta seg et glass eller spise en full middag om man ønsker det.',
]

export function RestaurantExperience({ photoSources }: RestaurantExperienceProps) {
  const sectionRef = useRef<HTMLElement>(null)
  const sceneRef = useRef<HTMLDivElement>(null)

  useLayoutEffect(() => {
    const section = sectionRef.current
    const scene = sceneRef.current
    if (!section || !scene) return

    gsap.registerPlugin(ScrollTrigger)
    const media = gsap.matchMedia()

    media.add('(max-width: 900px) and (prefers-reduced-motion: no-preference)', () => {
      // One shared fade preserves the static mobile composition without scroll pinning.
      gsap.fromTo(scene, { autoAlpha: 0 }, {
        autoAlpha: 1,
        duration: .7,
        ease: 'power1.out',
        scrollTrigger: { trigger: section, start: 'top 85%', once: true },
      })
    }, section)

    media.add('(min-width: 901px) and (prefers-reduced-motion: no-preference)', () => {
      const photos = gsap.utils.toArray<HTMLElement>('[data-restaurant-photo]', scene)
      const copy = scene.querySelector(`.${styles.copy}`)
      const layers = photos.map(photo => photo.querySelector<HTMLElement>('[data-depth]'))
      const height = () => scene.offsetHeight

      gsap.set(photos, { autoAlpha: 0, filter: 'blur(14px)', z: () => -height() * 3 })
      gsap.set(copy, { autoAlpha: 0 })

      const timeline = gsap.timeline({
        scrollTrigger: {
          id: 'restaurant-depth',
          trigger: section,
          start: 'top bottom',
          end: () => `+=${Math.round(height() * 1.55)}`,
          scrub: .15,
          invalidateOnRefresh: true,
        },
      })

      photos.forEach((photo, index) => {
        const entrance = index * .2

        // A continuous forward pass: distant blur -> focus -> foreground blur.
        timeline.to(photo, {
          z: () => height() * .5,
          duration: 1,
          ease: 'none',
        }, entrance)
          .to(photo, { autoAlpha: 1, duration: .3, ease: 'none' }, entrance)
          .to(photo, { filter: 'blur(0px)', duration: .5, ease: 'none' }, entrance)
          .to(photo, { filter: 'blur(14px)', duration: .5, ease: 'none' }, entrance + .5)
          .to(photo, { autoAlpha: 0, duration: .2, ease: 'none' }, entrance + .8)
      })

      // Reveal the complete text together, then keep it readable through exit.
      timeline.to(copy, { autoAlpha: 1, duration: .35, ease: 'none' }, .65)

      // Pointer movement uses a separate layer from the scroll transforms.
      const moveObjects = (event: PointerEvent) => {
        if (event.pointerType !== 'mouse') return
        const bounds = scene.getBoundingClientRect()
        const x = (event.clientX - bounds.left) / bounds.width - 0.5
        const y = (event.clientY - bounds.top) / bounds.height - 0.5

        layers.forEach(layer => {
          if (!layer) return
          const depth = Number(layer.dataset.depth)
          layer.style.setProperty('--parallax-x', `${x * depth}px`)
          layer.style.setProperty('--parallax-y', `${y * depth}px`)
        })
      }

      const resetObjects = () => {
        layers.forEach(layer => {
          layer?.style.removeProperty('--parallax-x')
          layer?.style.removeProperty('--parallax-y')
        })
      }

      scene.addEventListener('pointermove', moveObjects, { passive: true })
      scene.addEventListener('pointerleave', resetObjects)

      let active = true
      void document.fonts.ready.then(() => {
        if (active) ScrollTrigger.refresh()
      })

      return () => {
        active = false
        timeline.scrollTrigger?.kill()
        timeline.kill()
        scene.removeEventListener('pointermove', moveObjects)
        scene.removeEventListener('pointerleave', resetObjects)
        resetObjects()
      }
    }, section)

    return () => media.revert()
  }, [])

  return (
    <section id="restaurant" aria-labelledby="restaurant-title" className={styles.experience} ref={sectionRef} tabIndex={-1}>
      <div className={styles.scene} ref={sceneRef}>
        <div className={styles.copy}>
          <h2 id="restaurant-title" className={styles.heading}>Chez Colin</h2>
          <div className={styles.statement}>
            {paragraphs.map((paragraph, paragraphIndex) => (
              <p key={paragraphIndex}>
                {paragraph}
              </p>
            ))}
          </div>
        </div>
        <div aria-hidden="true" className={styles.photoField}>
          {photoSources.map((src, index) => (
            <div className={`${styles.item} ${photoLayouts[index].className}`} data-restaurant-photo key={src}>
              <div className={styles.depthLayer} data-depth={photoLayouts[index].depth}>
                <Image src={src} alt="" fill sizes={photoLayouts[index].sizes} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
