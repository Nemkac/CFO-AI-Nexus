import { useState } from 'react'
import Button from '@/components/ui/Button'

interface PaymentProps {
    selectedPriceId: string | null
    onClientSecret: (clientSecret: string) => void
}

const Payment = ({ selectedPriceId, onClientSecret }: PaymentProps) => {
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const handlePurchase = async () => {
        if (!selectedPriceId) return
        setIsLoading(true)
        setError(null)
        try {
            const res = await fetch(import.meta.env.VITE_CHECKOUT_FUNCTION_URL as string, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ priceId: selectedPriceId }),
            })
            if (!res.ok) throw new Error('Failed to create session')
            const { clientSecret } = await res.json()
            onClientSecret(clientSecret)
        } catch {
            setError('Something went wrong. Please try again.')
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="flex flex-col w-full border-[0.5px] h-min border-stroke-default rounded-2xl">
            <div className="flex flex-row w-full items-start border-b-[0.5px] border-stroke-default p-6 md:justify-between gap-4">
                <h5 className="text-h5 text-content-heading">Payment</h5>
                <img src="./icons/PaymentCards.svg" />
            </div>
            <div className="flex flex-col gap-6 w-full p-6">
                <p className="text-p-md text-content-body">
                    {selectedPriceId
                        ? 'Click below to securely complete your purchase via Stripe.'
                        : 'Please select a ticket type above to continue.'}
                </p>
                <div className="flex flex-row w-full gap-4">
                    <input type="checkbox" id="terms" />
                    <label htmlFor="terms" className="text-p-md text-content-heading text-balance">
                        By placing this order I agree to the{' '}
                        <span className="underline hover:cursor-pointer hover:text-pink-500">Organizer Terms</span>{' '}
                        and{' '}
                        <span className="underline hover:cursor-pointer hover:text-pink-500">Privacy Policy</span>
                    </label>
                </div>
                {error && <p className="text-p-sm text-red-400">{error}</p>}
                <Button
                    className="w-full"
                    label={isLoading ? 'Loading...' : 'Proceed to Payment'}
                    onClick={handlePurchase}
                    disabled={!selectedPriceId || isLoading}
                />
            </div>
        </div>
    )
}

export default Payment