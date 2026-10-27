import { useMemo } from 'react'
import { useMainContent } from './MainContentContext'
import { ceWallTimeToUtc } from '@/lib/conferenceTime'

// Fallback — must mirror what the CMS currently serves, so a failed fetch
// degrades to the same offer rather than a stale one.
export const FALLBACK_OFFER_DATE = '2026-09-15'

// The date the current ticket offer ends, as set in the CMS banner. Shared by the
// sticky top banner and the pre-footer CTA so both count down to the same moment.
export function useOfferDeadline() {
    const cms = useMainContent()
    const isoDate = cms?.banner?.date || FALLBACK_OFFER_DATE

    // Count down to the start of the day in Central European time (not midnight
    // UTC), so the countdown isn't an hour or two off.
    const deadline = useMemo(() => ceWallTimeToUtc(`${isoDate}T00:00`), [isoDate])

    return { isoDate, deadline }
}
