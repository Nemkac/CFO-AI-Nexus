import SpeakerCtaCard from "./SpeakerCtaCard"

type Speaker = {
    image: string,
    fullName: string,
    role: string,
    title: string,
    linkedIn: string
}

type Props = {
    title: string
    speakers: Speaker[]
}

const SpeakersStageGroup = ({ ...props }: Props) => {
    return (
        <div className="flex flex-col gap-4 items-center px-4">
            <h3 className="text-h3 text-content-heading">{props.title}</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 w-full gap-4">
                {props.speakers.map(speaker => (
                    <SpeakerCtaCard fullName={speaker.fullName} role={speaker.role} title={speaker.title} linkedIn={speaker.linkedIn} image={speaker.image} />
                ))}
            </div>
        </div>
    )
}

export default SpeakersStageGroup

