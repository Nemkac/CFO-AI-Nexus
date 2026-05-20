import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { Check, X } from 'lucide-react'

const KIT_API_KEY = import.meta.env.VITE_KIT_API_KEY ?? ''
const KIT_FORM_ID = '9463108'
const KIT_FORM_UID = 'a28fd57841'

type Props = {
    open: boolean
    onClose: () => void
}

const triggerKitFormAndWait = (uid: string, email: string): Promise<void> =>
    new Promise(resolve => {
        const attempt = (retriesLeft: number) => {
            const form = document.querySelector<HTMLFormElement>(`form[data-uid="${uid}"]`)
            if (!form) {
                if (retriesLeft > 0) setTimeout(() => attempt(retriesLeft - 1), 300)
                else resolve()
                return
            }
            const emailInput = form.querySelector<HTMLInputElement>('input[type="email"], input[name="email_address"]')
            if (emailInput) {
                const setter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value')?.set
                setter?.call(emailInput, email)
                emailInput.dispatchEvent(new Event('input', { bubbles: true }))
            }
            const submitBtn = form.querySelector<HTMLButtonElement>('button[type="submit"], input[type="submit"]')
            if (submitBtn) submitBtn.click()
            else form.dispatchEvent(new SubmitEvent('submit', { bubbles: true, cancelable: true }))
            setTimeout(resolve, 1500)
        }
        attempt(10)
    })

const DarkInput = ({
    type,
    placeholder,
    value,
    onChange,
}: {
    type: string
    placeholder: string
    value: string
    onChange: (v: string) => void
}) => {
    const [focused, setFocused] = useState(false)
    return (
        <input
            type={type}
            placeholder={placeholder}
            value={value}
            onChange={e => onChange(e.target.value)}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            className="rounded-xl px-4 py-3.5 w-full outline-none text-p-md text-white placeholder:text-white/35 transition-colors"
            style={{
                background: 'rgba(255,255,255,0.07)',
                border: `1px solid ${focused || value ? '#FC69D2' : 'rgba(143,157,255,0.3)'}`,
            }}
        />
    )
}

const AgendaModal = ({ open, onClose }: Props) => {
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [loading, setLoading] = useState(false)
    const [submitted, setSubmitted] = useState(false)
    const [error, setError] = useState('')

    useEffect(() => {
        if (open) document.body.style.overflow = 'hidden'
        else document.body.style.overflow = ''
        return () => { document.body.style.overflow = '' }
    }, [open])

    useEffect(() => {
        if (!open) {
            const id = setTimeout(() => {
                setName('')
                setEmail('')
                setError('')
                setSubmitted(false)
            }, 300)
            return () => clearTimeout(id)
        }
    }, [open])

    const handleSubmit = async (e: { preventDefault(): void }) => {
        e.preventDefault()
        if (!name || !email) {
            setError('Please fill in all fields.')
            return
        }
        setLoading(true)
        setError('')

        try {
            await triggerKitFormAndWait(KIT_FORM_UID, email)

            const res = await fetch(`https://api.convertkit.com/v3/forms/${KIT_FORM_ID}/subscribe`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    api_key: KIT_API_KEY,
                    email,
                    first_name: name,
                }),
            })
            const data = await res.json()
            if (!res.ok && !data.subscription) {
                console.warn('Kit V3 subscribe failed:', data.message)
            }

            setSubmitted(true)
        } catch {
            setError('Network error. Please check your connection and try again.')
        } finally {
            setLoading(false)
        }
    }

    return (
        <AnimatePresence>
            {open && (
                <>
                    <motion.div
                        className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.25 }}
                        onClick={onClose}
                    />

                    <div className="fixed inset-0 z-50 flex items-center justify-center px-4" onClick={onClose}>
                        <motion.div
                            className="relative w-full max-w-lg md:max-w-2xl rounded-2xl p-8 md:p-12 flex flex-col gap-8 shadow-2xl"
                            style={{
                                background: 'linear-gradient(to top, #040820, #1F2566)',
                                border: '0.5px solid #8F9DFF',
                            }}
                            initial={{ opacity: 0, scale: 0.92, y: 24 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.92, y: 24 }}
                            transition={{ duration: 0.3, ease: 'easeOut' }}
                            onClick={e => e.stopPropagation()}
                        >
                            <button
                                onClick={onClose}
                                className="absolute top-4 right-4 p-1.5 rounded-full text-white/50 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
                            >
                                <X size={18} />
                            </button>

                            {submitted ? (
                                <div className="flex flex-col items-center gap-4 py-8 text-center">
                                    <div className="w-16 h-16 rounded-full bg-white/10 flex items-center justify-center">
                                        <Check className="w-8 h-8 text-[#8F9DFF]" />
                                    </div>
                                    <h2 className="text-h3 text-content-heading">Check your inbox!</h2>
                                    <p className="text-p-md text-content-heading text-balance">The agenda has been sent to your email address.</p>
                                    <button
                                        onClick={onClose}
                                        className="mt-4 px-8 py-3 rounded-full text-p-md-semibold text-white hover:opacity-80 transition-opacity cursor-pointer"
                                        style={{ border: '0.5px solid #8F9DFF', background: 'rgba(255,255,255,0.07)' }}
                                    >
                                        Close
                                    </button>
                                </div>
                            ) : (
                                <>
                                    <div className="flex flex-col w-full items-center gap-2">
                                        <h2 className="text-h3 text-content-heading">The 2026 Program</h2>
                                        <p className="text-p-md text-content-heading text-center text-balance">We're pleased to share the current (preliminary) version of the program with you. Since we are adding new speakers, we'll keep you posted on any updates as it develops.</p>
                                    </div>

                                    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                            <div className="flex flex-col gap-2">
                                                <label className="text-p-md-semibold text-content-heading">Full name</label>
                                                <DarkInput type="text" placeholder="John Smith" value={name} onChange={setName} />
                                            </div>
                                            <div className="flex flex-col gap-2">
                                                <label className="text-p-md-semibold text-content-heading">Email</label>
                                                <DarkInput type="email" placeholder="john@company.com" value={email} onChange={setEmail} />
                                            </div>
                                        </div>

                                        {error && <p className="text-p-sm text-red-400 text-center">{error}</p>}

                                        <div className="flex flex-col gap-6 mt-2">
                                            <button
                                                type="submit"
                                                disabled={loading}
                                                className="w-full rounded-full py-3.5 text-p-md-semibold text-white transition-opacity disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
                                                style={{ background: 'linear-gradient(to right, #CA54A8, #3E4ACC)' }}
                                            >
                                                {loading ? 'Sending...' : 'SEND ME THE PROGRAM'}
                                            </button>
                                            <p className="text-p-sm text-content-heading text-center text-balance">By downloading the program, you'll be subscribed to CFO AI Nexus news. Unsubscribe anytime.</p>
                                        </div>
                                    </form>
                                </>
                            )}
                        </motion.div>
                    </div>
                </>
            )}
        </AnimatePresence>
    )
}

export default AgendaModal