import { cn } from '@/lib/utils'
import { cva, type VariantProps } from 'class-variance-authority'

const cardVariants = cva(
    'flex border-[0.5px] border-stroke-default py-4 px-4 sm:py-6 sm:px-6 md:py-10 md:px-8 items-center justify-center w-full h-28 sm:h-32 md:h-40',
    {
        variants: {
            variant: {
                'Diamond': 'py-8 px-8 sm:py-10 sm:px-10 md:py-14 md:px-12 bg-linear-to-tr from-[#6674FF]/70 to-[#060B2F00] h-52 sm:h-64 md:h-80',
                'Platinum': 'bg-linear-to-tr from-[#3388FF]/70 to-[#060B2F00]',
                'Gold': 'bg-linear-to-tr from-[#594909]/70 to-[#060B2F00]',
                'Exibitor': 'bg-linear-to-tr from-[#4C203F]/70 to-[#060B2F00]'
            }
        }
    }
)

type Props = VariantProps<typeof cardVariants> & {
    image?: string,
}

const PartnerCard = ({ image, variant }: Props) => {
    return (
        <div className={cn(cardVariants({ variant }))}>
            {image && (<img src={image} className="object-contain w-full h-full" />)}
        </div>
    )
}

export default PartnerCard
