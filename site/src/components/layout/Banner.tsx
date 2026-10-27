import { useEffect, useRef, useState } from 'react'
import { motion } from 'motion/react'
import { Link } from '@tanstack/react-router'
import { usePageLoad } from './PageLoadContext'
import { useMainContent } from './MainContentContext'
import { useOfferDeadline } from './useOfferDeadline'
import Countdown from '@/components/ui/Countdown'

// Fallback values — must mirror what the CMS currently serves, so a failed
// fetch degrades to the same offer rather than a stale one.
const FALLBACK_MAIN_TEXT = 'Regular Ticket • Ends Sept'
const FALLBACK_FOLLOW_UP = '72 seats left at $295'

const TYPING_SPEED = 30

// Display the conference date as "Month D" when it falls in the current year,
// or "Month D, YYYY" when it falls in a later year.
function formatConferenceDate(iso: string) {
    const date = new Date(`${iso}T00:00:00Z`)
    const month = date.toLocaleDateString('en-US', { month: 'long', timeZone: 'UTC' })
    const day = date.getUTCDate()
    const year = date.getUTCFullYear()
    const base = `${month} ${day}`
    return year === new Date().getUTCFullYear() ? base : `${base}, ${year}`
}

interface BannerProps {
    onHeightChange: (h: number) => void
    onTypingDone: () => void
}

const Banner = ({ onHeightChange, onTypingDone }: BannerProps) => {
    const { isLoaded } = usePageLoad()
    const cms = useMainContent()
    const [typedMain, setTypedMain] = useState('')
    const [phase, setPhase] = useState<'main' | 'cta' | 'done'>('main')

    const { isoDate, deadline } = useOfferDeadline()
    const mainTextPrefix = cms?.banner?.main_text || FALLBACK_MAIN_TEXT
    const followUpText = cms?.banner?.follow_up_text || FALLBACK_FOLLOW_UP

    const MAIN_TEXT = `${mainTextPrefix} ${formatConferenceDate(isoDate)} • ${followUpText}`

    const bannerRef = useRef<HTMLDivElement>(null)
    const onHeightChangeRef = useRef(onHeightChange)
    const onTypingDoneRef = useRef(onTypingDone)
    onHeightChangeRef.current = onHeightChange
    onTypingDoneRef.current = onTypingDone


    useEffect(() => {
        if (!bannerRef.current) return
        const el = bannerRef.current
        const measure = () => onHeightChangeRef.current(el.offsetHeight)
        measure()
        const ro = new ResizeObserver(measure)
        ro.observe(el)
        return () => ro.disconnect()
    }, [])

    // Re-type from scratch whenever the resolved text changes (e.g. CMS data
    // arrives after the initial fallback render).
    useEffect(() => {
        setTypedMain('')
        setPhase('main')
    }, [MAIN_TEXT])

    useEffect(() => {
        if (!isLoaded || phase !== 'main') return
        let i = 0
        const id = setInterval(() => {
            i++
            setTypedMain(MAIN_TEXT.slice(0, i))
            if (i >= MAIN_TEXT.length) {
                clearInterval(id)
                setTimeout(() => setPhase('cta'), 160)
            }
        }, TYPING_SPEED)
        return () => clearInterval(id)
    }, [isLoaded, phase, MAIN_TEXT])

    return (
        <motion.div
            ref={bannerRef}
            className="fixed top-0 left-0 right-0 z-50 flex flex-row items-center justify-center w-full bg-linear-to-r from-[#4C203F] to-[#1F2566] px-4 py-2.5 md:px-6 md:py-4"
            initial={{ y: '-100%' }}
            animate={isLoaded ? { y: 0 } : { y: '-100%' }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
        >
            {/* Mobile: offer text across the top, compact countdown + CTA side by side below.
                Desktop: text on the left, countdown + CTA on the right. */}
            <div className="grid grid-cols-[1fr_auto] items-center gap-x-3 gap-y-2 w-full max-w-6xl md:flex md:flex-row md:gap-6">
                {/* The full text is laid out invisibly underneath so the banner takes its
                    final height up front instead of growing while the text types out. */}
                <p className="col-span-2 grid text-xs md:text-sm font-medium text-content-heading md:flex-1">
                    <span aria-hidden className="invisible col-start-1 row-start-1">{MAIN_TEXT}</span>
                    <span className="col-start-1 row-start-1">
                        {typedMain}
                        {phase === 'main' && <span className="cursor-blink">|</span>}
                    </span>
                </p>
                <Countdown targetDate={deadline} compact />
                <Link
                    to="/checkout"
                    className="flex items-center justify-center min-h-10 md:min-h-11 px-4 md:px-6 rounded-full bg-white text-[#4C203F] text-p-md-semibold whitespace-nowrap hover:bg-pink-50 transition-colors"
                >
                    Get Your Pass →
                </Link>
            </div>
        </motion.div>
    )
}

export default Banner
