import { motion } from "motion/react"
import NumberCounter from "@/components/ui/NumberCounter"
import Button from "@/components/ui/Button"
import { Link } from "@tanstack/react-router"

const numbers: { value?: number; suffix?: string; label?: string; title: string }[] = [
    { value: 20, title: "Expert Sessions\nAcross 6 Stages" },
    { value: 3, suffix: "+", title: "Technology\nExhibitors" },
    { value: 400, suffix: "+", title: "CFOs, VPs & Finance\nDecision Makers" },
    { value: 3, suffix: "+", title: "Live\nProduct Demos" },
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
        <div className="[background:radial-gradient(50%_80%_at_center,#1F2566,#040820)] md:[background:radial-gradient(40%_100%_at_top,#1F2566,#040820)] py-10 md:py-20 flex flex-col items-center w-full justify-center gap-10 md:gap-14">
            <motion.div
                className='flex flex-row flex-wrap items-center justify-center max-w-6xl w-full p-4 gap-16'
                variants={containerVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-80px" }}
            >
                {numbers.map(number => (
                    <motion.div key={number.title} variants={itemVariants}>
                        <NumberCounter
                            value={number.value}
                            suffix={number.suffix}
                            label={number.label}
                            title={number.title}
                        />
                    </motion.div>
                ))}
            </motion.div>
            <motion.div
                className="flex flex-col items-center gap-4 px-4"
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 0.6, ease: "easeOut", delay: 0.4 }}
            >
                <Link to="/checkout">
                    <Button className="px-10 md:px-20" label="Join 400+ Finance Leaders – $295" />
                </Link>
                <p className="text-p-xsm text-content-heading text-center">October 20–21 · 100% virtual · Join from anywhere</p>
            </motion.div>
        </div>
    )
}

export default NumbersSection
