import { useEffect } from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { motion } from 'motion/react'
import SponsorTierGrid from '@/components/ui/SponsorTierGrid'
import { usePageLoad } from '@/components/layout/PageLoadContext'
import { linkify } from '@/lib/linkify'

// The page the sponsor-sharing consent points at: it names the sponsors a consent
// covers and explains exactly what is shared with them. The "here" in every sponsor
// consent checkbox links to this route, so the path must stay stable — it is recorded
// in lib/kit.ts as SPONSORS_PAGE_PATH.
export const Route = createFileRoute('/sponsors-and-exhibitors')({
    head: () => ({
        meta: [
            { title: 'Sponsors & Partners | CFO AI Nexus' },
            {
                name: 'description',
                content:
                    'Meet the 2026 CFO AI Nexus sponsors, partners and exhibitors, and see exactly how and when your details are shared with them.',
            },
        ],
    }),
    component: SponsorsPage,
})

const fadeUp = {
    hidden: { opacity: 0, y: 24 },
    visible: { opacity: 1, y: 0 },
}

// The data-sharing explainer, kept next to the sponsor list it refers to. This text
// is the public counterpart of Section 6 of the privacy policy — the two describe the
// same two sharing routes (a form opt-in, and an active interaction with a sponsor or
// partner) and must be changed together.
type SharingPoint = {
    title: string
    // Rendered in order; `bullets` sits between the first and any later paragraphs.
    paragraphs: React.ReactNode[]
    bullets?: { lead: string; text: string }[]
}

const sharingPoints: SharingPoint[] = [
    {
        title: 'When your details are shared',
        paragraphs: [
            'Your details are shared with a sponsor or partner only when you actively choose to, in one of these ways:',
            "Registering for the event, or simply visiting or viewing a sponsor's virtual booth, does not by itself cause your details to be shared.",
        ],
        bullets: [
            {
                lead: 'Opt-in on a form',
                text: "where a sharing option is presented on a registration, checkout or other event form and you tick it, we share the information specified on that form with the participating sponsors and partners, including speakers' organisations taking part in the event.",
            },
            {
                lead: 'Active interaction',
                text: 'where you voluntarily request a meeting, start a chat, request a demonstration, knowingly present or make available your QR code for lead scanning, or otherwise choose to establish contact with a sponsor or partner, the contact and profile information associated with that interaction may be made available to them. At the relevant interaction, you will be informed that proceeding makes the indicated information available.',
            },
        ],
    },
    {
        title: 'What may be shared',
        paragraphs: [
            "For a separate sharing choice on a form, we share only the information specified in that form's consent notice, which may include your name, work email address, company and job title. For an active interaction, the information made available may also include your industry or area of activity, stated interests, the time of the interaction and any additional profile fields you chose to complete and that are enabled for the event, as indicated in the notice provided at that interaction. We do not share payment details.",
        ],
    },
    {
        title: 'How sponsors and partners use it',
        paragraphs: [
            'Where a sponsor or partner receives your information for its own business follow-up or marketing, that sponsor or partner is responsible for its subsequent use of your information in accordance with its own privacy notice and applicable law. They may contact you about their products, services or related business offerings. An active interaction does not by itself provide unrestricted permission for future marketing.',
        ],
    },
    {
        title: 'Withdraw at any time',
        paragraphs: [
            'You can withdraw your sharing consent for future disclosures at any time by contacting support@cfoainexus.com. We will then stop future disclosures based on that consent. If your information has already been shared with a sponsor or partner, you can contact them directly to opt out of its marketing or exercise your privacy rights under its privacy notice.',
        ],
    },
    {
        title: 'Workday',
        paragraphs: [
            <>
                If you opt in to share your details with Workday, your information may be shared with
                Workday and other Workday group entities and used for Workday marketing, including
                email marketing, in accordance with Workday's{' '}
                <a
                    href="https://www.workday.com/en-us/privacy.html"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline hover:text-pink-500"
                >
                    privacy notice
                </a>
                .
            </>,
        ],
    },
]

// Make any email address in the copy open the mail app.
const withLinks = (node: React.ReactNode) =>
    typeof node === 'string' ? linkify(node, 'underline hover:text-pink-500') : node

function SponsorsPage() {
    const { signalReady } = usePageLoad()

    useEffect(() => {
        signalReady()
    }, [])

    return (
        <div className="flex flex-col w-full bg-surface-page">
            {/* Hero */}
            <div className="flex flex-col w-full items-center justify-center py-10 md:py-24 gap-6 p-4">
                <motion.div
                    className="flex flex-col gap-2 items-center justify-center text-pretty max-w-4xl text-center"
                    variants={fadeUp}
                    initial="hidden"
                    animate="visible"
                    transition={{ duration: 0.5, ease: 'easeOut', delay: 0.15 }}
                >
                    <h1 className="text-h1 text-content-heading text-balance">
                        Meet Our 2026 Sponsors, and Exhibitors
                    </h1>
                    <p className="text-p-md text-content-body text-balance">
                        October 20–21, 2026 · 100% virtual
                    </p>
                </motion.div>
            </div>

            {/* Sponsor cards — same tier layout as the landing page section */}
            <div className="flex items-center w-full justify-center bg-linear-to-t from-surface-page to-surface-default pb-10 md:pb-20">
                <div className="flex flex-col items-center justify-center max-w-6xl w-full p-4 gap-14">
                    <SponsorTierGrid variant="page" headingLevel="h2" />
                </div>
            </div>

            {/* Data-sharing explainer */}
            <div className="flex items-start w-full justify-center py-10 md:py-20 px-4">
                <motion.div
                    className="flex flex-col max-w-3xl w-full gap-8"
                    initial={{ opacity: 0, y: 24 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: '-80px' }}
                    transition={{ duration: 0.5, ease: 'easeOut' }}
                >
                    <div className="flex flex-col gap-3">
                        <h2 className="text-h3 text-content-heading text-balance">
                            How your data is shared with sponsors and partners
                        </h2>
                        <p className="text-p-md text-content-body text-pretty">
                            We only share your details with a sponsor or partner, including speakers'
                            organisations, when you choose to. Registering for the event, or simply
                            visiting or viewing a sponsor's virtual booth, does not by itself share
                            your contact or profile information with that sponsor.
                        </p>
                    </div>

                    <ol className="flex flex-col gap-6">
                        {sharingPoints.map((point, i) => (
                            <li
                                key={point.title}
                                className="flex flex-row gap-5 items-start border-[0.5px] border-stroke-default rounded-2xl p-6"
                            >
                                <span className="shrink-0 size-9 rounded-xl bg-sapphire-800/30 border-[0.5px] border-stroke-default text-content-heading text-p-md-semibold flex items-center justify-center">
                                    {i + 1}
                                </span>
                                <div className="flex flex-col gap-3">
                                    <h3 className="text-h6 text-content-heading">{point.title}</h3>
                                    <p className="text-p-md text-content-body text-pretty">
                                        {withLinks(point.paragraphs[0])}
                                    </p>
                                    {point.bullets && (
                                        <ul className="flex flex-col gap-2 pl-1">
                                            {point.bullets.map((bullet) => (
                                                <li
                                                    key={bullet.lead}
                                                    className="text-p-md text-content-body text-pretty flex flex-row gap-3"
                                                >
                                                    <span aria-hidden className="text-pink-400 shrink-0">
                                                        —
                                                    </span>
                                                    <span>
                                                        <span className="text-content-heading">
                                                            {bullet.lead}
                                                        </span>{' '}
                                                        — {withLinks(bullet.text)}
                                                    </span>
                                                </li>
                                            ))}
                                        </ul>
                                    )}
                                    {point.paragraphs.slice(1).map((paragraph, j) => (
                                        <p key={j} className="text-p-md text-content-body text-pretty">
                                            {withLinks(paragraph)}
                                        </p>
                                    ))}
                                </div>
                            </li>
                        ))}
                    </ol>
                </motion.div>
            </div>
        </div>
    )
}
