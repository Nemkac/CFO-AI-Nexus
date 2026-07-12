import { useEffect } from 'react'
import { motion } from "motion/react"
import Badge from "@/components/ui/badge"
import Button from "@/components/ui/Button"
import { usePageLoad } from '@/components/layout/PageLoadContext'
import { useMainContent } from '@/components/layout/MainContentContext'
import { Link } from '@tanstack/react-router'

const fadeUp = {
    hidden: { opacity: 0, y: 24 },
    visible: { opacity: 1, y: 0 },
}

// Fallback values — must mirror the current (pre-CMS) hero content.
const FALLBACK_BADGE = 'October 20–21, 2026 | 100% Virtual | 10AM - 4PM EST'
const FALLBACK_TITLE = 'Deploy AI in Finance Function'
const FALLBACK_SUBTITLE = 'Auditable, Compliant, Controlled'
const FALLBACK_DESCRIPTION = 'Two days of world-class sessions, live product demos, and AI-driven networking — built to help CFOs and finance teams cut through the noise and find the tools reshaping modern finance.'
const FALLBACK_IMAGE = '/assets/Nexus Ai govornici.png'

const FALLBACK_SPONSORS = [
    '/assets/partners/blackline 1.svg',
    '/assets/partners/anaplan 1.svg',
    '/assets/partners/workday 1.svg',
    '/assets/partners/tipalti 1.svg',
    '/assets/partners/kyriba 1.svg',
]

const HeroSection = () => {
    const { isLoaded, signalReady } = usePageLoad()
    const cms = useMainContent()

    const badge = cms?.hero?.badge || FALLBACK_BADGE
    const title = cms?.hero?.title || FALLBACK_TITLE
    const subtitle = cms?.hero?.subtitle || FALLBACK_SUBTITLE
    const description = cms?.hero?.description || FALLBACK_DESCRIPTION
    const image = cms?.hero?.image || FALLBACK_IMAGE
    const sponsors = cms?.hero?.sponsors?.length ? cms.hero.sponsors.slice(0, 7) : FALLBACK_SPONSORS

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
                        <Badge label={badge} delay={500} live />
                    </motion.div>

                    <motion.div
                        className="flex flex-col gap-2 text-center md:text-left"
                        variants={fadeUp}
                        initial="hidden"
                        animate={isLoaded ? "visible" : "hidden"}
                        transition={{ duration: 0.5, ease: "easeOut", delay: 0.15 }}
                    >
                        <h2 className="text-h1 text-content-heading text-balance">{title}</h2>
                        <h4 className="text-h4 text-content-heading text-balance">{subtitle}</h4>
                        <p className="text-p-md text-content-body text-balance">{description}</p>
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
                        src={image}
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
                    {sponsors.map((src, i) => (
                        <img key={`${src}-${i}`} src={src} alt='Sponsor' className='h-7 object-contain opacity-40 hover:opacity-100 transition-opacity duration-200' />
                    ))}
                </div>
            </motion.div>
        </div>
    )
}

export default HeroSection