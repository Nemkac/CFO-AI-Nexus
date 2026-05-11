import Button from '@/components/ui/Button'
import { useRegistration } from '@/promo/context/RegistrationContext'

const Footer = () => {
    const { openModal } = useRegistration()
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
                        <p className="text-h3 text-content-heading">The AI-Native finance departments of 2027 are being built right now.</p>
                        <p className="text-p-md text-content-body text-balance">Join 2,500+ finance professionals live on Tuesday, May 19, to master the implementation roadmap, or watch your competitors automate while you manage legacy chaos.</p>
                    </div>

                    {/* Right: button + cta */}
                    <div className="flex flex-col items-center gap-4">
                        <Button variant="sky" label="Reserve My Free Seat" onClick={openModal} />
                        <p className="text-p-md text-content-heading text-center">Joined by 10,000+ finance leaders.<br /> Seats are limited.</p>
                    </div>
                </div>

                {/* Bottom row: copyright | tagline */}
                <div className="flex flex-col sm:flex-row sm:justify-between gap-3">
                    <p className="text-p-sm text-content-heading">© 2026 Corporate Finance Hub</p>
                    <p className="text-p-sm text-content-heading">Built for finance leaders evolving into the AI era.</p>
                </div>

            </div>
        </footer>
    )
}

export default Footer