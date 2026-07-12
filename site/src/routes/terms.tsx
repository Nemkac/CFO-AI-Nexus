import { createFileRoute } from '@tanstack/react-router'
import LegalPage from '@/components/legal/LegalPage'
import raw from '../../privacy-pages/terms-and-conditions.md?raw'

export const Route = createFileRoute('/terms')({
  head: () => ({
    meta: [
      { title: 'Terms & Conditions | CFO AI Nexus' },
      {
        name: 'description',
        content:
          'Terms and Conditions of attendance and participation for CFO AI Nexus virtual events, organised by Corporate Finance Hub LLC.',
      },
    ],
  }),
  component: () => <LegalPage raw={raw} />,
})
