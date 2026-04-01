import { useEffect, useRef, useState } from 'react'
import { motion } from 'motion/react'
import FeatureCard from '@/components/ui/FeatureCard'

const features = [
    {
        title: "Main Stage Keynote",
        description: `Take the main stage as a thought leader. Deliver a high‑impact keynote session to share your vision, showcase your solutions, and set the tone for the conference.Choose between live and pre-recorded sessions. `,
        image: "./assets/opportunities/MainStageKeynote.webp"
    },
    {
        title: `Targeted Breakout Room`,
        description: 'Access our bespoke roundtable feature: An invite-only digital room designed for high-level engagement with a group of finance executives tailored to your criteria.',
        image: "./assets/opportunities/BreakoutRoom.webp"
    },
    {
        title: `Viral Digital Presence`,
        description: `Guaranteed 100,000 brand impressions on LinkedIn through leading B2B creator profiles and pages. Premium featuring on the website, social media content, official PDF agenda and all event presentations.`,
        image: "./assets/opportunities/ViralDigitalPresence.webp"
    },
    {
        title: "Premium Visibility",
        description: `"Top of the List" priority positioning for your booth to the qualified buyers, headline website banner featured, official linkedin page banner featured.`,
        image: "./assets/opportunities/PremiumVisibility.webp"
    },
    {
        title: "Pre-roll videos",
        description: '20-second sponsor video spots played between conference sessions and workshops, giving your brand visibility right before the next content starts.',
        image: "./assets/opportunities/Pre-RollVideos.webp"
    },
    {
        title: "Powered by",
        description: 'Main sponsor of the entire event with brand logo featured on all available places for promotion and sponsorship, mobile app official sponsor and branding, exclusive In-app announcements, checkout page sponsor and more.',
        image: "./assets/opportunities/PoweredBy.webp"
    },
]

const PremiumFeaturesSection = () => {
    const [cardHeight, setCardHeight] = useState<number>(0)
    const containerRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        if (!containerRef.current) return
        const cards = Array.from(containerRef.current.querySelectorAll<HTMLElement>(':scope > div'))
        const max = Math.max(...cards.map(c => c.offsetHeight))
        if (max > 0) setCardHeight(max)
    }, [])

    return (
        <div className="bg-linear-to-r from-pink-900 via-surface-page to-surface-secondary/30 py-10 md:py-20 px-4 flex items-center w-full justify-center">
            <div className='flex flex-col items-center justify-center max-w-5xl w-full p-4 gap-14'>
                <motion.h2
                    className='text-h2 text-content-heading'
                    initial={{ opacity: 0, y: 32 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-80px" }}
                    transition={{ duration: 0.6, ease: "easeOut" }}
                >
                    Premium Partner Features
                </motion.h2>
                <div ref={containerRef} className="flex flex-col items-stretch gap-6 w-full">
                    {features.map((feature, idx) => {
                        const flip = idx % 2 === 0
                        return (
                            <motion.div
                                key={idx}
                                initial={{ opacity: 0, x: flip ? -60 : 60 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true, margin: "-80px" }}
                                transition={{ duration: 0.6, ease: "easeOut" }}
                            >
                                <FeatureCard buttonVariant='primary' buttonLabel='Connect With Us' title={feature.title} description={feature.description} flip={flip} minHeight={cardHeight || undefined} image={feature.image} />
                            </motion.div>
                        )
                    })}
                </div>
            </div>
        </div>
    )
}

export default PremiumFeaturesSection