// The sponsor line-up as a two-column grid of tiers: each non-empty tier gets a
// column with its heading and its cards, and the tiers fill the grid in the order
// declared in lib/sponsors.ts.
//
// Shared by the landing-page Partners section and the /sponsors-and-exhibitors page
// so the two stay identical. They differ only in `variant`: the sponsor page prints
// the tier badge and the sponsor's description on each card, the landing page keeps
// the cards to logo-and-name.

import { motion } from 'motion/react'
import SponsorCard from '@/components/ui/SponsorCard'
import { sponsors, tiers } from '@/lib/sponsors'

type Props = {
    variant: 'landing' | 'page'
    // The tier heading is an h3 under the landing section's h2, but a section
    // heading in its own right on the sponsor page.
    headingLevel?: 'h2' | 'h3'
}

const SponsorTierGrid = ({ variant, headingLevel = 'h3' }: Props) => {
    const Heading = motion[headingLevel]
    const populated = tiers.filter(
        ({ tier, showOn }) => showOn.includes(variant) && sponsors.some((s) => s.tier === tier)
    )

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-12 w-full items-start">
            {populated.map(({ tier, title, badge }, columnIndex) => {
                const tierSponsors = sponsors.filter((sponsor) => sponsor.tier === tier)
                // An odd number of tiers leaves the last one alone on its row, where it
                // would hang off to the left. Let it span both columns so it centres.
                const isLoneOnLastRow =
                    populated.length % 2 === 1 && columnIndex === populated.length - 1

                return (
                    <div
                        key={tier}
                        className={`flex flex-col items-center w-full gap-8 ${isLoneOnLastRow ? 'md:col-span-2' : ''}`}
                    >
                        <Heading
                            className="text-h3 text-content-heading text-center"
                            initial={{ opacity: 0, y: 24 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: '-80px' }}
                            transition={{ duration: 0.5, ease: 'easeOut', delay: columnIndex * 0.06 }}
                        >
                            {title}
                        </Heading>
                        <div className="flex flex-row flex-wrap items-stretch justify-center gap-6 w-full">
                            {tierSponsors.map((sponsor, i) => (
                                <motion.div
                                    key={sponsor.name}
                                    // flex-1 with a floor lets a lone card sit wide and
                                    // centred, while two cards share the column side by
                                    // side and only stack once the column gets narrow.
                                    className="flex flex-1 min-w-[15rem] max-w-sm"
                                    initial={{ opacity: 0, y: 24 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true, margin: '-40px' }}
                                    transition={{ duration: 0.4, ease: 'easeOut', delay: i * 0.08 }}
                                >
                                    <SponsorCard
                                        name={sponsor.name}
                                        imageUrl={sponsor.logo}
                                        link={sponsor.link}
                                        size="fill"
                                        {...(variant === 'page'
                                            ? { badge, description: sponsor.description }
                                            : {})}
                                    />
                                </motion.div>
                            ))}
                        </div>
                    </div>
                )
            })}
        </div>
    )
}

export default SponsorTierGrid
