import { motion } from "motion/react"
import Button from "@/components/ui/Button"
import WhyAttendCard from "@/components/ui/WhyAttendCard"

const reasons = [
    { icon: <img src="/icons/whyAttendIcon-1.svg" />, title: "Leading Voices\nin Finance AI", description: "Learn from the architects of AI implementation within complex global systems." },
    { icon: <img src="/icons/whyAttendIcon-2.svg" />, title: "High-Engagement\nVirtual Booths", description: "Compare the newest AI solutions for ERP, FP&A, and Treasury in one virtual walk-through." },
    { icon: <img src="/icons/whyAttendIcon-3.svg" />, title: "Intent-Based\nMatchmaking", description: "Our AI algorithm analyzes your professional goals to connect you with the exact peers and partners you need to meet." },
    { icon: <img src="/icons/whyAttendIcon-4.svg" />, title: "The 2026 Tech\nStack Review", description: "Don't just watch—interact. Engage in live software deep-dives, private Q&A, and instant 1:1 video consultations." },
]

const containerVariants = {
    hidden: {},
    visible: { transition: { delayChildren: 0.3, staggerChildren: 0.15 } },
}

const itemVariants = {
    hidden: { opacity: 0, y: 32 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" as const } },
}

const WhyAttendSection = () => {
    return (
        <div className='py-10 md:py-20 flex flex-col gap-6 md:gap-10 items-center w-full justify-center bg-surface-page '>
            <motion.h2
                className="text-h2 text-content-heading"
                initial={{ opacity: 0, y: 32 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 0.6, ease: "easeOut" }}
            >
                Why Attend CFO AI Nexus?
            </motion.h2>
            <motion.div
                className='flex flex-row flex-wrap items-start justify-center max-w-6xl w-full p-4 gap-16'
                variants={containerVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-80px" }}
            >
                {reasons.map(reason => (
                    <motion.div key={reason.title} variants={itemVariants}>
                        <WhyAttendCard icon={reason.icon} title={reason.title} description={reason.description} />
                    </motion.div>
                ))}
            </motion.div>
            <motion.div
                className="flex flex-col items-center gap-4"
                initial={{ opacity: 0, y: 32 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 0.6, ease: "easeOut", delay: 0.6 }}
            >
                <a href="https://corporate-finance-learning.kit.com/f730d10d6f" target="_blank" rel="noopener noreferrer">
                    <Button label="Get your pass" />
                </a>
                <p className="text-p-xsm text-content-heading">Save $200: Only 55 Super Early Bird passes remaining</p>
            </motion.div>
        </div>
    )
}

export default WhyAttendSection