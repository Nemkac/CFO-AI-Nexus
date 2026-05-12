import { useEffect, useRef, useState } from 'react'
import { motion } from 'motion/react'
import Badge from '@/components/ui/badge'
import Button from '@/components/ui/Button'
import { useRegistration } from '@/promo/context/RegistrationContext'
import type { PromoData } from '@/lib/wordpress'

const DOT_COUNT = 60
const FALLBACK_DATETIME = '2026-05-19T16:00'

type Dot = { x: number; y: number; r: number; dx: number; dy: number }
type TimeLeft = { days: number; hours: number; minutes: number; seconds: number }

function parseConferenceDatetime(iso: string) {
    const normalized = iso.includes('Z') ? iso : iso + ':00Z'
    const date = new Date(normalized)

    const displayDate = date.toLocaleDateString('en-US', {
        weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', timeZone: 'UTC',
    })

    const fmt = (h: number, m: number, zone: string) => {
        const ampm = h >= 12 ? 'PM' : 'AM'
        const h12 = h % 12 === 0 ? 12 : h % 12
        return `${h12}:${String(m).padStart(2, '0')} ${ampm} ${zone}`
    }

    const utcH = date.getUTCHours()
    const utcM = date.getUTCMinutes()
    const displayTime = `${fmt(utcH - 5, utcM, 'EST')} (${fmt(utcH + 1, utcM, 'CET')})`

    return { date, displayDate, displayTime }
}

function makeGetTimeLeft(conferenceDate: Date) {
    return (): TimeLeft => {
        const diff = Math.max(0, conferenceDate.getTime() - Date.now())
        return {
            days: Math.floor(diff / 86400000),
            hours: Math.floor((diff % 86400000) / 3600000),
            minutes: Math.floor((diff % 3600000) / 60000),
            seconds: Math.floor((diff % 60000) / 1000),
        }
    }
}

const CountUnit = ({ value, label }: { value: number; label: string }) => (
    <div className="flex flex-col items-center min-w-9">
        <span className="text-h3 text-content-heading font-bold leading-none tabular-nums">
            {String(value).padStart(2, '0')}
        </span>
        <span className="text-p-xsm text-white/50 uppercase tracking-widest">{label}</span>
    </div>
)

const Hero = ({ cmsData }: { cmsData?: PromoData['hero'] }) => {
    const { openModal } = useRegistration()
    const conferenceDatetime = cmsData?.conference_datetime ?? FALLBACK_DATETIME
    const { date: conferenceDate, displayDate, displayTime } = parseConferenceDatetime(conferenceDatetime)
    const getTimeLeft = makeGetTimeLeft(conferenceDate)

    const canvasRef = useRef<HTMLCanvasElement>(null)
    const mouse = useRef({ x: -999, y: -999 })
    const dots = useRef<Dot[]>([])
    const rafRef = useRef<number>(0)
    const [timeLeft, setTimeLeft] = useState<TimeLeft>(getTimeLeft)

    useEffect(() => {
        const id = setInterval(() => setTimeLeft(getTimeLeft()), 1000)
        return () => clearInterval(id)
    }, [conferenceDatetime])

    useEffect(() => {
        const canvas = canvasRef.current
        if (!canvas) return
        const ctx = canvas.getContext('2d')
        if (!ctx) return

        const resize = () => {
            canvas.width = canvas.offsetWidth
            canvas.height = canvas.offsetHeight
            dots.current = Array.from({ length: DOT_COUNT }, () => ({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
                r: Math.random() * 2 + 1,
                dx: (Math.random() - 0.5) * 0.3,
                dy: (Math.random() - 0.5) * 0.3,
            }))
        }

        resize()
        window.addEventListener('resize', resize)

        const onMouseMove = (e: MouseEvent) => {
            const rect = canvas.getBoundingClientRect()
            mouse.current = { x: e.clientX - rect.left, y: e.clientY - rect.top }
        }
        canvas.addEventListener('mousemove', onMouseMove)
        canvas.addEventListener('mouseleave', () => { mouse.current = { x: -999, y: -999 } })

        const draw = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height)
            for (const dot of dots.current) {
                const mx = mouse.current.x - dot.x
                const my = mouse.current.y - dot.y
                const dist = Math.sqrt(mx * mx + my * my)
                if (dist < 80) {
                    dot.x -= (mx / dist) * 0.6
                    dot.y -= (my / dist) * 0.6
                }
                dot.x += dot.dx
                dot.y += dot.dy
                if (dot.x < 0 || dot.x > canvas.width) dot.dx *= -1
                if (dot.y < 0 || dot.y > canvas.height) dot.dy *= -1
                const alphaFade = 1 - Math.pow(dot.y / canvas.height, 2)
                ctx.beginPath()
                ctx.arc(dot.x, dot.y, dot.r, 0, Math.PI * 2)
                ctx.fillStyle = `rgba(180, 140, 255, ${alphaFade * 0.5})`
                ctx.fill()
            }
            rafRef.current = requestAnimationFrame(draw)
        }

        draw()

        return () => {
            cancelAnimationFrame(rafRef.current)
            window.removeEventListener('resize', resize)
        }
    }, [])

    return (
        <section className="relative min-h-screen flex flex-col bg-[#040820] overflow-hidden">
            <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />
            <div className="absolute bottom-0 left-0 right-0 h-40 bg-linear-to-t from-[#040820] to-transparent pointer-events-none z-10" />

            {/* Header bar */}
            <div className="relative z-20 w-full px-6 py-4">
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between max-w-6xl mx-auto w-full">
                    {/* Logo */}
                    <img src="/assets/logo.svg" alt="CFO AI Nexus" className="h-8 w-auto" />

                    {/* Date + time */}
                    <div className="flex flex-col items-start gap-2 py-4">
                        <div className='flex flex-row items-center gap-2'>
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                                <path opacity="0.3" d="M5 8H19V6H5V8Z" fill="#FC69D2" />
                                <path d="M7 11H9V13H7V11ZM19 4H18V2H16V4H8V2H6V4H5C3.89 4 3.01 4.9 3.01 6L3 20C3 20.5304 3.21071 21.0391 3.58579 21.4142C3.96086 21.7893 4.46957 22 5 22H19C20.1 22 21 21.1 21 20V6C21 4.9 20.1 4 19 4ZM19 20H5V10H19V20ZM19 8H5V6H19V8ZM15 11H17V13H15V11ZM11 11H13V13H11V11Z" fill="#FC69D2" />
                            </svg>
                            <span className="text-p-md-semibold text-content-heading font-medium">{displayDate}</span>
                        </div>
                        <div className='flex flex-row items-center gap-2'>
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                                <path d="M8.5 12H12V7M3 12C3 13.1819 3.23279 14.3522 3.68508 15.4442C4.13738 16.5361 4.80031 17.5282 5.63604 18.364C6.47177 19.1997 7.46392 19.8626 8.55585 20.3149C9.64778 20.7672 10.8181 21 12 21C13.1819 21 14.3522 20.7672 15.4442 20.3149C16.5361 19.8626 17.5282 19.1997 18.364 18.364C19.1997 17.5282 19.8626 16.5361 20.3149 15.4442C20.7672 14.3522 21 13.1819 21 12C21 10.8181 20.7672 9.64778 20.3149 8.55585C19.8626 7.46392 19.1997 6.47177 18.364 5.63604C17.5282 4.80031 16.5361 4.13738 15.4442 3.68508C14.3522 3.23279 13.1819 3 12 3C10.8181 3 9.64778 3.23279 8.55585 3.68508C7.46392 4.13738 6.47177 4.80031 5.63604 5.63604C4.80031 6.47177 4.13738 7.46392 3.68508 8.55585C3.23279 9.64778 3 10.8181 3 12Z" stroke="#FC69D2" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                            </svg>
                            <span className="text-p-md-semibold text-content-heading">{displayTime}</span>
                        </div>
                    </div>

                    {/* Countdown */}
                    <div className="flex flex-row items-center gap-3">
                        <CountUnit value={timeLeft.days} label="days" />
                        <span className="text-white/30 text-xl pb-4">:</span>
                        <CountUnit value={timeLeft.hours} label="hrs" />
                        <span className="text-white/30 text-xl pb-4">:</span>
                        <CountUnit value={timeLeft.minutes} label="min" />
                        <span className="text-white/30 text-xl pb-4">:</span>
                        <CountUnit value={timeLeft.seconds} label="sec" />
                    </div>
                </div>
            </div>

            {/* Main hero content */}
            <motion.div
                className="relative z-20 flex-1 flex flex-col justify-start px-6 md:px-0 gap-8 pt-10 pb-20 max-w-6xl mx-auto w-full"
                initial={{ opacity: 0, y: 32 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, ease: 'easeOut', delay: 0.4 }}
            >
                {/* Part 1 — two columns */}
                <div className="flex flex-col lg:flex-row items-center justify-between gap-12 w-full">
                    {/* Left */}
                    <div className="flex flex-col items-start gap-6 max-w-lg">
                        <Badge label={cmsData?.badge ?? 'Live Virtual Conference'} live />
                        <div className="flex flex-col gap-2">
                            <h1 className="text-h1 text-content-heading font-bold leading-tight text-balance">
                                {cmsData?.jumbo ?? 'Building AI-Native Finance: Tools, Use Cases and Risks'}
                            </h1>
                            <h2 className="text-h4 text-content-heading">
                                {cmsData?.subtitle ?? 'Evaluate ROI. Deliver Results.'}
                            </h2>
                            <p className="text-p-md text-content-body text-balance whitespace-pre-line">
                                {cmsData?.description ?? 'Master a proven system for implementing AI tools and securing your data.'}
                            </p>
                        </div>
                    </div>

                    {/* Right */}
                    <div className="flex flex-col items-center gap-4 shrink-0">
                        <img
                            src={cmsData?.image || '/assets/PromoImg.png'}
                            alt="CFO AI Nexus Conference"
                            className="w-full max-w-lg rounded-2xl object-cover"
                        />
                        <p className="text-p-md text-content-body text-center whitespace-pre-line">
                            {cmsData?.image_caption ?? 'Joined by 10,000+ finance leaders.\nSeats are limited.'}
                        </p>
                    </div>
                </div>

                {/* Part 2 — button + star rating */}
                <div className="flex flex-col md:flex-row items-center w-full gap-4 md:gap-8">
                    <Button variant="sky" label={cmsData?.button_text ?? 'Save My Seat - It\'s FREE'} onClick={openModal} />
                    <div className="flex flex-col items-center gap-1">
                        <div className="flex flex-row gap-1">
                            {Array.from({ length: 5 }).map((_, i) => (
                                <svg key={i} className="w-5 h-5 fill-pink-400" viewBox="0 0 20 20">
                                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                </svg>
                            ))}
                        </div>
                        <p className="text-p-sm text-white/50">
                            Rated 4,97 / 5.00
                        </p>
                    </div>
                </div>
            </motion.div>
        </section>
    )
}

export default Hero