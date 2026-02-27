import { motion } from 'motion/react'

export interface SponsorshipRow {
    feature: string
    diamond: boolean
    platinum: boolean
    gold: boolean
    exhibitor: boolean
}

interface SponsorshipPackagesProps {
    rows: SponsorshipRow[]
}

const CheckMark = () => (
    <svg viewBox="0 0 20 20" fill="none" className="w-5 h-5 shrink-0" aria-label="Included">
        <circle cx="10" cy="10" r="9" fill="#3a4ecc" />
        <path
            d="M6 10.5l2.5 2.5 5.5-5.5"
            stroke="#e6e9ff"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
        />
    </svg>
)

const COLUMNS = [
    { key: 'diamond' as const, label: 'Diamond (Powered by)' },
    { key: 'platinum' as const, label: 'Platinum (3 slots)' },
    { key: 'gold' as const, label: 'Gold (6 slots)' },
    { key: 'exhibitor' as const, label: 'Exhibitor (20 slots)' },
]

const SponsorshipPackages = ({ rows }: SponsorshipPackagesProps) => {
    return (
        <div className="[background:radial-gradient(50%_300%_at_center,#1F2566,#3E4ACC)] md:[background:radial-gradient(40%_100%_at_top,#3E4ACC,#1F2566)] py-10 md:py-20 px-4 flex items-center w-full justify-center">
            <div className="flex flex-col items-center gap-14 max-w-5xl w-full">
                <motion.h2
                    className="text-h2 text-content-heading"
                    initial={{ opacity: 0, y: 32 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: '-80px' }}
                    transition={{ duration: 0.6, ease: 'easeOut' }}
                >
                    Sponsorship Packages
                </motion.h2>

                <motion.div
                    className="w-full overflow-x-auto rounded-2xl"
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: '-80px' }}
                    transition={{ duration: 0.6, ease: 'easeOut', delay: 0.15 }}
                >
                    <table className="w-full min-w-145 border-collapse border border-content-heading/20">
                        <thead>
                            <tr>
                                <th className="p-4 bg-surface-default w-[38%] border border-content-heading/20" />
                                {COLUMNS.map((col) => (
                                    <th
                                        key={col.key}
                                        className="p-4 text-center bg-surface-default text-content-heading text-p-sm font-medium border border-content-heading/20"
                                    >
                                        {col.label}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {rows.map((row, idx) => (
                                <tr
                                    key={idx}
                                    className={idx % 2 === 0 ? 'bg-surface-default' : 'bg-surface-page'}
                                >
                                    <td className="px-5 py-3.5 text-content-heading text-p-md border border-content-heading/20">
                                        {row.feature}
                                    </td>
                                    {COLUMNS.map((col) => (
                                        <td
                                            key={col.key}
                                            className="px-4 py-3.5 text-center border border-content-heading/20"
                                        >
                                            {row[col.key] && (
                                                <div className="flex justify-center">
                                                    <CheckMark />
                                                </div>
                                            )}
                                        </td>
                                    ))}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </motion.div>
            </div>
        </div>
    )
}

export default SponsorshipPackages
