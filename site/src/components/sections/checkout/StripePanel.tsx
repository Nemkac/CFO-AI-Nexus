import { useEffect, useRef, useState } from 'react'
import { loadStripe } from '@stripe/stripe-js'
import { EmbeddedCheckoutProvider, EmbeddedCheckout } from '@stripe/react-stripe-js'
import { motion, AnimatePresence } from 'motion/react'
import { Link } from '@tanstack/react-router'
import Button from '@/components/ui/Button'
import ConsentCheckbox from '@/components/ui/ConsentCheckbox'
import SponsorConsentLabel from '@/components/ui/SponsorConsentLabel'
import { NEWSLETTER_CONSENT_TEXT } from '@/lib/kit'

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY as string)
const TICKET_PRICE = Number(import.meta.env.VITE_TICKET_PRICE) || 295

// Two decimals only when the active price has cents, so whole-dollar tickets
// stay "$295" rather than "$295.00".
const formatUsd = (amount: number) =>
    amount.toLocaleString('en-US', {
        minimumFractionDigits: Number.isInteger(amount) ? 0 : 2,
        maximumFractionDigits: 2,
    })

export type CheckoutConsents = { newsletter: boolean; sponsor: boolean }

interface StripePanelProps {
    clientSecret: string | null
    isLoading: boolean
    onProceed: (quantity: number, consents: CheckoutConsents) => void
    onCancel: () => void
}

const StripePanel = ({ clientSecret, isLoading, onProceed, onCancel }: StripePanelProps) => {
    const [quantity, setQuantity] = useState(1)
    const [termsAccepted, setTermsAccepted] = useState(false)
    const [termsError, setTermsError] = useState(false)
    // Both optional and unchecked by default — neither may block checkout.
    const [newsletterOptIn, setNewsletterOptIn] = useState(false)
    const [sponsorConsent, setSponsorConsent] = useState(false)

    // Browsers restore the previous checked state on reload and React's hydration
    // leaves it alone — see the same guard in ConsentCheckbox. No consent box may
    // come back pre-ticked.
    const termsRef = useRef<HTMLInputElement>(null)
    useEffect(() => {
        if (termsRef.current && termsRef.current.checked !== termsAccepted) {
            termsRef.current.checked = termsAccepted
        }
    }, [termsAccepted])

    const handleProceed = () => {
        if (!termsAccepted) {
            setTermsError(true)
            return
        }
        setTermsError(false)
        onProceed(quantity, { newsletter: newsletterOptIn, sponsor: sponsorConsent })
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
                    <p className="text-h4 text-content-heading">${formatUsd(quantity * TICKET_PRICE)}</p>
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

                {/* Consents — only the first is required. The two below are optional,
                    unbundled, and must never block the purchase. */}
                <div className={`flex flex-col gap-4 transition-opacity ${clientSecret || isLoading ? 'opacity-40 pointer-events-none' : ''}`}>
                    <div className="flex flex-col gap-2">
                        <div className="flex flex-row gap-4 items-start">
                            <input
                                ref={termsRef}
                                type="checkbox"
                                id="terms"
                                checked={termsAccepted}
                                autoComplete="off"
                                onChange={(e) => { setTermsAccepted(e.target.checked); setTermsError(false) }}
                                className="mt-1 cursor-pointer shrink-0"
                            />
                            <label htmlFor="terms" className="text-p-md text-content-heading text-pretty cursor-pointer">
                                I agree to the{' '}
                                <Link to="/terms" className="underline hover:text-pink-500" onClick={(e) => e.stopPropagation()}>Organizer Terms</Link>{' '}
                                and acknowledge that I have read the{' '}
                                <Link to="/privacy-policy" className="underline hover:text-pink-500" onClick={(e) => e.stopPropagation()}>Privacy Policy</Link>.
                            </label>
                        </div>
                        {termsError && <p className="text-p-sm text-red-400">You must accept the terms to continue</p>}
                    </div>

                    <ConsentCheckbox id="newsletter-optin" checked={newsletterOptIn} onChange={setNewsletterOptIn}>
                        {NEWSLETTER_CONSENT_TEXT}
                    </ConsentCheckbox>

                    <ConsentCheckbox id="sponsor-consent" checked={sponsorConsent} onChange={setSponsorConsent}>
                        <SponsorConsentLabel variant="checkout" />
                    </ConsentCheckbox>
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