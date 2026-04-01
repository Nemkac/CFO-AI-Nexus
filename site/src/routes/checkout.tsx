import { useEffect, useRef, useState } from 'react'
import { createFileRoute } from '@tanstack/react-router'
import GeneralData, { type GeneralDataHandle } from '@/components/sections/checkout/GeneralData'
import StripePanel from '@/components/sections/checkout/StripePanel'

export const Route = createFileRoute('/checkout')({ component: CheckoutPage })

function CheckoutPage() {
  const [clientSecret, setClientSecret] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const generalDataRef = useRef<GeneralDataHandle>(null)
  const stripePanelRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if ((clientSecret || isLoading) && stripePanelRef.current) {
      const el = stripePanelRef.current
      const rect = el.getBoundingClientRect()
      const layoutOffset = parseInt(
        getComputedStyle(document.documentElement).getPropertyValue('--layout-offset') || '0'
      )
      const absoluteTop = rect.top + window.scrollY - layoutOffset - 16
      window.scrollTo({ top: absoluteTop, behavior: 'smooth' })
    }
  }, [clientSecret, isLoading])

  const handleCancel = () => {
    setClientSecret(null)
    setIsLoading(false)
  }

  const handleProceed = async (quantity: number) => {
    const data = generalDataRef.current?.validateAndGetData(quantity)
    if (!data) return

    setIsLoading(true)
    try {
      const res = await fetch(import.meta.env.VITE_CHECKOUT_FUNCTION_URL as string, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          priceId: import.meta.env.VITE_ACTIVE_PRICE_ID,
          quantity,
          metadata: data as unknown as Record<string, string>,
        }),
      })
      if (!res.ok) throw new Error('Failed to create session')
      const { clientSecret } = await res.json()
      setClientSecret(clientSecret)
    } catch {
      // error is handled by the button remaining enabled
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="bg-surface-page py-10 md:py-20 flex items-start w-full justify-center flex-col p-4">
      <div className="grid grid-cols-1 lg:grid-cols-2 w-full gap-8 max-w-6xl mx-auto items-start">
        <GeneralData ref={generalDataRef} locked={!!(clientSecret || isLoading)} />
        <div ref={stripePanelRef}>
          <StripePanel
            clientSecret={clientSecret}
            isLoading={isLoading}
            onProceed={handleProceed}
            onCancel={handleCancel}
          />
        </div>
      </div>
    </div>
  )
}