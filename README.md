# Chez Colin

En Next.js- og Payload-løsning for Chez Colin med bordbestilling, PDF-menyer, gavekort og anmeldelser. Frontenden bruker Next.js App Router, React, GSAP ScrollTrigger og selvhostede Bitter- og Barlow Condensed-fonter.

## Kom i gang

1. Installer en Node.js-versjon som støttes av prosjektets Next.js- og Payload-versjoner.
2. Kjør `npm ci`.
3. Kopiér `.env.example` til `.env`, og sett `PAYLOAD_SECRET` til en lang, tilfeldig verdi.
4. Kjør `npm run dev` og åpne [http://localhost:3000](http://localhost:3000).
5. Åpne [http://localhost:3000/admin](http://localhost:3000/admin), opprett den første brukeren og rediger **Nettsideinnhold**.

## Redigering i Payload

Forsiden henter bordbestillingslenke, gavekortlenke, kontaktinformasjon, åpningstider og hero-bilde fra **Nettsideinnhold**. Last opp bilder under **Media** først, og velg deretter hero-bildet i innstillingene.

Øvrige tekster, Instagram-bilder, anmeldelser og animasjoner ligger foreløpig i `src/app/(site)/`, `src/components/` og `src/content/`. Payload har også felter for flere bilder og hero-tekst; disse er ikke alle koblet til dagens layout.

## Menyer og anmeldelser

PDF-ene i `public/menus/` åpnes fra menyvisningen. Når meny eller vinkart endres, oppdater både PDF-filen og tilhørende forhåndsvisning i `public/images/menu-previews/`.

Presseomtaler ligger i `src/components/press-reviews.tsx`. Vurderingstallene for Google og Tripadvisor er statiske i `src/app/(site)/page.tsx` og oppdateres manuelt.

## Kontroll

```sh
npm run lint
npm run build
```

`lint` kjører TypeScript-kontroll.

## Produksjon

Sett `PAYLOAD_SECRET` og `DATABASE_URL` i driftsmiljøet. Kjør `npm run build` og deretter `npm run start`. Standarddatabase er lokal SQLite (`file:./chez-colin.db`); database og opplastede bilder i `media/` trenger vedvarende lagring.

Miljøfiler, lokal database, opplastinger, avhengigheter og byggefiler holdes utenfor Git. `.env.example` inneholder kun eksempelverdier.
