type Props = {
    image?: string,
    fullName: string,
    role: string,
    title: string,
    linkedIn: string
}

const SpeakerCtaCard = ({ ...props }: Props) => {
    return (
        <div className="flex flex-col gap-10 px-8 py-10 rounded-2xl border-[0.3px] border-stroke-disabled bg-linear-to-t from-sapphire-800/70 to-transparent">
            <div className="flex flex-col md:flex-row items-center gap-6 w-full">
                <img src={props.image} className="rounded-full size-20" />
                <div className="flex flex-col gap-2 items-center md:items-start">
                    <p className="text-p-md-semibold text-content-heading">{props.fullName}</p>
                    <p className="text-p-sm text-content-heading text-center md:text-start">{props.role}</p>
                </div>
            </div>
            <p className="text-p-lg-semibold text-content-heading text-center text-balance">{props.title}</p>
            <button className="flex flex-row items-center justify-center w-full border-[0.5px] py-3 px-2 gap-2 rounded-xl border-stroke-default bg-sapphire-800/50 hover:bg-sapphire-700 transition-[0.5s]">
                <img src='/icons/BxBxlLinkedin 1.svg' className="size-6" />
                <p className="text-p-sm text-content-heading">LinkedIn Profile</p>
            </button>
        </div>
    )
}


export default SpeakerCtaCard