import { Link } from "@tanstack/react-router"
import Button from "@/components/ui/Button"
import CtaBanner from "@/components/ui/CtaBanner"
import Countdown from "@/components/ui/Countdown"
import { useOfferDeadline } from "@/components/layout/useOfferDeadline"

// Last CTA before the footer — counts down to the same offer deadline as the
// sticky top banner.
const FinalCtaSection = () => {
    const { deadline } = useOfferDeadline()

    return (
        <div className="py-10 md:py-20 flex items-center w-full justify-center bg-surface-page">
            <div className="max-w-6xl w-full p-4">
                <CtaBanner
                    eyebrow="October 20–21, 2026 · 100% virtual"
                    title="Save your seat before the price goes up"
                    titleSize="lg"
                >
                    <Countdown targetDate={deadline} />
                    <Link to="/checkout">
                        <Button className="px-10" label="Get Your Pass – $295" />
                    </Link>
                </CtaBanner>
            </div>
        </div>
    )
}

export default FinalCtaSection
