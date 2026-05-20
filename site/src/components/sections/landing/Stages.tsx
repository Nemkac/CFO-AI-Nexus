import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "motion/react"
import Button from "@/components/ui/Button"
import FilterButton from "@/components/ui/FilterButton"
import SpeakerCard from "@/components/ui/SpeakerCard"
import { fetchSpeakers, type WPSpeaker } from "@/lib/wordpress"
import { Link } from "@tanstack/react-router"

const stages = ['Main Stage', 'FP&A', 'Financial Close & Consolidation', 'Treasury & Cash Management', 'AR/AP Automation']

const StagesSection = () => {
    const [activeStage, setActiveStage] = useState<string>('Main Stage')
    const [speakers, setSpeakers] = useState<WPSpeaker[]>([])

    useEffect(() => {
        fetchSpeakers().then(setSpeakers).catch(console.error)
    }, [])

    return (
        <div className="[background:radial-gradient(50%_80%_at_center,#1F2566,#040820)] md:[background:radial-gradient(40%_80%_at_top,#1F2566,#040820)] py-10 md:py-20 flex items-center w-full justify-center">
            <div className='flex flex-col items-center justify-center max-w-6xl w-full p-4 gap-14'>
                <div className="flex flex-col items-center flex-wrap gap-8">
                    <div className="flex flex-col gap-4 items-center max-w-xl">
                        <motion.h2
                            className="text-h2 text-content-heading"
                            initial={{ opacity: 0, y: 32 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: "-80px" }}
                            transition={{ duration: 0.6, ease: "easeOut" }}
                        >
                            Conference
                        </motion.h2>
                        <motion.p
                            className="text-p-md text-content-body text-center text-balance max-w-3xl"
                            initial={{ opacity: 0, y: 32 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: "-80px" }}
                            transition={{ duration: 0.6, ease: "easeOut", delay: 0.3 }}
                        >
                            We are constantly adding world-class speakers to the roster. Please note that the schedule and speakers are subject to change as we continue to finalize the ultimate experience for you.
                        </motion.p>
                    </div>
                    <motion.div
                        className="flex flex-row gap-4 flex-wrap justify-center max-w-4xl"
                        initial={{ opacity: 0, y: 24 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-80px" }}
                        transition={{ duration: 0.6, ease: "easeOut", delay: 0.2 }}
                    >
                        {stages.map(stage => (
                            <FilterButton key={stage} label={stage} variant={activeStage === stage ? 'active' : 'inactive'} onClick={() => setActiveStage(stage)} />
                        ))}
                    </motion.div>
                </div>

                <AnimatePresence mode="wait">
                    <motion.div
                        key={activeStage}
                        className="flex flex-row flex-wrap items-stretch gap-6 justify-center"
                        exit={{ opacity: 0, y: -12, transition: { duration: 0.2, ease: "easeIn" } }}
                    >
                        {speakers.filter(speaker => speaker.stage.some(s => s === activeStage)).map((speaker, i) => (
                            <motion.div
                                key={i}
                                className="flex"
                                initial={{ opacity: 0, y: 24 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true, margin: "-40px" }}
                                transition={{ duration: 0.4, ease: "easeOut", delay: i * 0.08 }}
                            >
                                <SpeakerCard imageUrl={speaker.image} title={speaker.title} speaker={speaker.speaker} role={speaker.role} />
                            </motion.div>
                        ))}
                    </motion.div>
                </AnimatePresence>

                <motion.div
                    className="flex flex-col items-center w-full gap-4"
                    initial={{ opacity: 0, y: 24 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-80px" }}
                    transition={{ duration: 0.6, ease: "easeOut" }}
                >
                    <Link to="/checkout">
                        <Button className="px-20" label="Register Now" />
                    </Link>
                    <p className="text-p-xsm text-content-heading">10.000+ finance leaders already trained</p>
                </motion.div>
            </div>
        </div>
    )
}

export default StagesSection
