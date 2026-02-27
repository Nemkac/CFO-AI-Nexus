import { useEffect, useRef, useState } from 'react'
import { motion } from 'motion/react'
import FeatureCard from '@/components/ui/FeatureCard'

const features = [
    {
        title: "Virtual Booth",
        description: `A demand generation engine featuring value proposition and exhibitor profile. Run live or pre-recorded product demos with intent-based qualified buyers, host 1:1 video meetings, and engage via Q&A sessions and chats. Offer downloadable assets, showcase team profile cards, embed custom content, and measure traffic to track every interaction.`
    },
    {
        title: "Host Session or Workshop",
        description: 'Host a dedicated 30 minutes long learning session or hands‑on workshop designed and led by your team, allowing you to demonstrate your expertise, present case studies, and engage directly with CFOs and finance leaders. Choose between live and pre-recorded sessions.'
    },
    {
        title: `Intent-Based Matchmaking and Engagement`,
        description: `Stop wasting time on "blind" networking. Our AI-powered prospecting analyzes attendee intent, interests, and behavior to pinpoint your high-value prospects and streamline lead scanning. Book meetings instantly with a seamless integrated scheduler.`
    },
    {
        title: "Digital presence and branding",
        description: "Your brand will be featured on our official landing page with targeted copy and a direct backlink to your corporate site, plus dedicated exposure across our official LinkedIn and social media channels. Brand logo will be displayed in all event agendas and presentations."
    },
    {
        title: "MQL Data & Analytics",
        description: 'Access and export lead lists, booth visitor metrics, and engagement heatmaps in one click. Arm yourself for the post-event call and measure exact ROI.'
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
                                <FeatureCard buttonVariant='white' buttonLabel='Secure Your Spot' title={feature.title} description={feature.description} flip={flip} minHeight={cardHeight || undefined} />
                            </motion.div>
                        )
                    })}
                </div>
            </div>
        </div>
    )
}

export default FeaturesSection