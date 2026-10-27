import { useEffect, useRef, useState } from 'react'
import { motion } from 'motion/react'
import FeatureCard from '@/components/ui/FeatureCard'

const features = [
    {
        title: "Smart Matchmaking & Engagement",
        description: 'Our matchmaking surfaces relevant attendees based on the profiles and interests they choose to share, and lets interested attendees book meetings with you through the platform.',
        image: "./assets/opportunities/IntentBasedMatchmakingAndEngagement.webp"
    },
    {
        title: "Virtual Booth",
        description: `Run live or pre-recorded product demos with intent-based qualified buyers, host 1:1 video meetings, share on-demand content and Q&A, and see engagement from attendees who connect with you.`,
        image: "./assets/opportunities/VirtualBooth.webp"
    },
    {
        title: "Conference Speaking Slot",
        description: 'Host a dedicated 30-minute Strategic Session led by your experts. Bridge the gap between complex industry challenges and your product’s unique value proposition. Choose live or pre-recorded sessions.',
        image: "./assets/opportunities/ConferenceSpeakingSlot.webp",
    },
    {
        title: `Relevant 1:1 Connections`,
        description: `Our matchmaking helps relevant attendees discover you and request meetings based on the interests they choose to share.`,
        image: "./assets/opportunities/Curated1-1WithPre-qualifiedLeads.webp",
    },
    {
        title: "Digital Presence and Branding",
        description: "Your brand will be featured on our official website page, LinkedIn posts, displayed in all event agendas and presentations, with direct backlink to your landing pages.",
        image: "./assets/opportunities/DigitalPresenceAndBranding.webp"
    },
    {
        title: "Qualified Leads & Analytics",
        description: 'Access and export your opted-in leads, plus meeting and engagement insights from attendees who actively connect with your booth.',
        image: "./assets/opportunities/MQLData&Analytics.webp"
    },
]

const FeaturesSection = () => {
    const [cardHeight, setCardHeight] = useState<number>(0)
    const containerRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        if (!containerRef.current) return
        const cards = Array.from(containerRef.current.querySelectorAll<HTMLElement>(':scope > div'))
        const max = Math.max(...cards.map(c => c.offsetHeight))
        if (max > 0) setCardHeight(max)
    }, [])

    return (
        <div className="bg-surface-page py-10 md:py-20 px-4 flex items-center w-full justify-center">
            <div className='flex flex-col items-center justify-center max-w-5xl w-full p-4 gap-14'>
                <motion.h2
                    className='text-h2 text-content-heading'
                    initial={{ opacity: 0, y: 32 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-80px" }}
                    transition={{ duration: 0.6, ease: "easeOut" }}
                >
                    Essential Partner Features
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
                                <FeatureCard buttonVariant='white' buttonLabel='Secure Your Spot' title={feature.title} description={feature.description} flip={flip} minHeight={cardHeight || undefined} image={feature.image} />
                            </motion.div>
                        )
                    })}
                </div>
            </div>
        </div>
    )
}

export default FeaturesSection