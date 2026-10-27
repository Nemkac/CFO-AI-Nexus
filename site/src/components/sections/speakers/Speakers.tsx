import { useEffect, useState } from 'react'
import SpeakersStageGroup from '@/components/ui/SpeakersStageGroup'
import SpeakersCtaBanner from '@/components/ui/SpeakersCtaBanner'
import { fetchStages, type WPStage } from '@/lib/wordpress'

const ctaTitle = (stage: string) =>
    stage === 'Main Stage'
        ? 'Hear the Main Stage live on October 20–21'
        : `Hear the ${stage} sessions live on October 20–21`

const SpeakersSection = () => {
    const [stages, setStages] = useState<WPStage[]>([])

    useEffect(() => {
        fetchStages().then(setStages).catch(console.error)
    }, [])

    const sections = stages.map(stage => ({
        id: stage.id,
        sectionTitle: stage.name,
        speakers: stage.speakers
            .map(s => ({
                image: s.image,
                fullName: s.speaker,
                role: s.role,
                title: s.title,
                linkedIn: s.link ?? ""
            }))
    }))

    return (
        <div className='py-10 md:py-20 flex flex-col gap-6 md:gap-10 items-center w-full justify-center bg-surface-page '>
            <div className='flex flex-row flex-wrap items-center justify-center max-w-6xl w-full p-4 gap-16'>
                {sections.map(section => (
                    <div key={section.id} className="flex flex-col w-full gap-8">
                        <SpeakersStageGroup title={section.sectionTitle} speakers={section.speakers} />
                        <div className="px-4">
                            <SpeakersCtaBanner title={ctaTitle(section.sectionTitle)} />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default SpeakersSection
