import { useEffect, useRef, useState } from 'react'
import { motion } from 'motion/react'
import FeatureCard from '@/components/ui/FeatureCard'

const features = [
    {
        title: "Main Stage Keynote",
        description: `Take the main stage as a thought leader. Deliver a high‑impact keynote session to share your vision, showcase your solutions, and set the tone for the conference.Choose between live and pre-recorded sessions. `
    },
    {
        title: `Intent-Based Meeting "Guarantor"`,
        description: 'We schedule your team meetings or even exclusive breakout rooms with pre-qualified leads and bring them into a breakout environment for you. Functioning as a high-end webinar and group discussion space, we organize a room where we invite profiles matching your specific criteria. '
    },
    {
        title: `Viral digital presence and premium featuring`,
        description: `Guaranteed 100,000 brand impressions on LinkedIn through leading B2B creator profiles and pages. Your brand will be prominently featured at the top of the event website and in social media posts, as well as in premium positions in the official PDF agenda and all event presentations.`
    },
    {
        title: "Premium Visibility",
        description: `"Top of the List" priority positioning for your booth to the qualified buyers, headline website banner featured, official linkedin page banner featured. `
    },
    {
        title: "Pre-roll videos",
        description: '20-second sponsor video spots played between conference sessions and workshops, giving your brand visibility right before the next content starts.'
    },
    {
        title: "Powered by",
        description: 'Main sponsor of the entire event with brand logo featured on all available places for promotion and sponsorship, Mobile app official sponsor and branding, scheduled notifications, exclusive In-app announcements, checkout page sponsor.'
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
                                <FeatureCard buttonVariant='primary' buttonLabel='Connect With Us' title={feature.title} description={feature.description} flip={flip} minHeight={cardHeight || undefined} />
                            </motion.div>
                        )
                    })}
                </div>
            </div>
        </div>
    )
}

export default PremiumFeaturesSection