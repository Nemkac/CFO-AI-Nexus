import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'
import { cva, type VariantProps } from 'class-variance-authority'

// Exported so links that leave the site can carry the same look as an <a>.
export const buttonVariants = cva(
    'relative overflow-hidden flex flex-row gap-2 px-4 py-3 items-center justify-center cursor-pointer rounded-full text-p-md-semibold',
    {
        variants: {
            variant: {
                primary: 'bg-linear-to-r from-pink-500 to-sapphire-500 text-content-heading before:absolute before:inset-0 before:bg-linear-to-r before:from-sapphire-500 before:to-sapphire-300 before:opacity-0 hover:before:opacity-100 before:transition-opacity before:duration-500',
                secondary: 'bg-linear-to-t from-transparent via-transparent to-content-heading/50 text-content-heading border-[1px] border-neutral-25 hover:border-neutral-100',
                outline: 'bg-transparent text-content-heading border-[1px] border-neutral-25 hover:bg-content-heading/10 transition-colors duration-300',
                white: 'bg-content-heading text-surface-page hover:bg-sapphire-500 hover:text-content-heading',
                sky: 'bg-[#A3E7FC] text-content-on-action hover:brightness-95'
            },
        },
        defaultVariants: {
            variant: 'primary',
        },
    }
)

type Props = VariantProps<typeof buttonVariants> & {
    label: string
    // Rendered after the label, e.g. an arrow.
    icon?: ReactNode
    className?: string
    onClick?: () => void
    disabled?: boolean
}

const Button = ({ variant, label, icon, className, onClick, disabled }: Props) => {
    return (
        <button className={cn(buttonVariants({ variant }), className, disabled && 'opacity-50 cursor-not-allowed')} onClick={onClick} disabled={disabled}>
            <span className="relative z-10 text-p-md-semibold transition-[0.5s]">{label}</span>
            {icon && <span className="relative z-10 flex items-center">{icon}</span>}
        </button>
    )
}

export default Button
