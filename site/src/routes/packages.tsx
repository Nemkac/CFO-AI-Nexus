import AddIns from '@/components/sections/packages/AddIns'
import FeaturesSection from '@/components/sections/packages/Features'
import PackagesHeroSection from '@/components/sections/packages/Hero'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/packages')({ component: PackagesPage })

function PackagesPage() {
    return (
        <>
            <PackagesHeroSection />
            <FeaturesSection />
            <AddIns />
        </>
    )
}
