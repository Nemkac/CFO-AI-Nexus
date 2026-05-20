import Badge from '@/components/ui/badge'
import Button from '@/components/ui/Button'
import OpportunitiesCard from '@/components/ui/OpportunitiesCard'
import { Link } from '@tanstack/react-router'

const opportunities = [
    {
        title: "Host a Learning Session",
        description: `Take the Main Stage as a thought leader. Deliver a Keynote, lead a workshop, or host a "Demo Theatre" session to showcase your expertise.`,
        image: "./assets/opportunities/ConferenceSpeakingSlot.webp",
    },
    {
        title: "Your Virtual Booth",
        description: 'A full demand Generation engine, Live product demos, 1:1 video meetings, On-demand content, Q&A sessions',
        image: "./assets/opportunities/VirtualBooth.webp"
    },
    {
        title: `Intent-Based Meeting "Guarantor"`,
        description: "We help you succeed by scheduling meetings with pre-qualified leads. You don't just wait for visitors; we drive them to your booth.",
        image: "./assets/opportunities/IntentBasedMatchmakingAndEngagement.webp"
    },
    {
        title: "Real-Time Data & Analytics",
        description: "Access and export lead lists, booth visitor metrics, and engagement heatmaps in one click.",
        image: "./assets/opportunities/MQLData&Analytics.webp"
    },
    {
        title: "Premium Visibility",
        description: 'Choose from exclusive In-app announcements, 15-second pre-roll videos before top sessions, and "Top of the List" priority positioning.',
        image: './assets/opportunities/PremiumVisibility.webp'
    },
]

const OpportunitiesSection = () => {
    return (
        <div className="bg-linear-to-r from-pink-900 via-surface-page to-surface-secondary/30 py-10 md:py-20 flex items-center w-full justify-center">
            <div className='flex flex-col items-center justify-center max-w-6xl w-full p-4 gap-14'>
                <div className="flex flex-col items-center flex-wrap gap-6">
                    <Badge label='Double Your ROI with AI-Powered Matchmaking' />
                    <div className='flex flex-col gap-4 items-center text-center'>
                        <h2 className='text-h2 text-content-heading'>Exhibitor Opportunities</h2>
                        <p className='text-p-md text-content-heading text-balance'>Stop wasting time on "blind" networking. Our AI-Powered Prospecting analyzes the intent, interests, and behavior of every attendee to locate your high-value prospects.</p>
                    </div>
                    <Link to='/packages'>
                        <Button label='See Exhibitor & Sponsorship Packages' />
                    </Link>
                </div>
                <div className="flex flex-row flex-wrap items-stretch gap-6 justify-center">
                    {opportunities.map(opp => (
                        <OpportunitiesCard title={opp.title} description={opp.description} imageUrl={opp.image} />
                    ))}
                </div>
                <div className="flex flex-col items-center w-full gap-4">
                    <Link to='/packages'>
                        <Button label='See Exhibitor & Sponsorship Packages' />
                    </Link>
                    <p className="text-p-xsm text-content-heading">10.000+ finance leaders already trained</p>
                </div>
            </div>
        </div>
    )
}

export default OpportunitiesSection
