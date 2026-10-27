// Reads the GA4 identifiers out of Google's own cookies so a purchase reported
// from the Stripe webhook can be joined to the browsing session that produced it.
//
// The purchase event itself is NOT sent from the browser — see
// site/functions/src/ga4.ts for why. All this does is hand GA's ids to the server.
//
// Both ids are best-effort: GA is consent-gated (see consent.ts), so a visitor who
// declined analytics cookies has no _ga cookie at all. The server falls back to a
// synthetic client id in that case, and the sale is still counted — just
// unattributed.

const GA_MEASUREMENT_ID = 'G-9S4P7SGE7G'
// The session cookie is named after the measurement id minus its `G-` prefix.
const GA_SESSION_COOKIE = `_ga_${GA_MEASUREMENT_ID.replace(/^G-/, '')}`

function readCookie(name: string): string | undefined {
    const match = document.cookie.match(new RegExp(`(?:^|; )${name}=([^;]*)`))
    return match?.[1] ? decodeURIComponent(match[1]) : undefined
}

export type GaIds = { gaClientId?: string; gaSessionId?: string }

export function getGaIds(): GaIds {
    if (typeof document === 'undefined') return {}

    const ids: GaIds = {}

    // `_ga` is `GA1.1.<random>.<timestamp>`. The server parses the id out of the
    // raw value, so pass it through untouched rather than guessing the format twice.
    const ga = readCookie('_ga')
    if (ga) ids.gaClientId = ga

    // `_ga_<ID>` is `GS1.1.<session_id>.<session_number>.…` — the third field is the
    // session id GA4 expects.
    const session = readCookie(GA_SESSION_COOKIE)
    const sessionId = session?.split('.')[2]
    if (sessionId && /^\d+$/.test(sessionId)) ids.gaSessionId = sessionId

    return ids
}
