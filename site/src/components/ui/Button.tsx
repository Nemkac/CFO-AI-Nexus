import { cn } from '@/lib/utils'
import { cva, type VariantProps } from 'class-variance-authority'

const buttonVariants = cva(
    'relative overflow-hidden flex flex-row gap-2 px-4 py-3 items-center justify-center cursor-pointer rounded-full text-p-md-semibold',
    {
        variants: {
            variant: {
                primary: 'bg-linear-to-r from-pink-500 to-sapphire-500 text-content-heading before:absolute before:inset-0 before:bg-linear-to-r before:from-sapphire-500 before:to-sapphire-300 before:opacity-0 hover:before:opacity-100 before:transition-opacity before:duration-500',
                secondary: 'bg-linear-to-t from-transparent via-transparent to-content-heading/50 text-content-heading border-[1px] border-neutral-25 hover:border-neutral-100',
                white: 'bg-content-heading text-surface-page hover:bg-sapphire-500 hover:text-content-heading'
            },
        },
        defaultVariants: {
            variant: 'primary',
        },
    }
)

type Props = VariantProps<typeof buttonVariants> & {
    label: string
}

const Button = ({ variant, label }: Props) => {
    return (
        <button className={cn(buttonVariants({ variant }))}>
            <span className="relative z-10 text-p-md-semibold transition-[0.5s]">{label}</span>
        </button>
    )
}

export default Button
