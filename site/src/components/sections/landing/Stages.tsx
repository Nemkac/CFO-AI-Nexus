import Button from "@/components/ui/Button"
import FilterButton from "@/components/ui/FilterButton"
import SpeakerCard from "@/components/ui/SpeakerCard"
import { useState } from "react"

const stages = ['Main Stage', 'FP & A', 'Financial Close & Consolidation', 'Treasury & Cash Management', 'AR/AP Automation']
const speakers = [
    {
        image: '/assets/speaker1.jpg',
        title: "The Autonomous Finance Office: Leveraging Gen-AI for 10x Operational Efficiency",
        speaker: "Bojan Radojičić",
        role: "Founder of CFO AI Nexus and Corporate Finance Hub",
        stage: ['Main Stage', 'FP & A']
    },
    {
        image: '/assets/speaker1.jpg',
        title: "The Autonomous Finance Office: Leveraging Gen-AI for 10x Operational Efficiency",
        speaker: "Bojan Radojičić",
        role: "Founder of CFO AI Nexus and Corporate Finance Hub",
        stage: ['FP & A']
    },
    {
        image: '/assets/speaker1.jpg',
        title: "The Autonomous Finance Office: Leveraging Gen-AI for 10x Operational Efficiency",
        speaker: "Bojan Radojičić",
        role: "Founder of CFO AI Nexus and Corporate Finance Hub",
        stage: ['Financial Close & Consolidation', 'FP & A']
    },
    {
        image: '/assets/speaker1.jpg',
        title: "The Autonomous Finance Office: Leveraging Gen-AI for 10x Operational Efficiency",
        speaker: "Bojan Radojičić",
        role: "Founder of CFO AI Nexus and Corporate Finance Hub",
        stage: ['Treasury & Cash Management', 'AR/AP Automation']
    },
    {
        image: '/assets/speaker1.jpg',
        title: "The Autonomous Finance Office: Leveraging Gen-AI for 10x Operational Efficiency",
        speaker: "Bojan Radojičić",
        role: "Founder of CFO AI Nexus and Corporate Finance Hub",
        stage: ['AR/AP Automation']
    },
]

const StagesSection = () => {

    const [activeStage, setActiveStage] = useState<string>('Main Stage');

    return (
        <div className="[background:radial-gradient(50%_80%_at_center,#1F2566,#040820)] md:[background:radial-gradient(40%_80%_at_top,#1F2566,#040820)] py-10 md:py-20 flex items-center w-full justify-center">
            <div className='flex flex-col items-center justify-center max-w-6xl w-full p-4 gap-14'>
                <div className="flex flex-col items-center flex-wrap gap-8">
                    <h2 className="text-h2 text-content-heading">Stages</h2>
                    <div className="flex flex-row gap-4 flex-wrap justify-center max-w-4xl ">
                        {stages.map(stage => (
                            <FilterButton key={stage} label={stage} variant={activeStage === stage ? 'active' : 'inactive'} onClick={() => setActiveStage(stage)} />
                        ))}
                    </div>
                </div>
                <div className="flex flex-row flex-wrap items-center gap-6 justify-center">
                    {speakers.filter(speaker => speaker.stage.some(stage => stage === activeStage)).map((speaker, i) => (
                        <SpeakerCard key={i} imageUrl={speaker.image} title={speaker.title} speaker={speaker.speaker} role={speaker.role} />
                    ))}
                </div>
                <div className="flex flex-col items-center w-full">
                    <Button label="View All Speakers" />
                </div>
            </div>
        </div>
    )
}

export default StagesSection
