import Button from "@/components/ui/Button"

const PackagesHeroSection = () => {
    return (
        <div className='flex flex-col w-full items-center justify-center py-10 md:py-30 bg-surface-page gap-6 p-4'>
            <div className="flex flex-col gap-1 items-center justify-center text-pretty max-w-4xl text-center">
                <h2 className="text-h1 text-content-heading text-balance">Where High-Tier Innovators Meet High-Intent Buyers.</h2>
                <p className="text-p-md text-content-body text-balance">Connect with a curated community of C-suite executives with verified budget authority through our intelligent matchmaking system, designed to align your solutions with their strategic needs.</p>
            </div>
            <div className="flex flex-col items-center gap-4">
                <Button label="Apply for Partnership" />
                <p className="text-p-xsm text-content-heading">Are you an innovator? Join the exclusive 30. Apply here.</p>
            </div>
        </div>
    )
}

export default PackagesHeroSection
