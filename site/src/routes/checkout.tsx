import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/checkout')({ component: CheckoutPage })

function CheckoutPage() {
  return (
    <div className="max-w-7xl mx-auto px-6 py-16">
      <h1 className="text-4xl font-bold text-white mb-4">Get Tickets</h1>
      <p className="text-gray-400">Registration opening soon.</p>
    </div>
  )
}
