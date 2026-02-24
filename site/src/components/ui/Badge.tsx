import { useState, useEffect } from "react"
import { motion } from "motion/react"

type Props = {
    label: string;
    delay?: number;
}

const Badge = ({ label, delay = 0 }: Props) => {
    const [displayedText, setDisplayedText] = useState("")
    const [isDone, setIsDone] = useState(false)

    useEffect(() => {
        let startTimeout: ReturnType<typeof setTimeout>
        let interval: ReturnType<typeof setInterval>

        startTimeout = setTimeout(() => {
            let i = 0
            interval = setInterval(() => {
                i++
                setDisplayedText(label.slice(0, i))
                if (i >= label.length) {
                    clearInterval(interval)
                    setIsDone(true)
                }
            }, 45)
        }, delay)

        return () => {
            clearTimeout(startTimeout)
            clearInterval(interval)
        }
    }, [label, delay])

    return (
        <div className="rounded-full border border-surface-action bg-linear-to-r from-surface-page to-pink-900 px-4 py-3 text-p-md text-content-heading">
            <span>{displayedText}</span>
            {!isDone && (
                <motion.span
                    animate={{ opacity: [1, 0] }}
                    transition={{ duration: 0.5, repeat: Infinity, repeatType: "reverse" }}
                    className="ml-0.5 inline-block"
                >
                    |
                </motion.span>
            )}
        </div>
    )
}

export default Badge
