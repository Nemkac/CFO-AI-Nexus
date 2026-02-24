type Props = {
    imageUrl: string,
    title: string,
    speaker: string,
    role: string
}

const SpeakerCard = ({ ...props }: Props) => {
    return (
        <div className="flex flex-col items-center py-10 px-8 rounded-2xl max-w-xs bg-linear-to-t hover:-translate-y-1.25 hover:border-t transition-[0.5s] ease-in-out hover:border-t-content-heading from-sapphire-800 to-transparent gap-8 text-center">
            <img src={props.imageUrl} className="rounded-full w-30 h-30" />
            <h5 className="text-h5 text-content-heading text-pretty">{props.title}</h5>
            <div className="flex flex-col gap-4 items-center">
                <p className="text-p-lg-semibold text-content-heading">{props.speaker}</p>
                <p className="text-p-md text-content-heading text-pretty">{props.role}</p>
            </div>
        </div>
    )
}

export default SpeakerCard
