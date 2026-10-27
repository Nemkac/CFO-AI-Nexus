import { useEffect, useRef } from "react"
import { motion, useMotionValue, useTransform, animate, useInView } from "motion/react"

type Props = {
    // Omit to print `label` verbatim instead of counting (e.g. "Unlimited").
    value?: number,
    // Appended to the counted number once it lands, e.g. "+".
    suffix?: string,
    label?: string,
    title: string
}

const NumberCounter = ({ value, suffix = '', label, title }: Props) => {
    const count = useMotionValue(0)
    const rounded = useTransform(count, (v) => `${Math.round(v).toLocaleString()}${suffix}`)
    const ref = useRef<HTMLDivElement>(null)
    const isInView = useInView(ref, { once: true, margin: "-80px" })

    useEffect(() => {
        if (!isInView || value === undefined) return
        const controls = animate(count, value, {
            duration: 2,
            ease: "easeOut",
        })
        return controls.stop
    }, [isInView, value, count])

    return (
        <div ref={ref} className='flex flex-col gap-2 items-center text-center min-w-35'>
            {value === undefined
                ? <h2 className='text-h2 text-content-heading'>{label}</h2>
                : <motion.h2 className='text-h2 text-content-heading'>{rounded}</motion.h2>}
            <p className='text-p-md text-content-heading whitespace-pre-line'>{title}</p>
        </div>
    )
}

export default NumberCounter
