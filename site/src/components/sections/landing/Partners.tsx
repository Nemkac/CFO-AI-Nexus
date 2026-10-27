import { motion } from "motion/react"
import SponsorTierGrid from "@/components/ui/SponsorTierGrid"

const PartnersSection = () => {
    return (
        <div className="py-10 md:py-20 flex items-center w-full justify-center bg-linear-to-t from-surface-page to-surface-default">
            <div className='flex flex-col items-center justify-center max-w-6xl w-full p-4 gap-14'>
                <motion.h2
                    className="text-h2 text-content-heading text-center text-balance"
                    initial={{ opacity: 0, y: 32 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-80px" }}
                    transition={{ duration: 0.6, ease: "easeOut" }}
                >
                    Meet Our 2026 Sponsors, Partners and Exhibitors
                </motion.h2>

                <SponsorTierGrid variant="landing" headingLevel="h3" />
            </div>
        </div>
    )
}

export default PartnersSection
