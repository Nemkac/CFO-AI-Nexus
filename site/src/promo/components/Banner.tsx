import { useEffect, useRef, useState } from 'react'
import { motion } from 'motion/react'

const FALLBACK_DATETIME = '2026-05-19T16:00'
const TYPING_SPEED = 30

function formatBannerDatetime(iso: string) {
    const normalized = iso.includes('Z') ? iso : iso + ':00Z'
    const date = new Date(normalized)
    const shortDate = date.toLocaleDateString('en-US', {
        weekday: 'long', month: 'long', day: 'numeric', timeZone: 'UTC',
    })
    const utcH = date.getUTCHours()
    const utcM = date.getUTCMinutes()
    const fmt = (h: number, m: number, zone: string) => {
        const ampm = h >= 12 ? 'PM' : 'AM'
        const h12 = h % 12 === 0 ? 12 : h % 12
        return `${h12}:${String(m).padStart(2, '0')} ${ampm} ${zone}`
    }
    return `${shortDate}, ${fmt(utcH - 5, utcM, 'EST')} (${fmt(utcH + 1, utcM, 'CET')})`
}

const Banner = ({ text, conferenceDatetime }: { text?: string; conferenceDatetime?: string }) => {
    const datetime = formatBannerDatetime(conferenceDatetime ?? FALLBACK_DATETIME)
    const mainText = text ? `${text} ${datetime}` : `See you! ${datetime}`
    const [typedMain, setTypedMain] = useState('')
    const [showCursor, setShowCursor] = useState(true)
    const bannerRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        setTypedMain('')
        setShowCursor(true)
        let i = 0
        const id = setInterval(() => {
            i++
            setTypedMain(mainText.slice(0, i))
            if (i >= mainText.length) {
                clearInterval(id)
                setTimeout(() => setShowCursor(false), 800)
            }
        }, TYPING_SPEED)
        return () => clearInterval(id)
    }, [mainText])

    return (
        <motion.div
            ref={bannerRef}
            className="sticky top-0 z-50 flex gap-4 w-full bg-linear-to-r from-[#4C203F] to-[#1F2566] px-6 py-4"
            initial={{ y: '-100%' }}
            animate={{ y: 0 }}
            transition={{ duration: 0.3, ease: 'easeOut', delay: 0.2 }}
        >
            <div className='flex flex-col md:flex-row items-start md:items-center justify-start md:justify-between gap-2 md:gap-4 max-w-6xl w-full mx-auto'>
                <div className='flex flex-row items-center gap-3'>
                    <div className='hidden md:flex flex-row items-center'>
                        {[2, 3, 4, 5, 6].map((n, i) => (
                            <img
                                key={n}
                                src={`/assets/avatars/Ellipse ${n}.svg`}
                                alt=""
                                className='w-8 h-8 rounded-full border-2 border-[#1F2566] object-cover'
                                style={{ marginLeft: i === 0 ? 0 : '-10px', zIndex: i }}
                            />
                        ))}
                    </div>
                    <p className='text-p-sm md:text-p-md-semibold text-content-heading min-h-6 text-balance'>Joined by 10,000+ finance leaders</p>
                </div>
                <p className="text-p-sm md:text-p-md-semibold text-content-heading min-h-6 text-left md:text-center text-balance">
                    {typedMain}
                    {showCursor && <span className="cursor-blink">|</span>}
                </p>
            </div>
        </motion.div>
    )
}

export default Banner