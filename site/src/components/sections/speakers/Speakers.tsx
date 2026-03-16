import SpeakersStageGroup from '@/components/ui/SpeakersStageGroup'
import { stages, speakers } from '@/data/speakers'

const sections = stages.map(stage => ({
    sectionTitle: stage,
    speakers: speakers
        .filter(s => s.stage.includes(stage))
        .map(s => ({
            image: s.image,
            fullName: s.speaker,
            role: s.role,
            title: s.title,
            linkedIn: s.link ?? ""
        }))
}))

const SpeakersSection = () => {
    return (
        <div className='py-10 md:py-20 flex flex-col gap-6 md:gap-10 items-center w-full justify-center bg-surface-page '>
            <div className='flex flex-row flex-wrap items-center justify-center max-w-6xl w-full p-4 gap-16'>
                {sections.map(section => (
                    <SpeakersStageGroup key={section.sectionTitle} title={section.sectionTitle} speakers={section.speakers} />
                ))}
            </div>
        </div>
    )
}

export default SpeakersSection
