import { motion } from "motion/react"
import SpeakerCtaCard from "./SpeakerCtaCard"

type Speaker = {
    image: string,
    fullName: string,
    role: string,
    title: string,
    linkedIn: string
}

type Props = {
    title: string
    speakers: Speaker[]
}

const SpeakersStageGroup = ({ ...props }: Props) => {
    return (
        <div className="flex flex-col gap-4 items-center px-4">
            <motion.h3
                className="text-h3 text-content-heading"
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.5, ease: "easeOut" }}
            >
                {props.title}
            </motion.h3>
            <div className="grid grid-cols-1 md:grid-cols-3 w-full gap-4">
                {props.speakers.map((speaker, i) => (
                    <motion.div
                        key={i}
                        initial={{ opacity: 0, y: 24 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-40px" }}
                        transition={{ duration: 0.4, ease: "easeOut", delay: i * 0.08 }}
                    >
                        <SpeakerCtaCard fullName={speaker.fullName} role={speaker.role} title={speaker.title} linkedIn={speaker.linkedIn} image={speaker.image} />
                    </motion.div>
                ))}
            </div>
        </div>
    )
}

export default SpeakersStageGroup