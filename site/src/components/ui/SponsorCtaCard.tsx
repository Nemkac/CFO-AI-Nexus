import Button from '@/components/ui/Button'
import { Link } from '@tanstack/react-router'

type Props = {
    title: string
    buttonLabel: string
}

const SponsorCtaCard = ({ title, buttonLabel }: Props) => {
    return (
        <div className="flex flex-col items-center justify-center py-10 px-8 rounded-2xl w-full max-w-sm border border-dashed border-stroke-default bg-surface-page/40 gap-8 text-center">
            <h4 className="text-h4 text-white text-pretty">{title}</h4>
            <Link to="/proposal">
                <Button label={buttonLabel} />
            </Link>
        </div>
    )
}

export default SponsorCtaCard
