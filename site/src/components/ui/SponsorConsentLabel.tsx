// The sponsor-sharing consent wording, with "here" linking to the sponsor page that
// names the sponsors the consent applies to.
//
// The plain-text source of truth lives in lib/kit.ts (and is what the recorded
// consent version refers to). This component only splits it around the word "here",
// so the two can never drift apart.

import { Link } from '@tanstack/react-router'
import {
    SPONSORS_PAGE_PATH,
    SPONSOR_CONSENT_TEXT_CHECKOUT,
    SPONSOR_CONSENT_TEXT_FORM,
} from '@/lib/kit'

type Props = {
    variant: 'checkout' | 'form'
    // Lets a host that overlays the page (the agenda modal) get out of the way when
    // the visitor follows the link.
    onNavigate?: () => void
}

const SponsorConsentLabel = ({ variant, onNavigate }: Props) => {
    const text = variant === 'checkout' ? SPONSOR_CONSENT_TEXT_CHECKOUT : SPONSOR_CONSENT_TEXT_FORM
    const [before, after] = text.split(/\bhere\b/)

    return (
        <>
            {before}
            <Link
                to={SPONSORS_PAGE_PATH}
                className="underline hover:text-pink-500"
                // The label is tied to the checkbox, so a click on the link would
                // otherwise toggle it as well.
                onClick={(e) => {
                    e.stopPropagation()
                    onNavigate?.()
                }}
            >
                here
            </Link>
            {after}
        </>
    )
}

export default SponsorConsentLabel
