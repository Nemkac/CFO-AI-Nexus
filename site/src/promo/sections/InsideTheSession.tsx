import { motion } from 'motion/react'
import type { PromoData } from '@/lib/wordpress'

const FALLBACK_CARDS = [
    {
        icon: '/assets/big_icons/Frame.svg',
        title: 'AI Tools That Actually Work',
        description: 'A curated breakdown of the tools finance teams are deploying today — from FP&A automation to close acceleration and real-time reporting.',
    },
    {
        icon: '/assets/big_icons/Frame-1.svg',
        title: 'Building a Secure AI Foundation',
        description: 'Learn how leading CFOs are approaching data governance, privacy frameworks, and vendor evaluation before committing to any AI stack.',
    },
    {
        icon: '/assets/big_icons/Frame-2.svg',
        title: 'Measuring ROI on AI Initiatives',
        description: 'Move beyond pilots. Discover the metrics, milestones, and business cases that get AI projects funded and scaled across the organisation.',
    },
    {
        icon: '/assets/big_icons/Frame-3.svg',
        title: 'From Strategy to Implementation',
        description: 'Real playbooks from finance leaders who have already shipped AI — what worked, what failed, and what to do on Monday morning.',
    },
]

const InsideTheSession = ({ cmsData }: { cmsData?: PromoData['inside'] }) => {
    const title = cmsData?.title ?? 'Inside The Session'
    const cards = cmsData?.cards?.length ? cmsData.cards : FALLBACK_CARDS

    return (
        <section className="flex flex-col items-center bg-[#040820] py-20 px-6 gap-10">
            <div className="flex flex-col items-center gap-3 w-full max-w-6xl text-center">
                <motion.h2
                    className="text-h2 text-content-heading font-bold"
                    initial={{ opacity: 0, y: 16 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5 }}
                >
                    {title}
                </motion.h2>
            </div>

            <div className="flex flex-col gap-6 w-full max-w-6xl">
                {cards.map((card, i) => (
                    <motion.div
                        key={i}
                        className="w-full rounded-2xl overflow-hidden border border-white/10 flex flex-col sm:flex-row"
                        initial={{ opacity: 0, y: 24 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: i * 0.1 }}
                    >
                        {/* Icon — 1/4 width */}
                        <div className="sm:w-1/4 w-full flex items-center justify-center p-8 shrink-0 bg-linear-to-t from-sapphire-800 to-sapphire-1000">
                            <img src={card.icon} alt="" className="w-12 h-12 sm:w-20 sm:h-20 md:w-28 md:h-28 object-contain" />
                        </div>

                        {/* Content — 3/4 width */}
                        <div className="flex-1 flex flex-col justify-center gap-3 p-8 bg-linear-to-r from-sapphire-1000 to-sapphire-800">
                            <h3 className="text-h4 text-content-heading font-bold">{card.title}</h3>
                            <p className="text-p-md text-content-heading text-balance">{card.description}</p>
                        </div>
                    </motion.div>
                ))}
            </div>
        </section>
    )
}

export default InsideTheSession