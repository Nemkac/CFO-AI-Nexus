import { useEffect, useRef, type ReactNode } from "react"
import { motion } from "motion/react"
import { Monitor, Smartphone } from "lucide-react"
import { buttonVariants } from "@/components/ui/Button"
import { usePageLoad } from "@/components/layout/PageLoadContext"
import ImageSection from "@/components/sections/landing/Image"
import { cn } from "@/lib/utils"

const SECTION_ID = "join-brella"

const steps = [
    { title: "Look for your invite", description: "Brella sends an invitation to the email you used for your pass." },
    { title: "Sign in with that same email", description: "Download the app or open Brella in your browser." },
    { title: "Set up your profile", description: "Pick your interests so matchmaking can suggest the right people to meet." },
]

// Same glass treatment as FeatureCard / OpportunitiesCard.
const glassCardShadow =
    'inset 0 1px 0 rgba(201, 208, 255, 0.2), inset 0 -1px 0 rgba(77, 93, 255, 0.12), inset 1px 0 0 rgba(201, 208, 255, 0.1), inset -1px 0 0 rgba(77, 93, 255, 0.08), inset 0 0 48px rgba(201, 208, 255, 0.04)'

const fadeUp = {
    hidden: { opacity: 0, y: 24 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" as const } },
}

const stagger = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.12 } },
}

const AppleLogo = () => (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="size-6 fill-white">
        <path d="M16.4 12.6c0-2.6 2.1-3.8 2.2-3.9-1.2-1.8-3.1-2-3.8-2-1.6-.2-3.1.9-3.9.9-.8 0-2-.9-3.4-.9-1.7 0-3.3 1-4.2 2.6-1.8 3.1-.5 7.7 1.3 10.2.8 1.2 1.8 2.6 3.1 2.5 1.3 0 1.7-.8 3.3-.8 1.5 0 1.9.8 3.3.8 1.4 0 2.2-1.2 3-2.5 1-1.4 1.3-2.8 1.4-2.9-.1 0-2.6-1-2.6-4zM13.9 5c.7-.8 1.2-2 1-3.1-1 0-2.2.7-2.9 1.5-.6.7-1.2 1.9-1 3 1.1.1 2.2-.6 2.9-1.4z" />
    </svg>
)

const GooglePlayLogo = () => (
    <svg viewBox="30 336.7 120.9 129.2" aria-hidden="true" className="size-6">
        <path fill="#FFD400" d="M119.2 421.2c15.3-8.4 27-14.8 28-15.3 3.2-1.7 6.5-6.2 0-9.7-2.1-1.1-13.4-7.3-28-15.3l-20.1 20.2 20.1 20.1z" />
        <path fill="#FF3333" d="M99.1 401.1l-64.2 64.7c1.5.2 3.2-.2 5.2-1.3 4.2-2.3 48.8-26.7 79.1-43.3l-20.1-20.1z" />
        <path fill="#48FF48" d="M99.1 401.1l20.1-20.2s-74.6-40.7-79.1-43.1c-1.7-1-3.6-1.3-5.3-1l64.3 64.3z" />
        <path fill="#3BCCFF" d="M99.1 401.1l-64.3-64.3c-2.6.6-4.8 2.9-4.8 7.6v113.8c0 4.3 1.7 7.4 4.9 7.7l64.2-64.8z" />
    </svg>
)

type StoreBadgeProps = {
    href: string
    ariaLabel: string
    icon: ReactNode
    caption: string
    store: string
}

// Black store badge in the official App Store / Google Play style.
const StoreBadge = ({ href, ariaLabel, icon, caption, store }: StoreBadgeProps) => (
    <a
        href={href}
        target="_blank"
        rel="noopener"
        aria-label={ariaLabel}
        className="inline-flex items-center gap-2.5 h-13 pl-3.5 pr-5 rounded-[10px] bg-black border border-[#a6a6a6] text-white hover:border-white hover:-translate-y-0.5 transition-all duration-200"
    >
        {icon}
        <span className="flex flex-col items-start leading-none">
            <span className="text-[0.6875rem] tracking-wide">{caption}</span>
            <span className="text-[1.3rem] font-semibold tracking-tight mt-0.5">{store}</span>
        </span>
    </a>
)

type WayCardProps = {
    icon: ReactNode
    title: string
    description: string
    children: ReactNode
}

const WayCard = ({ icon, title, description, children }: WayCardProps) => (
    <motion.div
        variants={fadeUp}
        className="flex flex-col gap-6 rounded-3xl p-6 md:p-8 border border-stroke-default/25 backdrop-blur-sm bg-purple-800/10"
        style={{ boxShadow: glassCardShadow }}
    >
        <div className="flex items-start gap-4">
            <span className="grid place-items-center size-11 shrink-0 rounded-xl border border-stroke-default/25 bg-sapphire-500/15 text-sapphire-200">
                {icon}
            </span>
            <div className="flex flex-col gap-1">
                <h3 className="text-h5 text-content-heading">{title}</h3>
                <p className="text-p-md text-content-body text-pretty">{description}</p>
            </div>
        </div>
        {children}
    </motion.div>
)

const BrellaSection = () => {
    const ref = useRef<HTMLElement>(null)
    const { isLoaded } = usePageLoad()

    // Visitors arriving from an email or LinkedIn on /#join-brella land while the
    // loading screen and fonts are still settling the layout, so the browser's own
    // anchor jump can miss. Re-align once the page is ready.
    useEffect(() => {
        if (!isLoaded || window.location.hash !== `#${SECTION_ID}`) return
        ref.current?.scrollIntoView({ block: "start" })
    }, [isLoaded])

    return (
        <section
            ref={ref}
            id={SECTION_ID}
            aria-labelledby="brella-title"
            className="w-full overflow-hidden scroll-mt-(--layout-offset) pt-10 md:pt-20 [background:radial-gradient(45%_55%_at_80%_35%,rgba(77,93,255,0.16),transparent_70%),radial-gradient(35%_45%_at_10%_70%,rgba(252,105,210,0.07),transparent_70%),#040820]"
        >
            <div className="max-w-6xl mx-auto p-4 grid grid-cols-1 min-[880px]:grid-cols-[1.05fr_1fr] gap-10 min-[880px]:gap-14 items-start">
                <motion.div
                    className="flex flex-col"
                    variants={stagger}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-80px" }}
                >
                    <motion.h2 id="brella-title" variants={fadeUp} className="text-h2 text-content-heading text-balance">
                        How to join CFO{"\u00A0"}AI{"\u00A0"}Nexus on Brella
                    </motion.h2>
                    <motion.p variants={fadeUp} className="text-p-md text-content-body text-pretty mt-4 max-w-[52ch]">
                        The whole event runs on Brella: live sessions, live demos, virtual booths and your 1:1 meetings. Use it on your phone or straight from your browser.
                    </motion.p>
                    <motion.p variants={fadeUp} className="text-p-sm text-content-heading/70 mt-2">
                        For attendees, speakers and sponsors.
                    </motion.p>

                    <ol className="flex flex-col mt-10">
                        {steps.map((step, i) => (
                            <motion.li
                                key={step.title}
                                variants={fadeUp}
                                className="relative grid grid-cols-[2.5rem_1fr] gap-4 pb-8 last:pb-0"
                            >
                                {/* Connector to the next step */}
                                {i < steps.length - 1 && (
                                    <span
                                        aria-hidden
                                        className="absolute left-5 top-12 bottom-2 w-px -translate-x-1/2 bg-linear-to-b from-pink-500/60 to-sapphire-500/20"
                                    />
                                )}
                                <span
                                    aria-hidden
                                    className="grid place-items-center size-10 rounded-full bg-linear-to-br from-pink-500 to-sapphire-500 text-p-md-semibold text-content-heading shadow-[0_0_24px_rgba(252,105,210,0.3)]"
                                >
                                    {i + 1}
                                </span>
                                <div className="flex flex-col gap-1 pt-1.5">
                                    <strong className="text-p-lg-semibold text-content-heading">{step.title}</strong>
                                    <span className="text-p-md text-content-body text-pretty">{step.description}</span>
                                </div>
                            </motion.li>
                        ))}
                    </ol>
                </motion.div>

                <motion.div
                    className="flex flex-col gap-4"
                    variants={stagger}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-80px" }}
                >
                    <WayCard icon={<Smartphone size={20} />} title="On your phone" description="Get the Brella app for iOS or Android.">
                        <div className="flex flex-wrap gap-3">
                            <StoreBadge
                                href="https://apps.apple.com/us/app/brella-io/id1178449878"
                                ariaLabel="Download Brella on the App Store"
                                icon={<AppleLogo />}
                                caption="Download on the"
                                store="App Store"
                            />
                            <StoreBadge
                                href="https://play.google.com/store/apps/details?id=com.brella"
                                ariaLabel="Get Brella on Google Play"
                                icon={<GooglePlayLogo />}
                                caption="GET IT ON"
                                store="Google Play"
                            />
                        </div>
                    </WayCard>

                    <WayCard icon={<Monitor size={20} />} title="In your browser" description="No download needed. Works on desktop in Chrome, Edge, Safari or Firefox.">
                        <a
                            href="https://next.brella.io/"
                            target="_blank"
                            rel="noopener"
                            className={cn(buttonVariants(), "self-start px-10")}
                        >
                            <span className="relative z-10 text-p-md-semibold">Open Brella in browser</span>
                        </a>
                    </WayCard>

                    <motion.p variants={fadeUp} className="text-p-sm text-content-body text-pretty px-1">
                        Can't find your invite or can't sign in? Check spam first, then visit the{" "}
                        <a
                            href="https://help-attendees.brella.io/en/"
                            target="_blank"
                            rel="noopener"
                            className="text-content-heading underline underline-offset-4 hover:text-pink-500 transition-colors"
                        >
                            Brella help center
                        </a>{" "}
                        or{" "}
                        <a
                            href="mailto:support@cfoainexus.com"
                            className="text-content-heading underline underline-offset-4 hover:text-pink-500 transition-colors"
                        >
                            contact us
                        </a>
                        .
                    </motion.p>
                </motion.div>
            </div>

            {/* The speaker + platform screens visual sits full-width at the bottom. */}
            <div className="mt-12 md:mt-20">
                <ImageSection />
            </div>
        </section>
    )
}

export default BrellaSection
