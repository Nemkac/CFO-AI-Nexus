import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "motion/react"
import Button from "@/components/ui/Button"
import FilterButton from "@/components/ui/FilterButton"
import SpeakerCard from "@/components/ui/SpeakerCard"
import { fetchStages, type WPStage } from "@/lib/wordpress"
import { Link } from "@tanstack/react-router"
import { useAgendaModal } from "@/components/layout/AgendaModalContext"

const StagesSection = () => {
    const [stages, setStages] = useState<WPStage[]>([])
    const [activeStageId, setActiveStageId] = useState<string | null>(null)
    const { openAgenda } = useAgendaModal()

    useEffect(() => {
        fetchStages().then(setStages).catch(console.error)
    }, [])

    // The first stage is selected until a visitor picks another one.
    const activeStage = stages.find(stage => stage.id === activeStageId) ?? stages[0]

    return (
        <div className="[background:radial-gradient(50%_80%_at_center,#1F2566,#040820)] md:[background:radial-gradient(40%_80%_at_top,#1F2566,#040820)] py-10 md:py-20 flex items-center w-full justify-center">
            <div className='flex flex-col items-center justify-center max-w-6xl w-full p-4 gap-14'>
                <div className="flex flex-col items-center flex-wrap gap-8">
                    <div className="flex flex-col gap-4 items-center max-w-xl">
                        <motion.h2
                            className="text-h2 text-content-heading text-center text-balance"
                            initial={{ opacity: 0, y: 32 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: "-80px" }}
                            transition={{ duration: 0.6, ease: "easeOut" }}
                        >
                            2026 Speakers &amp; Sessions
                        </motion.h2>
                        <motion.p
                            className="text-p-md text-content-body text-center text-balance max-w-3xl"
                            initial={{ opacity: 0, y: 32 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: "-80px" }}
                            transition={{ duration: 0.6, ease: "easeOut", delay: 0.3 }}
                        >
                            Six stages, two days, live on October 20–21. Browse the sessions by stage below and plan what you&apos;ll join
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
                            <FilterButton key={stage.id} label={stage.name} variant={activeStage?.id === stage.id ? 'active' : 'inactive'} onClick={() => setActiveStageId(stage.id)} />
                        ))}
                    </motion.div>
                </div>

                <AnimatePresence mode="wait">
                    <motion.div
                        key={activeStage?.id}
                        className="flex flex-row flex-wrap items-stretch gap-6 justify-center"
                        exit={{ opacity: 0, y: -12, transition: { duration: 0.2, ease: "easeIn" } }}
                    >
                        {(activeStage?.speakers ?? []).map((speaker, i) => (
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
                    className="flex flex-col sm:flex-row items-center justify-center w-full gap-4"
                    initial={{ opacity: 0, y: 24 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-80px" }}
                    transition={{ duration: 0.6, ease: "easeOut" }}
                >
                    <Link to="/checkout">
                        <Button className="px-10" label="Get Your Pass – $295" />
                    </Link>
                    <Button variant="outline" className="px-10" label="See All Sessions" onClick={openAgenda} />
                </motion.div>
            </div>
        </div>
    )
}

export default StagesSection
