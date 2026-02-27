import { HeadContent, Scripts, createRootRoute } from '@tanstack/react-router'
import { TanStackRouterDevtoolsPanel } from '@tanstack/react-router-devtools'
import { TanStackDevtools } from '@tanstack/react-devtools'
import { useCallback, useEffect, useState } from 'react'

import Header from '../components/layout/Header'
import Footer from '../components/layout/Footer'
import LoadingScreen from '../components/layout/LoadingScreen'
import { PageLoadContext } from '../components/layout/PageLoadContext'

import appCss from '../styles.css?url'

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
        title: 'CFO AI Nexus 2025',
      },
    ],
    links: [
      { rel: 'icon', href: '/favicon.png', type: 'image/png' },
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

  return (
    <html lang="en">
      <head>
        <HeadContent />
        <link rel="icon" href="/favicon.png" type="image/png" />
      </head>
      <body className="flex flex-col min-h-screen bg-surface-page">
        <PageLoadContext.Provider value={{ isLoaded, signalReady }}>
          <LoadingScreen isVisible={!isLoaded} />
          <Header />
          <main className="flex-1">{children}</main>
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
