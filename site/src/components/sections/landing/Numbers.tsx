import { motion } from "motion/react"
import NumberCounter from "@/components/ui/NumberCounter"

const numbers = [
    { value: 35, title: "Expert Sessions\nAcross 6 Stages" },
    { value: 30, title: "Technology\nExhibitors" },
    { value: 700, title: "CFOs, VPs & Finance\nDecision Makers" },
    { value: 2500, title: "Live\nProduct Demos" },
    { value: 1800, title: "AI-Matched 1:1\nMeetings" },
]

const containerVariants = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.12 } },
}

const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" as const } },
}

const NumbersSection = () => {
    return (
        <div className="[background:radial-gradient(50%_80%_at_center,#1F2566,#040820)] md:[background:radial-gradient(40%_100%_at_top,#1F2566,#040820)] py-10 md:py-20 flex items-center w-full justify-center">
            <motion.div
                className='flex flex-row flex-wrap items-center justify-center max-w-6xl w-full p-4 gap-16'
                variants={containerVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-80px" }}
            >
                {numbers.map(number => (
                    <motion.div key={number.title} variants={itemVariants}>
                        <NumberCounter value={number.value} title={number.title} />
                    </motion.div>
                ))}
            </motion.div>
        </div>
    )
}

export default NumbersSection
