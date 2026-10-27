import { motion } from "motion/react"
import Button from "@/components/ui/Button"
import { Link } from "@tanstack/react-router"

const fadeUp = {
    hidden: { opacity: 0, y: 24 },
    visible: { opacity: 1, y: 0 },
}

const PackagesHeroSection = () => {
    return (
        <div className='flex flex-col w-full items-center justify-center py-10 md:py-30 bg-surface-page gap-6 p-4'>
            <motion.div
                className="flex flex-col gap-1 items-center justify-center text-pretty max-w-4xl text-center"
                variants={fadeUp}
                initial="hidden"
                animate="visible"
                transition={{ duration: 0.5, ease: "easeOut" }}
            >
                <h1 className="text-h1 text-content-heading text-balance">Where High-Tier Innovators Meet High-Intent Buyers.</h1>
                <p className="text-p-md text-content-body text-balance">Connect with a curated community of finance and C-suite professionals through our intelligent matchmaking, designed to align your solutions with their strategic needs.</p>
            </motion.div>

            <motion.div
                className="flex flex-col items-center gap-6"
                variants={fadeUp}
                initial="hidden"
                animate="visible"
                transition={{ duration: 0.5, ease: "easeOut", delay: 0.2 }}
            >
                <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6">
                    <Link to="/proposal">
                        <Button label="Schedule a Call" />
                    </Link>
                    <a
                        href="mailto:support@cfoainexus.com?subject=Innovator%20inquiry%20-%20CFO%20AI%20Nexus"
                        className="text-p-md-link text-content-heading underline underline-offset-4 hover:text-pink-500 transition-colors"
                    >
                        Are you an innovator? Get in touch
                    </a>
                </div>
                <div className="flex flex-wrap items-center justify-center gap-x-2 gap-y-1 rounded-full border-[0.5px] border-stroke-default bg-surface-default/60 px-4 py-2 text-p-sm text-center">
                    <span className="text-content-body">Here to attend, not sponsor?</span>
                    <Link to="/checkout" className="text-p-sm-semibold text-pink-500 hover:text-pink-300 transition-colors">
                        Get your pass – $295
                    </Link>
                </div>
            </motion.div>
        </div>
    )
}

export default PackagesHeroSection