import { useRef } from "react"
import { motion, useInView, useScroll, useTransform } from "motion/react"

const ImageSection = () => {
    const ref = useRef<HTMLDivElement>(null)
    const isInView = useInView(ref, { once: true, margin: "-80px" })

    const { scrollYProgress } = useScroll({
        target: ref,
        offset: ["start end", "end start"],
    })

    // Parallax — elements drift with scroll
    const parallaxY = useTransform(scrollYProgress, [0, 1], [-70, 70])

    return (
        <div ref={ref} className="relative w-full overflow-hidden" style={{ aspectRatio: "16/7" }}>
            {/* Background — always visible */}
            <img
                src="/assets/opportunities/BG.webp"
                alt=""
                className="absolute inset-0 w-full h-full object-cover"
            />

            {/* Left Image — slides in from left on enter */}
            <motion.img
                src="/assets/opportunities/Left Image.webp"
                alt=""
                style={{ y: parallaxY }}
                initial={{ opacity: 0, x: -80 }}
                animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -80 }}
                transition={{ duration: 0.8, ease: "easeOut", delay: 0.1 }}
                className="absolute left-1/2 -translate-x-full top-1/2 -translate-y-1/2 w-[33%]"
            />

            {/* Right Image — slides in from right on enter */}
            <motion.img
                src="/assets/opportunities/Right Image.webp"
                alt=""
                style={{ y: parallaxY }}
                initial={{ opacity: 0, x: 80 }}
                animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 80 }}
                transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
                className="absolute left-1/2 top-1/2 -translate-y-1/2 w-[33%]"
            />

            {/* Man — always visible, centered on top of panels */}
            <img
                src="/assets/opportunities/Man.webp"
                alt=""
                className="absolute bottom-0 left-1/2 -translate-x-1/2 h-[85%] object-contain z-10 pointer-events-none"
            />

            {/* Conference button — top left */}
            <motion.img
                src="/assets/opportunities/Button.svg"
                alt="Conference"
                style={{ y: parallaxY }}
                initial={{ opacity: 0, scale: 0.85 }}
                animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.85 }}
                transition={{ duration: 0.6, ease: "easeOut", delay: 0.35 }}
                className="absolute top-[10%] left-[8%] w-[11%] min-w-20 z-20"
            />

            {/* Solutions & Meetings button — top right */}
            <motion.img
                src="/assets/opportunities/Button-1.svg"
                alt="Solutions & Meetings"
                style={{ y: parallaxY }}
                initial={{ opacity: 0, scale: 0.85 }}
                animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.85 }}
                transition={{ duration: 0.6, ease: "easeOut", delay: 0.45 }}
                className="absolute top-[10%] right-[8%] w-[16%] min-w-28 z-20"
            />
        </div>
    )
}

export default ImageSection
