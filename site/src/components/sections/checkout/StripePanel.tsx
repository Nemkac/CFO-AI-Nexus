import { useState } from 'react'
import { loadStripe } from '@stripe/stripe-js'
import { EmbeddedCheckoutProvider, EmbeddedCheckout } from '@stripe/react-stripe-js'
import { motion, AnimatePresence } from 'motion/react'
import Button from '@/components/ui/Button'

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY as string)
const TICKET_PRICE = Number(import.meta.env.VITE_TICKET_PRICE) || 125

interface StripePanelProps {
    clientSecret: string | null
    isLoading: boolean
    onProceed: (quantity: number) => void
    onCancel: () => void
}

const StripePanel = ({ clientSecret, isLoading, onProceed, onCancel }: StripePanelProps) => {
    const [quantity, setQuantity] = useState(1)
    const [termsAccepted, setTermsAccepted] = useState(false)
    const [termsError, setTermsError] = useState(false)

    const handleProceed = () => {
        if (!termsAccepted) {
            setTermsError(true)
            return
        }
        setTermsError(false)
        onProceed(quantity)
    }

    return (
        <div className="flex flex-col w-full border-[0.5px] border-stroke-default rounded-2xl overflow-hidden">
            <div className="flex flex-row w-full items-start border-b-[0.5px] border-stroke-default p-6">
                <h5 className="text-h5 text-content-heading">Payment</h5>
            </div>

            <div className="flex flex-col gap-6 w-full p-6">
                {/* Total price */}
                <div className="flex flex-row items-center justify-between pt-2">
                    <p className="text-h4 text-content-heading">Total:</p>
                    <p className="text-h4 text-content-heading">${(quantity * TICKET_PRICE).toLocaleString()}</p>
                </div>

                {/* Quantity counter */}
                <div className={`flex flex-row items-center justify-between py-2 transition-opacity ${clientSecret || isLoading ? 'opacity-40 pointer-events-none' : ''}`}>
                    <p className="text-p-md text-content-heading">Number of tickets:</p>
                    <div className="flex flex-row items-center gap-4">
                        <button
                            onClick={() => setQuantity(q => Math.max(1, q - 1))}
                            className="size-9 rounded-xl border-[0.5px] border-stroke-default bg-sapphire-800/20 hover:bg-sapphire-800/50 text-content-heading flex items-center justify-center transition-colors cursor-pointer"
                        >−</button>
                        <p className="text-p-md-semibold text-content-heading w-4 text-center">{quantity}</p>
                        <button
                            onClick={() => setQuantity(q => q + 1)}
                            className="size-9 rounded-xl border-[0.5px] border-stroke-default bg-sapphire-800/20 hover:bg-sapphire-800/50 text-content-heading flex items-center justify-center transition-colors cursor-pointer"
                        >+</button>
                    </div>
                </div>

                {/* Terms */}
                <div className={`flex flex-col gap-2 transition-opacity ${clientSecret || isLoading ? 'opacity-40 pointer-events-none' : ''}`}>
                    <div className="flex flex-row gap-4 items-start">
                        <input
                            type="checkbox"
                            id="terms"
                            checked={termsAccepted}
                            onChange={(e) => { setTermsAccepted(e.target.checked); setTermsError(false) }}
                            className="mt-1 cursor-pointer"
                        />
                        <label htmlFor="terms" className="text-p-md text-content-heading text-pretty cursor-pointer">
                            By placing this order I agree to the <span className="underline hover:text-pink-500">Organizer Terms</span> and <span className="underline hover:text-pink-500">Privacy Policy</span>
                        </label>
                    </div>
                    {termsError && <p className="text-p-sm text-red-400">You must accept the terms to continue</p>}
                </div>

                {clientSecret || isLoading ? (
                    <button
                        onClick={onCancel}
                        className="w-full py-3 px-6 rounded-xl border-[0.5px] border-stroke-default text-p-md text-content-body hover:text-content-heading hover:border-stroke-hover transition-colors cursor-pointer"
                    >
                        Cancel payment
                    </button>
                ) : (
                    <Button
                        label="Proceed to Payment"
                        onClick={handleProceed}
                        className="w-full"
                    />
                )}
            </div>

            {/* Stripe form area */}
            <div className="flex flex-col w-full border-stroke-default">
                <AnimatePresence mode="wait">
                    {!clientSecret && !isLoading && (
                        <motion.div
                            key="placeholder"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.3 }}
                            className="flex flex-col items-center justify-center gap-4 p-10 min-h-80 text-center"
                        >
                            <img src="/icons/PaymentCards.svg" className="opacity-40 w-32" />
                            <p className="text-p-md text-content-body text-balance">
                                Click <span className="text-content-heading">Proceed to Payment</span><br /> to securely enter your card details.
                            </p>
                        </motion.div>
                    )}

                    {isLoading && (
                        <motion.div
                            key="loading"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.3 }}
                            className="flex items-center justify-center min-h-80"
                        >
                            <div className="size-8 rounded-full border-2 border-pink-500 border-t-transparent animate-spin" />
                        </motion.div>
                    )}

                    {clientSecret && (
                        <motion.div
                            key="checkout"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.4 }}
                            className="w-full py-8"
                        >
                            <div className="flex justify-center pb-4">
                                <img src="/assets/logo.svg" alt="CFO AI Nexus" className="h-8" />
                            </div>
                            <EmbeddedCheckoutProvider stripe={stripePromise} options={{ clientSecret }}>
                                <EmbeddedCheckout />
                            </EmbeddedCheckoutProvider>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    )
}

export default StripePanel