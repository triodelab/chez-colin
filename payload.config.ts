import { sqliteAdapter } from '@payloadcms/db-sqlite'
import { buildConfig } from 'payload'

const isProduction = process.env.NODE_ENV === 'production'

export default buildConfig({
  admin: {
    user: 'users',
    importMap: { baseDir: process.cwd() },
  },
  collections: [
    {
      slug: 'users',
      auth: true,
      fields: [{ name: 'name', type: 'text' }],
    },
    {
      slug: 'media',
      upload: {
        staticDir: `${process.cwd()}/media`,
        mimeTypes: ['image/*'],
      },
      access: { read: () => true },
      fields: [{ name: 'alt', type: 'text', required: true }],
    },
  ],
  globals: [
    {
      slug: 'site-settings',
      label: 'Nettsideinnhold',
      fields: [
        { name: 'heroTitle', label: 'Tittel i toppfelt', type: 'text', defaultValue: 'litt Paris. midt i Oslo.' },
        { name: 'heroText', label: 'Tekst i toppfelt', type: 'textarea', defaultValue: 'Fransk kjøkken. Gode viner. Lange kvelder på Fredensborg.' },
        { name: 'bookingUrl', label: 'Lenke til bordbestilling', type: 'text', defaultValue: 'https://booking.gastroplanner.no/chezcolin/t' },
        { name: 'giftCardUrl', label: 'Lenke til gavekort', type: 'text', defaultValue: 'https://givn.no/shop/chezcolin' },
        { name: 'address', label: 'Adresse', type: 'text', defaultValue: 'Fredensborgveien 44, 0177 Oslo' },
        { name: 'phone', label: 'Telefon', type: 'text', defaultValue: '23 20 23 23' },
        { name: 'email', label: 'E-post', type: 'email', defaultValue: 'bestilling@chezcolin.no' },
        { name: 'openingHours', label: 'Åpningstider', type: 'text', defaultValue: 'Tirsdag–søndag fra 17:00' },
        { name: 'heroImage', label: 'Hero-bilde', type: 'upload', relationTo: 'media' },
        { name: 'interiorImage', label: 'Interiørbilde', type: 'upload', relationTo: 'media' },
        { name: 'foodImage', label: 'Matbilde', type: 'upload', relationTo: 'media' },
        { name: 'wineImage', label: 'Vinbilde', type: 'upload', relationTo: 'media' },
      ],
    },
  ],
  db: sqliteAdapter({
    client: { url: process.env.DATABASE_URL || 'file:./chez-colin.db' },
  }),
  secret: process.env.PAYLOAD_SECRET || (isProduction ? '' : 'chez-colin-local-development-secret'),
})
