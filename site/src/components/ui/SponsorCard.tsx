import { cn } from '@/lib/utils'
import { cva, type VariantProps } from 'class-variance-authority'

const cardVariants = cva(
    'flex flex-col items-center py-10 px-8 rounded-2xl w-full bg-linear-to-t hover:-translate-y-1.25 hover:border-t transition-[0.5s] ease-in-out hover:border-t-pink-500 from-pink-900 to-transparent gap-8 text-center',
    {
        variants: {
            size: {
                large: 'max-w-2xl py-12 px-10 gap-10',
                // Sponsor page: a step up from the landing-page card, which has to sit
                // three-across in a section rather than carry a description.
                feature: 'max-w-md py-12 px-9 gap-8',
                // Inside a tier column of SponsorTierGrid: the wrapper sets the width,
                // so the card must not cap its own.
                fill: 'max-w-none py-9 px-7 gap-7',
                default: 'max-w-sm',
            },
        },
        defaultVariants: {
            size: 'default',
        },
    }
)

const plateVariants = cva(
    'w-full flex items-center justify-center bg-white rounded-xl px-8',
    {
        variants: {
            size: {
                large: 'h-44 md:h-52 px-12',
                feature: 'h-36 md:h-44 px-10',
                fill: 'h-28 md:h-32 px-6',
                default: 'h-32 md:h-36',
            },
        },
        defaultVariants: {
            size: 'default',
        },
    }
)

// A `fill` card is only as wide as its grid column, so the sponsor name needs to
// come down a step to avoid wrapping awkwardly.
const nameSize = {
    large: 'text-h3',
    feature: 'text-h4',
    fill: 'text-h5',
    default: 'text-h4',
} as const

type Props = VariantProps<typeof cardVariants> & {
    imageUrl: string
    name: string
    link: string
    // Tier label printed above the logo, e.g. "Diamond Partner". Sponsor page only —
    // on the landing page the tier is already the section heading.
    badge?: string
    description?: string
}

const SponsorCard = ({ imageUrl, name, link, size, badge, description }: Props) => {
    return (
        <a
            href={link}
            target="_blank"
            rel="noopener noreferrer"
            className={cn(cardVariants({ size }))}
        >
            {badge && (
                <span className="text-p-sm-semibold uppercase tracking-[0.18em] text-pink-400 -mb-4">
                    {badge}
                </span>
            )}
            <div className={cn(plateVariants({ size }))}>
                <img src={imageUrl} alt={name} className="max-w-[85%] max-h-[75%] object-contain" loading="lazy" />
            </div>
            {/* Not composed via cn(): tailwind-merge reads the custom text-h3/text-h4
                utilities as text-color classes and would strip text-white. */}
            <h4 className={`${nameSize[size ?? 'default']} text-white text-pretty`}>{name}</h4>
            {description && (
                <p className="text-p-md text-content-body text-pretty -mt-4">{description}</p>
            )}
        </a>
    )
}

export default SponsorCard
