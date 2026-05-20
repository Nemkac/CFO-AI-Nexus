import { useEffect, useRef, useState } from 'react'
import { motion } from 'motion/react'
import { useNavigate } from '@tanstack/react-router'
import { usePageLoad } from './PageLoadContext'
import Countdown from '@/components/ui/Countdown'

const CONFERENCE_DATE = new Date('2026-06-16T00:00:00Z')

const MAIN_TEXT = 'Early bird end June 16 • 72 seats left at €195'
const TYPING_SPEED = 30

interface BannerProps {
    onHeightChange: (h: number) => void
    onTypingDone: () => void
}

const Banner = ({ onHeightChange, onTypingDone }: BannerProps) => {
    const { isLoaded } = usePageLoad()
    const navigate = useNavigate()
    const [typedMain, setTypedMain] = useState('')
    const [phase, setPhase] = useState<'main' | 'cta' | 'done'>('main')

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
    }, [isLoaded, phase])

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
                <Countdown targetDate={CONFERENCE_DATE} />
            </div>
        </motion.div>
    )
}

export default Banner
