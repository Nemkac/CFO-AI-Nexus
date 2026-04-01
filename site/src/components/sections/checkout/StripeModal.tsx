import { loadStripe } from '@stripe/stripe-js'
import { EmbeddedCheckoutProvider, EmbeddedCheckout } from '@stripe/react-stripe-js'

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY as string)

interface StripeModalProps {
    clientSecret: string
    onClose: () => void
}

const StripeModal = ({ clientSecret, onClose }: StripeModalProps) => {
    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4"
            onClick={(e) => { if (e.target === e.currentTarget) onClose() }}
        >
            <div className="relative w-full max-w-2xl bg-surface-page rounded-2xl border-[0.5px] border-stroke-default overflow-hidden">
                <div className="flex items-center justify-between px-6 py-4 border-b-[0.5px] border-stroke-default">
                    <p className="text-p-md-semibold text-content-heading">Complete Your Purchase</p>
                    <button
                        onClick={onClose}
                        className="text-content-body hover:text-content-heading transition-colors text-xl leading-none"
                    >
                        ✕
                    </button>
                </div>
                <div className="max-h-[80vh] overflow-y-auto">
                    <EmbeddedCheckoutProvider stripe={stripePromise} options={{ clientSecret }}>
                        <EmbeddedCheckout />
                    </EmbeddedCheckoutProvider>
                </div>
            </div>
        </div>
    )
}

export default StripeModal