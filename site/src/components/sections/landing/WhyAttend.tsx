import Button from "@/components/ui/Button"
import WhyAttendCard from "@/components/ui/WhyAttendCard"

const reasons = [
    { icon: <img src="/icons/whyAttendIcon-1.svg" />, title: "Leading Voices\nin Finance AI", description: "Access exclusive keynote\nfrom Silicon Valley\ninnovators and Global 500\nCFOs." },
    { icon: <img src="/icons/whyAttendIcon-2.svg" />, title: "High-Engagement\nVirtual Booths", description: "Don't just watch—interact.\nEngage in live software\ndeep-dives, private Q&A,\nand instant 1:1 video\nconsultations." },
    { icon: <img src="/icons/whyAttendIcon-3.svg" />, title: "Intent-Based\nMatchmaking", description: "Our AI algorithm analyzes\nyour professional goals to\nconnect you with the exact\npeers and partners you\nneed to meet." },
    { icon: <img src="/icons/whyAttendIcon-4.svg" />, title: "The 2026 Tech\nStack Review", description: "Compare the newest AI\nsolutions for ERP, FP&A,\nand Treasury in one virtual\nwalk-through." },
]

const WhyAttendSection = () => {
    return (
        <div className='py-10 md:py-20 flex flex-col gap-6 md:gap-10 items-center w-full justify-center bg-surface-page '>
            <h2 className="text-h2 text-content-heading">Why Attend CFO AI Nexus?</h2>
            <div className='flex flex-row flex-wrap items-center justify-center max-w-6xl w-full p-4 gap-16'>
                {reasons.map(reason => (
                    <WhyAttendCard icon={reason.icon} title={reason.title} description={reason.description} />
                ))}
            </div>
            <div className="flex flex-col items-center gap-4">
                <Button label="Get your pass" />
                <p className="text-p-xsm text-content-heading">Save $200: Only 55 Super Early Bird passes remaining</p>
            </div>
        </div>
    )
}

export default WhyAttendSection
