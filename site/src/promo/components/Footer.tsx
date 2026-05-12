import Button from '@/components/ui/Button'
import { useRegistration } from '@/promo/context/RegistrationContext'
import type { PromoData } from '@/lib/wordpress'

const Footer = ({ cmsData }: { cmsData?: PromoData['footer'] }) => {
    const { openModal } = useRegistration()
    const title = cmsData?.title ?? 'The AI-Native finance departments of 2027 are being built right now.'
    const description = cmsData?.subtitle ?? 'Join 2,500+ finance professionals live on Tuesday, May 19, to master the implementation roadmap, or watch your competitors automate while you manage legacy chaos.'
    const buttonLabel = cmsData?.button_text ?? 'Reserve My Free Seat'
    const subtext = cmsData?.button_subtext ?? 'Joined by 10,000+ finance leaders.\nSeats are limited.'
    const copyright = cmsData?.copyright ?? '© 2026 Corporate Finance Hub'
    const tagline = cmsData?.tagline ?? 'Built for finance leaders evolving into the AI era.'

    return (
        <footer className="relative overflow-hidden bg-linear-to-r from-surface-page to-sapphire-800 border-t border-white/10 px-6 py-14">

            {/* Watermark logo */}
            <img
                src="/assets/behind_logo.svg"
                alt=""
                aria-hidden
                className="absolute inset-0 w-full h-full object-cover brightness-0 invert opacity-15 pointer-events-none select-none"
            />

            <div className="relative z-10 max-w-6xl mx-auto flex flex-col gap-8">

                {/* Top row */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-8">
                    {/* Left: logo + title + description */}
                    <div className="flex flex-col gap-6 items-start max-w-sm">
                        <img src="/assets/logo.svg" alt="CFO AI Nexus" className="h-8 w-auto" />
                        <p className="text-h3 text-content-heading">{title}</p>
                        <p className="text-p-md text-content-body text-balance whitespace-pre-line">{description}</p>
                    </div>

                    {/* Right: button + cta */}
                    <div className="flex flex-col items-center gap-4">
                        <Button variant="sky" label={buttonLabel} onClick={openModal} />
                        <p className="text-p-md text-content-heading text-center whitespace-pre-line">{subtext}</p>
                    </div>
                </div>

                {/* Bottom row: copyright | tagline */}
                <div className="flex flex-col sm:flex-row sm:justify-between gap-3">
                    <p className="text-p-sm text-content-heading">{copyright}</p>
                    <p className="text-p-sm text-content-heading">{tagline}</p>
                </div>

            </div>
        </footer>
    )
}

export default Footer