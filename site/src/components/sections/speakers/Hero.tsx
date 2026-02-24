import Badge from "@/components/ui/badge"
import Button from "@/components/ui/Button"

const SpeakersHeroSection = () => {
    return (
        <div className='flex flex-col w-full items-center justify-center py-10 md:py-30 bg-surface-page gap-6 p-4'>
            <Badge label="October 20–21, 2026 | 100% Virtual" />
            <div className="flex flex-col gap-1 items-center justify-center text-pretty max-w-4xl text-center">
                <h2 className="text-h1 text-content-heading text-balance">Speakers</h2>
                <p className="text-p-md text-content-body text-balance">Two days of world-class sessions, live product demos, and AI-driven networking — built to help CFOs and finance teams cut through the noise and find the tools reshaping modern finance.</p>
            </div>
            <div className="flex flex-col items-center gap-4">
                <Button label="Get your pass" />
                <p className="text-p-xsm text-content-heading">Save $200: Only 55 Super Early Bird passes remaining</p>
            </div>
        </div>
    )
}

export default SpeakersHeroSection
