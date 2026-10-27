import type { ReactNode } from 'react'
import { motion } from 'motion/react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const bannerVariants = cva(
    'flex flex-col md:flex-row md:items-center justify-between gap-6 md:gap-10 w-full rounded-2xl',
    {
        variants: {
            variant: {
                // Deep purple → navy, the brand gradient used by the sticky banner.
                primary: 'bg-linear-to-r from-pink-900 to-sapphire-800 px-6 py-8 md:px-12 md:py-12',
                // Dark blue.
                secondary: 'bg-linear-to-r from-sapphire-800 to-surface-page border-[0.5px] border-stroke-default px-6 py-8 md:px-10 md:py-10',
                // Same fill as the speaker cards, running left to right.
                card: 'bg-linear-to-r from-sapphire-800/70 to-transparent border-[0.3px] border-stroke-disabled px-6 py-6 md:px-8 md:py-8',
            },
        },
        defaultVariants: {
            variant: 'primary',
        },
    }
)

type Props = VariantProps<typeof bannerVariants> & {
    eyebrow?: string
    title: string
    subtitle?: string
    // Right-hand side: usually a CTA button.
    children: ReactNode
    titleSize?: 'md' | 'lg'
    className?: string
}

const CtaBanner = ({ variant, eyebrow, title, subtitle, children, titleSize = 'md', className }: Props) => {
    return (
        <motion.div
            className={cn(bannerVariants({ variant }), className)}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
        >
            <div className="flex flex-col gap-2 min-w-0">
                {eyebrow && <p className="text-p-sm-semibold text-pink-200 uppercase tracking-widest">{eyebrow}</p>}
                <h3 className={`${titleSize === 'lg' ? 'text-h3' : 'text-h4'} text-content-heading text-balance`}>{title}</h3>
                {subtitle && <p className="text-p-md text-content-body text-pretty">{subtitle}</p>}
            </div>
            <div className="flex flex-col items-start md:items-end gap-4 shrink-0">
                {children}
            </div>
        </motion.div>
    )
}

export default CtaBanner
