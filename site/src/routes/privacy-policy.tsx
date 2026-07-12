import { createFileRoute } from '@tanstack/react-router'
import LegalPage from '@/components/legal/LegalPage'
import raw from '../../privacy-pages/privacy-policy.md?raw'

export const Route = createFileRoute('/privacy-policy')({
  head: () => ({
    meta: [
      { title: 'Privacy Policy | CFO AI Nexus' },
      {
        name: 'description',
        content:
          'How Corporate Finance Hub LLC collects, uses and protects your personal data across cfoainexus.com and promo.cfoainexus.com.',
      },
    ],
  }),
  component: () => <LegalPage raw={raw} />,
})
