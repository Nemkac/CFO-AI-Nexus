import { useEffect, useMemo, useRef, useState } from 'react'
import { motion } from 'motion/react'
import { useNavigate } from '@tanstack/react-router'
import { usePageLoad } from './PageLoadContext'
import { useMainContent } from './MainContentContext'
import Countdown from '@/components/ui/Countdown'
import { ceWallTimeToUtc } from '@/lib/conferenceTime'

// Fallback values — must mirror the current (pre-CMS) banner content.
const FALLBACK_DATE = '2026-06-16'
const FALLBACK_MAIN_TEXT = 'Early bird end'
const FALLBACK_FOLLOW_UP = '72 seats left at €195'

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
    const navigate = useNavigate()
    const [typedMain, setTypedMain] = useState('')
    const [phase, setPhase] = useState<'main' | 'cta' | 'done'>('main')

    const isoDate = cms?.banner?.date || FALLBACK_DATE
    const mainTextPrefix = cms?.banner?.main_text || FALLBACK_MAIN_TEXT
    const followUpText = cms?.banner?.follow_up_text || FALLBACK_FOLLOW_UP

    // Count down to the start of the conference day in Central European time
    // (not midnight UTC), so the countdown isn't an hour or two off.
    const conferenceDate = useMemo(() => ceWallTimeToUtc(`${isoDate}T00:00`), [isoDate])
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
            onClick={() => navigate({ to: '/checkout' })}
            className="fixed top-0 left-0 hover:border-b hover:border-pink-500 right-0 z-50 flex flex-row items-center justify-center w-full bg-linear-to-r from-[#4C203F] to-[#1F2566] px-6 py-4 cursor-pointer"
            initial={{ y: '-100%' }}
            animate={isLoaded ? { y: 0 } : { y: '-100%' }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
        >
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between w-full max-w-6xl gap-3 md:gap-0">
                <p className="text-p-md text-content-heading min-h-[1.5em] text-balance">
                    {typedMain}
                    {phase === 'main' && <span className="cursor-blink">|</span>}
                </p>
                <Countdown targetDate={conferenceDate} />
            </div>
        </motion.div>
    )
}

export default Banner
