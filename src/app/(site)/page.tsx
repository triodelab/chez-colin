import Image from 'next/image'
import { getPayload } from 'payload'
import config from '@payload-config'
import { MenuExperience } from '@/components/menu-experience'
import { PressReviews } from '@/components/press-reviews'
import { RestaurantExperience } from '@/components/restaurant-experience'
import { RestaurantLink } from '@/components/restaurant-link'
import { restaurantPhotos } from '@/content/restaurant-photos'
import { ArrowIcon } from '@/components/arrow-icon'
import footerStyles from './footer.module.css'
import bookingStyles from './booking.module.css'

const fallback = {
  heroTitle: 'litt Paris. midt i Oslo.',
  heroText: 'Fransk kjøkken. Gode viner. Lange kvelder på Fredensborg.',
  bookingUrl: 'https://booking.gastroplanner.no/chezcolin/t',
  giftCardUrl: 'https://givn.no/shop/chezcolin',
  address: 'Fredensborgveien 44, 0177 Oslo',
  phone: '23 20 23 23',
  email: 'bestilling@chezcolin.no',
  openingHours: 'Tirsdag–søndag fra 17:00',
}

type Media = { url?: string | null } | number | null | undefined

const source = (media: Media, local: string) =>
  typeof media === 'object' && media?.url ? media.url : local

export default async function Home() {
  let content = fallback
  let images: Record<string, Media> = {}

  try {
    const payload = await getPayload({ config })
    const settings = await payload.findGlobal({ slug: 'site-settings', depth: 1 })
    content = {
      heroTitle: settings.heroTitle || fallback.heroTitle,
      heroText: settings.heroText || fallback.heroText,
      bookingUrl: settings.bookingUrl || fallback.bookingUrl,
      giftCardUrl: settings.giftCardUrl || fallback.giftCardUrl,
      address: settings.address || fallback.address,
      phone: settings.phone || fallback.phone,
      email: settings.email || fallback.email,
      openingHours: settings.openingHours || fallback.openingHours,
    }
    images = settings as unknown as Record<string, Media>
  } catch {
    // The first local render intentionally works before Payload has been initialized.
  }

  const heroImage = source(images.heroImage, '/images/restaurant-sign-ai.webp')
  const [emailName, emailDomain] = content.email.split('@')
  return (
    <main>
      <section id="top" className="club-hero">
        <div className="club-hero-image"><Image className="cover" src={heroImage} alt="Chez Colins skilt på Fredensborg" fill preload quality={90} sizes="(max-width: 900px) 100vw, max(480px, 40vw, 66.67svh)" /></div>
        <div className="club-hero-content">
          <header className="club-header">
            <a className="brand" href="#top" aria-label="Chez Colin forside"><Image src="/images/chez-colin-logo.png" alt="Chez Colin" width={150} height={73} priority /></a>
            <RestaurantLink className="header-about">Om oss <ArrowIcon /></RestaurantLink>
          </header>
          <div className="club-hero-copy">
            <p className="club-eyebrow">Fredensborg, Oslo</p>
            <h1>litt Paris.<br /><em>midt i Oslo.</em></h1>
            <a className="hero-booking" href={content.bookingUrl} target="_blank" rel="noreferrer">Bestill bord <ArrowIcon /></a>
          </div>
          <div className="club-hero-bottom">
            <nav aria-label="Hovedmeny">
              <RestaurantLink><span>01</span> Restauranten</RestaurantLink>
              <a href="#meny"><span>02</span> Meny & vin</a>
              <a href="#apningstider"><span>03</span> Kontakt</a>
            </nav>
            <div className="hero-hours"><span>{content.openingHours}</span><Image src="/images/kitchen.jpg" alt="Tartar på brød" width={170} height={120} /></div>
          </div>
        </div>
      </section>

      <RestaurantExperience photoSources={restaurantPhotos.map(photo => photo.src)} />

      <MenuExperience giftCardUrl={content.giftCardUrl} />

      <PressReviews />

      <section className={`booking-moment ${bookingStyles.moment}`} aria-labelledby="booking-title">
        <div className={`shell ${bookingStyles.layout}`}>
          <div className={`booking-copy ${bookingStyles.copy}`}>
            <h2 id="booking-title">Bestill en kveld<br /> hos oss.</h2>
            <div className={bookingStyles.seasonal}>
              <p>August, september og oktober holder vi åpen fra kl. 17.00 tirsdag t.o.m. søndag.</p>
              <p>Fra 1. november åpner vi kl. 16.00 og i desember holder vi i tillegg åpent de 3 siste mandagene før jul. 7., 14. og 21. desember.</p>
              <p>Siste åpningsdag er 22. desember, før vi åpner igjen 6. januar.</p>
            </div>
            <a className={`booking-button ${bookingStyles.button}`} href={content.bookingUrl} target="_blank" rel="noreferrer">Bestill bord <ArrowIcon /></a>
            <p className={bookingStyles.groupNote}>Hvis du ønsker bord for flere enn 7 personer gjelder en felles meny, send mail til <a href={`mailto:${content.email}`}>{content.email}</a></p>
          </div>
          <section id="apningstider" aria-labelledby="opening-hours-title" className={bookingStyles.hoursCard}>
            <header>
              <h3 id="opening-hours-title">Åpningstider</h3>
              <span lang="en">Opening hours</span>
            </header>
            <dl>
              <div><dt>Tirsdag–søndag</dt><dd>fra 17:00</dd></div>
              <div className={bookingStyles.englishHours} lang="en"><dt>Tuesday–Sunday</dt><dd>from 5 pm</dd></div>
            </dl>
            <a className={bookingStyles.menuLink} href="#meny">Meny og vinkart <ArrowIcon /></a>
            <div className={bookingStyles.reviews}>
              <p className={bookingStyles.reviewsLabel}>Les gjestenes anmeldelser</p>
              <div className={bookingStyles.reviewLinks}>
                <a
                  aria-label="Les anmeldelser av Chez Colin på Tripadvisor – 4,4 av 5"
                  className={bookingStyles.reviewLink}
                  href="https://www.tripadvisor.com/Restaurant_Review-g190479-d8073605-Reviews-Chez_Colin-Oslo_Eastern_Norway.html"
                  rel="noreferrer"
                  target="_blank"
                >
                  <span className={bookingStyles.reviewBrand}><Image alt="" src="/images/brands/tripadvisor.svg" width={96} height={15} /></span>
                  <ArrowIcon />
                  <ReviewRating value={4.4} provider="Tripadvisor" />
                </a>
                <a
                  aria-label="Se Chez Colin og anmeldelser på Google Maps – 4,7 av 5"
                  className={bookingStyles.reviewLink}
                  href="https://www.google.com/maps/search/?api=1&query=Chez+Colin%2C+Fredensborgveien+44%2C+Oslo"
                  rel="noreferrer"
                  target="_blank"
                >
                  <span className={bookingStyles.reviewBrand}><Image alt="" src="/images/brands/google.png" width={20} height={20} /><span>Google</span></span>
                  <ArrowIcon />
                  <ReviewRating value={4.7} provider="Google" />
                </a>
              </div>
            </div>
          </section>
        </div>
      </section>

      <footer className={footerStyles.footer}>
        <div className={`shell ${footerStyles.content}`}>
          <div className={footerStyles.details} data-footer-details>
            <div className={footerStyles.primaryDetails}>
              <span>Vises på Fredensborg</span>
            </div>
            <div><span>Følg oss</span><a href="https://www.facebook.com/ChezColin" target="_blank" rel="noreferrer">Facebook</a><a href={content.giftCardUrl} target="_blank" rel="noreferrer">Gavekort</a><span className={footerStyles.hoursLabel}>Åpningstider</span><p>{content.openingHours}</p></div>
            <div className={footerStyles.contactDetails}><span>Kontakt</span><address>{content.address}</address><a href={`tel:${content.phone.replaceAll(' ', '')}`}>{content.phone}</a><a href={`mailto:${content.email}`}>{emailName}<wbr />@{emailDomain}</a><a className={footerStyles.booking} href={`mailto:${content.email}`}>Kontakt oss <ArrowIcon /></a></div>
          </div>
          <div className={footerStyles.logo} data-footer-wordmark>
            <Image className={footerStyles.logoImage} src="/images/chez-colin-logo-white.png" alt="Chez Colin" width={1650} height={335} />
          </div>
        </div>
      </footer>
    </main>
  )
}

// Ratings from the linked public listings, checked 27 October 2026; these are not a live feed.
function ReviewRating({ value, provider }: { value: number; provider: string }) {
  const score = value.toLocaleString('nb-NO', { minimumFractionDigits: 1 })
  return (
    <span aria-label={`${score} av 5 på ${provider}`} className={bookingStyles.rating} role="img">
      <span aria-hidden="true" className={bookingStyles.stars}>
        <span className={bookingStyles.emptyStars}>★★★★★</span>
        <span className={bookingStyles.filledStars} style={{ width: `${value / 5 * 100}%` }}>★★★★★</span>
      </span>
      <span aria-hidden="true">{score} / 5</span>
    </span>
  )
}
