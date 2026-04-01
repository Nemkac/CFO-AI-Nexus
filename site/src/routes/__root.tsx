import { HeadContent, Scripts, createRootRoute } from '@tanstack/react-router'
import { TanStackRouterDevtoolsPanel } from '@tanstack/react-router-devtools'
import { TanStackDevtools } from '@tanstack/react-devtools'
import { useCallback, useEffect, useState } from 'react'

import Header from '../components/layout/Header'
import Footer from '../components/layout/Footer'
import LoadingScreen from '../components/layout/LoadingScreen'
import { PageLoadContext } from '../components/layout/PageLoadContext'

import appCss from '../styles.css?url'
import Banner from '@/components/layout/Banner'

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
      { property: 'og:image', content: 'https://cfo-ai-nexus.web.app/og-image.webp' },
      { property: 'og:image:width', content: '1200' },
      { property: 'og:image:height', content: '630' },
      { property: 'og:type', content: 'website' },
      { property: 'og:url', content: 'https://cfo-ai-nexus.web.app/' },
      // Twitter / X
      { name: 'twitter:card', content: 'summary_large_image' },
      { name: 'twitter:title', content: 'CFO AI Nexus 2026' },
      { name: 'twitter:description', content: 'October 20–21, 2026 | 100% Virtual — The premier AI conference for finance leaders.' },
      { name: 'twitter:image', content: 'https://cfo-ai-nexus.web.app/og-image.webp' },
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

  return (
    <html lang="en">
      <head>
        <HeadContent />
        <link rel="icon" href="/favicon.webp" type="image/png" />
      </head>
      <body className="flex flex-col min-h-screen bg-surface-page">
        <PageLoadContext.Provider value={{ isLoaded, signalReady }}>
          <LoadingScreen isVisible={!isLoaded} />
          <Banner
            onHeightChange={setBannerHeight}
            onTypingDone={() => { }}
          />
          <Header
            bannerHeight={bannerHeight}
            onHeightChange={setHeaderHeight}
          />
          <main
            className="flex-1"
            style={{ paddingTop: bannerHeight + headerHeight }}
          >
            {children}
          </main>
          <Footer />
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
        </PageLoadContext.Provider>
        <Scripts />
      </body>
    </html>
  )
}
