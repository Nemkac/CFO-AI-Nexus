import { useEffect, useRef, useState } from 'react'
import { motion } from 'motion/react'
import { useNavigate } from '@tanstack/react-router'
import { usePageLoad } from './PageLoadContext'

const MAIN_TEXT = 'Super Early Bird Tickets available for only $125. Act fast, only 55 seats left!'
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
            className="fixed top-0 left-0 hover:border-b hover:border-pink-500 right-0 z-50 flex flex-row items-center justify-center w-full bg-linear-to-r from-[#4C203F] to-[#1F2566] p-4 cursor-pointer"
            initial={{ y: '-100%' }}
            animate={isLoaded ? { y: 0 } : { y: '-100%' }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
        >
            <p className="text-p-md text-content-heading min-h-[1.5em] text-center text-balance">
                {typedMain}
                {phase === 'main' && <span className="cursor-blink">|</span>}
            </p>
        </motion.div>
    )
}

export default Banner
