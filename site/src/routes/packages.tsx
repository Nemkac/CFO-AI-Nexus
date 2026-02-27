import AddIns from '@/components/sections/packages/AddIns'
import FeaturesSection from '@/components/sections/packages/Features'
import PackagesHeroSection from '@/components/sections/packages/Hero'
import PremiumFeaturesSection from '@/components/sections/packages/PremiumFeatures'
import SponsorshipPackages, { type SponsorshipRow } from '@/components/sections/packages/SponsorshipPackages'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/packages')({ component: PackagesPage })

const sponsorshipRows: SponsorshipRow[] = [
    { feature: 'Intent-based prospecting (AI-powered)', diamond: true, platinum: true, gold: true, exhibitor: true },
    { feature: 'Virtual booth', diamond: true, platinum: true, gold: true, exhibitor: true },
    { feature: 'Session or Workshop Host – Speaker', diamond: true, platinum: true, gold: true, exhibitor: true },
    { feature: 'Relevant 1:1 meetings, Q&A and Chats', diamond: true, platinum: true, gold: true, exhibitor: true },
    { feature: '5 conference passes for your team', diamond: true, platinum: true, gold: true, exhibitor: true },
    { feature: 'Digital presence and branding', diamond: true, platinum: true, gold: true, exhibitor: true },
    { feature: 'MQL Data & Analytics', diamond: true, platinum: true, gold: true, exhibitor: false },
    { feature: 'Breakout room arranged by us', diamond: true, platinum: true, gold: true, exhibitor: false },
    { feature: 'Pre-roll video', diamond: true, platinum: true, gold: true, exhibitor: false },
    { feature: '5 extra conference passes', diamond: true, platinum: true, gold: true, exhibitor: false },
    { feature: '5 Intent-Based Meetings arranged by us', diamond: true, platinum: true, gold: false, exhibitor: false },
    { feature: 'Booth and session priority positioning', diamond: true, platinum: true, gold: false, exhibitor: false },
    { feature: 'Viral presence and premium featuring', diamond: true, platinum: true, gold: false, exhibitor: false },
    { feature: '10 Intent-Based Meetings arranged by us', diamond: true, platinum: false, gold: false, exhibitor: false },
    { feature: 'Keynote Sponsor + Speaker', diamond: true, platinum: false, gold: false, exhibitor: false },
    { feature: 'Top positioning everywhere', diamond: true, platinum: false, gold: false, exhibitor: false },
    { feature: 'Powered by', diamond: true, platinum: false, gold: false, exhibitor: false },
]

function PackagesPage() {
    return (
        <>
            <PackagesHeroSection />
            <FeaturesSection />
            <PremiumFeaturesSection />
            <SponsorshipPackages rows={sponsorshipRows} />
            <AddIns />
        </>
    )
}
