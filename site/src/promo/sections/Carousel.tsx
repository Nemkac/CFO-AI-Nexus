import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'motion/react'

const SLIDE_COUNT = 7
const SLIDES = Array.from({ length: 7 }, (_, i) => `/assets/images_for_slider/image0${i + 1}.png`)
const AUTOPLAY_MS = 3500

const Carousel = () => {
    const [current, setCurrent] = useState(0)
    const [direction, setDirection] = useState(1)

    const go = (next: number, dir: number) => {
        setDirection(dir)
        setCurrent((next + SLIDE_COUNT) % SLIDE_COUNT)
    }

    const prev = () => go(current - 1, -1)
    const next = () => go(current + 1, 1)

    useEffect(() => {
        const id = setInterval(() => go(current + 1, 1), AUTOPLAY_MS)
        return () => clearInterval(id)
    }, [current])

    return (
        <section className="relative min-h-screen flex flex-col items-center justify-center bg-linear-to-b from-sapphire-600 to-sapphire-800 py-20 px-6 overflow-hidden">

            {/* Watermark logo */}
            <img
                src="/assets/behind_logo.svg"
                alt=""
                aria-hidden
                className="absolute inset-0 w-full h-full object-cover brightness-0 invert opacity-15 pointer-events-none select-none"
            />

            <div className="relative z-10 w-full max-w-6xl flex flex-col gap-8">

                {/* Header row */}
                <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6">
                    {/* Left: title + subtitle */}
                    <div className="flex flex-col gap-2">
                        <motion.h2
                            className="text-h2 text-content-heading font-bold"
                            initial={{ opacity: 0, y: 16 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5 }}
                        >
                            Stop drowning. Start building.
                        </motion.h2>
                        <motion.p
                            className="text-p-md text-content-body"
                            initial={{ opacity: 0, y: 16 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: 0.1 }}
                        >
                            Bridge the gap from manual workflows to a <br /> fully automated AI-Native engine.
                        </motion.p>
                    </div>

                    {/* Right: dots + nav buttons */}
                    <div className="flex flex-row items-center gap-4">
                        {/* Dot indicators */}
                        <div className="flex flex-row gap-2 items-center">
                            {Array.from({ length: SLIDE_COUNT }).map((_, i) => (
                                <button
                                    key={i}
                                    onClick={() => go(i, i > current ? 1 : -1)}
                                    className={`rounded-full transition-all duration-300 ${i === current ? 'w-6 h-3 bg-[#A3E7FC]' : 'w-3 h-3 bg-white/30 hover:bg-white/50'}`}
                                />
                            ))}
                        </div>

                        {/* Prev / Next buttons */}
                        <div className="flex flex-row gap-2">
                            <button
                                onClick={prev}
                                className="h-10 w-10 rounded-full bg-[#A3E7FC] text-content-on-action flex items-center justify-center font-bold hover:brightness-95 transition-all"
                            >
                                ←
                            </button>
                            <button
                                onClick={next}
                                className="h-10 w-10 rounded-full bg-[#A3E7FC] text-content-on-action flex items-center justify-center font-bold hover:brightness-95 transition-all"
                            >
                                →
                            </button>
                        </div>
                    </div>
                </div>

                {/* Carousel slide */}
                <div className="relative w-full overflow-hidden rounded-2xl aspect-video">
                    <AnimatePresence mode="wait" custom={direction}>
                        <motion.div
                            key={current}
                            custom={direction}
                            variants={{
                                enter: (d: number) => ({ x: d > 0 ? '100%' : '-100%', opacity: 0 }),
                                center: { x: 0, opacity: 1 },
                                exit: (d: number) => ({ x: d > 0 ? '-100%' : '100%', opacity: 0 }),
                            }}
                            initial="enter"
                            animate="center"
                            exit="exit"
                            transition={{ duration: 0.4, ease: 'easeInOut' }}
                            className="absolute inset-0 rounded-2xl overflow-hidden"
                        >
                            <img src={SLIDES[current]} alt="" className="w-full h-full object-contain" />
                        </motion.div>
                    </AnimatePresence>
                </div>

            </div>
        </section>
    )
}

export default Carousel