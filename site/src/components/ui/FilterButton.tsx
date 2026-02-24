import { cn } from "@/lib/utils"
import { cva, type VariantProps } from "class-variance-authority"

const outerVariants = cva(
    'p-[2px] rounded-full',
    {
        variants: {
            variant: {
                active: 'bg-linear-to-r from-pink-500 to-sapphire-500',
                inactive: 'bg-linear-to-r from-[#FC69D2] to-[#8F9DFF]',
            },
        },
        defaultVariants: {
            variant: 'active',
        },
    }
)

const innerVariants = cva(
    'relative overflow-hidden flex flex-row gap-2 px-6 py-2 text-h6 items-center justify-center cursor-pointer rounded-full text-p-md-semibold',
    {
        variants: {
            variant: {
                active: 'bg-linear-to-r from-pink-500 to-sapphire-500 text-content-heading',
                inactive: 'bg-linear-to-r from-pink-900 to-surface-page text-content-heading before:absolute before:inset-0 before:bg-linear-to-r before:from-pink-500 before:to-sapphire-500 before:opacity-0 hover:before:opacity-100 before:transition-opacity before:duration-500',
            },
        },
        defaultVariants: {
            variant: 'active',
        },
    }
)

type Props = VariantProps<typeof outerVariants> & {
    label: string,
    onClick?: () => void,
}

const FilterButton = ({ label, variant, onClick }: Props) => {
    return (
        <div className={cn(outerVariants({ variant }))} onClick={onClick}>
            <div className={cn(innerVariants({ variant }))}>
                <span className="relative z-10">{label}</span>
            </div>
        </div>
    )
}

export default FilterButton
