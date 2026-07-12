import { HeadContent, Scripts, createRootRoute } from '@tanstack/react-router'
import { TanStackRouterDevtoolsPanel } from '@tanstack/react-router-devtools'
import { TanStackDevtools } from '@tanstack/react-devtools'
import { useCallback, useEffect, useRef, useState } from 'react'

import Header from '../components/layout/Header'
import Footer from '../components/layout/Footer'
import LoadingScreen from '../components/layout/LoadingScreen'
import { PageLoadContext } from '../components/layout/PageLoadContext'
import { MainContentProvider } from '../components/layout/MainContentContext'
import { ConsentProvider } from '@/components/consent/ConsentProvider'
import AgendaModal from '@/components/sections/landing/AgendaModal'

import appCss from '../styles.css?url'
import Banner from '@/components/layout/Banner'

const AGENDA_KIT_UID = 'a28fd57841'

export const Route = createRootRoute({
  head: () => ({
    meta: [
      {
        charSet: 'utf-8',
      },
      {
        name: 'viewport',
        content: 'width=device-width, initial-scale=1',
      },
      {
        title: 'CFO AI Nexus 2026',
      },
      // Open Graph
      { property: 'og:title', content: 'CFO AI Nexus 2026' },
      { property: 'og:description', content: 'October 20–21, 2026 | 100% Virtual — The premier AI conference for finance leaders.' },
      { property: 'og:image', content: 'https://cfo-ai-nexus.web.app/og-image.png' },
      { property: 'og:image:width', content: '1200' },
      { property: 'og:image:height', content: '630' },
      { property: 'og:type', content: 'website' },
      { property: 'og:url', content: 'https://cfo-ai-nexus.web.app/' },
      // Twitter / X
      { name: 'twitter:card', content: 'summary_large_image' },
      { name: 'twitter:title', content: 'CFO AI Nexus 2026' },
      { name: 'twitter:description', content: 'October 20–21, 2026 | 100% Virtual — The premier AI conference for finance leaders.' },
      { name: 'twitter:image', content: 'https://cfo-ai-nexus.web.app/og-image.png' },
    ],
    scripts: [
      // Consent Mode v2 defaults. Loads nothing external — Google Analytics and
      // Microsoft Clarity are injected by ConsentProvider only after the visitor
      // accepts. See src/lib/consent.ts.
      {
        children: `window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
window.gtag = gtag;
gtag('consent', 'default', {
  'ad_storage': 'denied',
  'ad_user_data': 'denied',
  'ad_personalization': 'denied',
  'analytics_storage': 'denied',
  'wait_for_update': 500
});`,
      },
    ],
    links: [
      { rel: 'icon', href: '/favicon.webp', type: 'image/png' },
      { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
      {
        rel: 'preconnect',
        href: 'https://fonts.gstatic.com',
        crossOrigin: 'anonymous',
      },
      {
        rel: 'stylesheet',
        href: 'https://fonts.googleapis.com/css2?family=DM+Sans:opsz,wght@9..40,400;9..40,500;9..40,700&family=Sofia+Sans+Condensed:wght@400;500;600&display=swap',
      },
      {
        rel: 'stylesheet',
        href: appCss,
      },
    ],
  }),
  shellComponent: RootDocument,
})

function RootDocument({ children }: { children: React.ReactNode }) {
  const [isLoaded, setIsLoaded] = useState(false)
  const [bannerHeight, setBannerHeight] = useState(52)
  const [headerHeight, setHeaderHeight] = useState(80)
  const [agendaOpen, setAgendaOpen] = useState(false)

  const kitContainerRef = useRef<HTMLDivElement>(null)
  const kitScriptInjected = useRef(false)

  const signalReady = useCallback(() => {
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        setIsLoaded(true)
      })
    })
  }, [])

  useEffect(() => {
    document.fonts.ready.then(() => {
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          setIsLoaded((prev) => (prev ? prev : true))
        })
      })
    })
  }, [])

  useEffect(() => {
    document.documentElement.style.setProperty(
      '--layout-offset',
      `${bannerHeight + headerHeight}px`
    )
  }, [bannerHeight, headerHeight])

  useEffect(() => {
    if (kitScriptInjected.current || !kitContainerRef.current) return
    kitScriptInjected.current = true
    const script = document.createElement('script')
    script.src = `https://corporate-finance-learning.kit.com/${AGENDA_KIT_UID}/index.js`
    script.async = true
    script.setAttribute('data-uid', AGENDA_KIT_UID)
    kitContainerRef.current.appendChild(script)
  }, [])

  return (
    <html lang="en">
      <head>
        <HeadContent />
        <link rel="icon" href="/favicon.webp" type="image/png" />
      </head>
      <body className="flex flex-col min-h-screen bg-surface-page">
        <PageLoadContext.Provider value={{ isLoaded, signalReady }}>
         <ConsentProvider clarityId="xek177ja6y" privacyUrl="/privacy-policy">
         <MainContentProvider>
          <LoadingScreen isVisible={!isLoaded} />
          <Banner
            onHeightChange={setBannerHeight}
            onTypingDone={() => { }}
          />
          <Header
            bannerHeight={bannerHeight}
            onHeightChange={setHeaderHeight}
            onDownloadAgenda={() => setAgendaOpen(true)}
          />
          <main
            className="flex-1"
            style={{ paddingTop: bannerHeight + headerHeight }}
          >
            {children}
          </main>
          <Footer />
          <AgendaModal open={agendaOpen} onClose={() => setAgendaOpen(false)} />
          <div
            ref={kitContainerRef}
            style={{ position: 'fixed', left: '-9999px', visibility: 'hidden', pointerEvents: 'none' }}
            aria-hidden="true"
          />
          <TanStackDevtools
            config={{
              position: 'bottom-right',
            }}
            plugins={[
              {
                name: 'Tanstack Router',
                render: <TanStackRouterDevtoolsPanel />,
              },
            ]}
          />
         </MainContentProvider>
         </ConsentProvider>
        </PageLoadContext.Provider>
        <Scripts />
      </body>
    </html>
  )
}
