import { useEffect } from 'react'
import { motion } from "motion/react"
import Badge from "@/components/ui/badge"
import Button from "@/components/ui/Button"
import { usePageLoad } from '@/components/layout/PageLoadContext'
import { Link } from '@tanstack/react-router'

const fadeUp = {
    hidden: { opacity: 0, y: 24 },
    visible: { opacity: 1, y: 0 },
}

const SPONSORS = [
    { src: '/assets/partners/blackline 1.svg', alt: 'BlackLine' },
    { src: '/assets/partners/anaplan 1.svg', alt: 'Anaplan' },
    { src: '/assets/partners/workday 1.svg', alt: 'Workday' },
    { src: '/assets/partners/tipalti 1.svg', alt: 'Tipalti' },
    { src: '/assets/partners/kyriba 1.svg', alt: 'Kyriba' },
]

const HeroSection = () => {
    const { isLoaded, signalReady } = usePageLoad()

    useEffect(() => {
        signalReady()
    }, [])

    return (
        <div className='flex flex-col w-full items-center justify-center bg-surface-page gap-10 md:gap-20 px-6 py-12' style={{ minHeight: 'calc(100vh - var(--layout-offset, 152px))' }}>

            {/* Two-column layout */}
            <div className='grid grid-cols-1 lg:grid-cols-2 items-center gap-10 w-full max-w-6xl'>

                {/* Left — text content */}
                <div className='flex flex-col items-center justify-center md:justify-start lg:items-start gap-6 text-center lg:text-start min-w-0'>
                    <motion.div
                        className='justify-center md:justify-start flex w-full'
                        variants={fadeUp}
                        initial="hidden"
                        animate={isLoaded ? "visible" : "hidden"}
                        transition={{ duration: 0.2, ease: "easeOut" }}
                    >
                        <Badge label="October 20–21, 2026 | 100% Virtual | 10AM - 4PM EST" delay={500} live />
                    </motion.div>

                    <motion.div
                        className="flex flex-col gap-2 text-center md:text-left"
                        variants={fadeUp}
                        initial="hidden"
                        animate={isLoaded ? "visible" : "hidden"}
                        transition={{ duration: 0.5, ease: "easeOut", delay: 0.15 }}
                    >
                        <h2 className="text-h1 text-content-heading text-balance">Deploy AI in Finance Function</h2>
                        <h4 className="text-h4 text-content-heading text-balance">Auditable, Compliant, Controlled</h4>
                        <p className="text-p-md text-content-body text-balance">Two days of world-class sessions, live product demos, and AI-driven networking — built to help CFOs and finance teams cut through the noise and find the tools reshaping modern finance.</p>
                    </motion.div>

                    <motion.div
                        className="flex flex-col items-center lg:items-start gap-4"
                        variants={fadeUp}
                        initial="hidden"
                        animate={isLoaded ? "visible" : "hidden"}
                        transition={{ duration: 0.5, ease: "easeOut", delay: 0.3 }}
                    >
                        <Link to={'/checkout'}>
                            <Button label="Get Your Pass" className="px-20" />
                        </Link>
                        <p className="text-p-xsm text-content-heading">10.000+ finance leaders already trained</p>
                    </motion.div>
                </div>

                {/* Right — image */}
                <motion.div
                    className='flex items-center justify-center min-w-0'
                    variants={fadeUp}
                    initial="hidden"
                    animate={isLoaded ? "visible" : "hidden"}
                    transition={{ duration: 0.6, ease: "easeOut", delay: 0.2 }}
                >
                    <img
                        src='/assets/Nexus Ai govornici.png'
                        alt='CFO AI Nexus Speakers'
                        className='w-full max-h-120 rounded-2xl object-contain'
                    />
                </motion.div>
            </div>

            {/* Sponsors strip */}
            <motion.div
                className='flex flex-col items-center gap-4 w-full max-w-6xl'
                variants={fadeUp}
                initial="hidden"
                animate={isLoaded ? "visible" : "hidden"}
                transition={{ duration: 0.5, ease: "easeOut", delay: 0.45 }}
            >
                <div className='flex flex-row flex-wrap w-full items-center md:justify-between gap-8'>
                    {SPONSORS.map(({ src, alt }) => (
                        <img key={alt} src={src} alt={alt} className='h-7 object-contain opacity-40 hover:opacity-100 transition-opacity duration-200' />
                    ))}
                </div>
            </motion.div>
        </div>
    )
}

export default HeroSection