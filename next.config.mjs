import { withPayload } from '@payloadcms/next/withPayload'

export default withPayload({
  images: {
    formats: ['image/avif', 'image/webp'],
    qualities: [75, 90],
  },
})
