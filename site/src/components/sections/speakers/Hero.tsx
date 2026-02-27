import { motion } from "motion/react"
import Badge from "@/components/ui/badge"
import Button from "@/components/ui/Button"

const fadeUp = {
    hidden: { opacity: 0, y: 24 },
    visible: { opacity: 1, y: 0 },
}

const SpeakersHeroSection = () => {
    return (
        <div className='flex flex-col w-full items-center justify-center py-10 md:py-30 bg-surface-page gap-6 p-4'>
            <motion.div
                variants={fadeUp}
                initial="hidden"
                animate="visible"
                transition={{ duration: 0.2, ease: "easeOut" }}
            >
                <Badge label="October 20–21, 2026 | 100% Virtual" delay={200} />
            </motion.div>

            <motion.div
                className="flex flex-col gap-1 items-center justify-center text-pretty max-w-4xl text-center"
                variants={fadeUp}
                initial="hidden"
                animate="visible"
                transition={{ duration: 0.5, ease: "easeOut", delay: 0.15 }}
            >
                <h2 className="text-h1 text-content-heading text-balance">Speakers</h2>
                <p className="text-p-md text-content-body text-balance">Two days of world-class sessions, live product demos, and AI-driven networking — built to help CFOs and finance teams cut through the noise and find the tools reshaping modern finance.</p>
            </motion.div>

            <motion.div
                className="flex flex-col items-center gap-4"
                variants={fadeUp}
                initial="hidden"
                animate="visible"
                transition={{ duration: 0.5, ease: "easeOut", delay: 0.3 }}
            >
                <a href="https://corporate-finance-learning.kit.com/f730d10d6f" target="_blank" rel="noopener noreferrer">
                    <Button label="Get your pass" />
                </a>
                <p className="text-p-xsm text-content-heading">Save $200: Only 55 Super Early Bird passes remaining</p>
            </motion.div>
        </div>
    )
}

export default SpeakersHeroSection