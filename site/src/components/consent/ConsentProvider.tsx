import { createContext, useCallback, useContext, useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { grantConsent, readConsent, revokeConsent, loadAnalytics } from '@/lib/consent'

type ConsentContextValue = {
    // Re-opens the banner so a visitor can change or withdraw consent.
    openSettings: () => void
}

const ConsentContext = createContext<ConsentContextValue>({ openSettings: () => {} })

export const useConsent = () => useContext(ConsentContext)

type Props = {
    children: React.ReactNode
    clarityId: string
    // Absolute on the promo subdomain, relative on the main site.
    privacyUrl: string
}

export const ConsentProvider = ({ children, clarityId, privacyUrl }: Props) => {
    const [open, setOpen] = useState(false)

    useEffect(() => {
        const consent = readConsent()
        if (consent === 'granted') loadAnalytics(clarityId)
        else if (consent === null) setOpen(true)
        // 'denied' — load nothing, show nothing.
    }, [clarityId])

    const openSettings = useCallback(() => setOpen(true), [])

    const accept = () => {
        grantConsent(clarityId)
        setOpen(false)
    }

    const reject = () => {
        setOpen(false)
        revokeConsent()
    }

    return (
        <ConsentContext.Provider value={{ openSettings }}>
            {children}
            <AnimatePresence>
                {open && (
                    <motion.div
                        role="dialog"
                        aria-label="Cookie consent"
                        className="fixed bottom-0 left-0 right-0 z-[100] px-4 pb-4 sm:px-6 sm:pb-6"
                        initial={{ y: '110%' }}
                        animate={{ y: 0 }}
                        exit={{ y: '110%' }}
                        transition={{ duration: 0.35, ease: 'easeOut' }}
                    >
                        <div className="mx-auto flex max-w-4xl flex-col gap-4 rounded-2xl border border-white/15 bg-surface-page/95 p-5 shadow-2xl backdrop-blur sm:flex-row sm:items-center sm:gap-6 sm:p-6">
                            <div className="flex flex-col gap-1">
                                <p className="text-p-md-semibold text-content-heading">We use cookies</p>
                                <p className="text-p-sm text-content-body">
                                    We use analytics cookies (Google Analytics and Microsoft Clarity) to understand how
                                    visitors use our site. They load only if you accept. Necessary cookies are always on.{' '}
                                    <a
                                        href={privacyUrl}
                                        className="underline hover:text-pink-500"
                                    >
                                        Privacy Policy
                                    </a>
                                </p>
                            </div>
                            <div className="flex shrink-0 gap-3 sm:ml-auto">
                                <button
                                    type="button"
                                    onClick={reject}
                                    className="cursor-pointer rounded-full border border-white/25 px-5 py-2.5 text-p-md-semibold text-content-heading transition-colors hover:bg-white/10"
                                >
                                    Reject
                                </button>
                                <button
                                    type="button"
                                    onClick={accept}
                                    className="cursor-pointer rounded-full bg-linear-to-r from-pink-500 to-sapphire-500 px-6 py-2.5 text-p-md-semibold text-content-heading transition-opacity hover:opacity-90"
                                >
                                    Accept
                                </button>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </ConsentContext.Provider>
    )
}
