// UTM / campaign attribution.
//
// Visitors usually land with ?utm_source=… on the home page and only register some
// clicks later, by which point the query string is gone. So we capture the campaign
// parameters on first load and keep them for the visit, then send them to Kit as
// custom fields when a form is submitted.
//
// The matching custom fields (utm_source, utm_medium, utm_campaign) must exist in the
// Kit account — Kit silently ignores fields it does not know.

const UTM_KEYS = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content'] as const

type UtmKey = (typeof UTM_KEYS)[number]
export type UtmParams = Partial<Record<UtmKey, string>>

const STORAGE_KEY = 'cfo_utm'

// localStorage rather than sessionStorage: an affiliate click and the eventual
// registration are often in different sessions, and we still want the attribution.
function readStore(): UtmParams {
    try {
        const raw = window.localStorage.getItem(STORAGE_KEY)
        return raw ? (JSON.parse(raw) as UtmParams) : {}
    } catch {
        return {}
    }
}

function writeStore(params: UtmParams) {
    try {
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(params))
    } catch {
        // storage blocked — attribution is best-effort, never break the page
    }
}

// Call once on app start. If the current URL carries campaign parameters they replace
// whatever was stored (last-touch attribution, matching what Kit's own forms record).
// If it does not, the previously stored campaign is left intact.
export function captureUtmParams(): void {
    if (typeof window === 'undefined') return

    const search = new URLSearchParams(window.location.search)
    const found: UtmParams = {}
    for (const key of UTM_KEYS) {
        const value = search.get(key)
        if (value) found[key] = value.slice(0, 200)
    }

    if (Object.keys(found).length > 0) writeStore(found)
}

// Campaign parameters to attach to a Kit subscriber, or {} when the visitor
// arrived without any.
export function getUtmFields(): UtmParams {
    if (typeof window === 'undefined') return {}
    return readStore()
}
