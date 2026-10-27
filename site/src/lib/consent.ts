// Cookie consent, shared by cfoainexus.com and promo.cfoainexus.com.
//
// Analytics (GA4 + Microsoft Clarity) are NOT present in the page markup — they are
// injected here, and only after the visitor consents. Before that, the only thing on
// the page is the Consent Mode v2 bootstrap in <head>, which loads nothing external.
//
// The consent cookie is written on the parent domain (.cfoainexus.com) so a choice
// made on one site is honoured on the other.

export type ConsentValue = 'granted' | 'denied'

const COOKIE_NAME = 'cfo_consent'
const COOKIE_MAX_AGE = 15552000 // 180 days
const PARENT_DOMAIN = '.cfoainexus.com'
const GA_ID = 'G-9S4P7SGE7G'

// The stub Clarity's hosted tag expects to find: a callable that queues its calls on
// `.q` until the real clarity.js takes over.
type ClarityFn = {
    (...args: unknown[]): void
    q?: IArguments[]
}

declare global {
    interface Window {
        dataLayer?: unknown[]
        gtag?: (...args: unknown[]) => void
        clarity?: ClarityFn
    }
}

// Sharing the cookie across subdomains requires the parent domain. On localhost a
// `domain` attribute would make the cookie invalid, so omit it in dev.
function cookieDomain(): string {
    return window.location.hostname.endsWith('cfoainexus.com') ? `; domain=${PARENT_DOMAIN}` : ''
}

function gtag(...args: unknown[]) {
    // Defined by the Consent Mode bootstrap in <head>.
    window.gtag?.(...args)
}

export function readConsent(): ConsentValue | null {
    const match = document.cookie.match(new RegExp(`(?:^|; )${COOKIE_NAME}=([^;]*)`))
    const value = match?.[1]
    return value === 'granted' || value === 'denied' ? value : null
}

function writeConsent(value: ConsentValue) {
    const secure = window.location.protocol === 'https:' ? '; Secure' : ''
    document.cookie = `${COOKIE_NAME}=${value}${cookieDomain()}; path=/; max-age=${COOKIE_MAX_AGE}; SameSite=Lax${secure}`
}

let analyticsLoaded = false

// Only ever called once the visitor has consented, so the Consent Mode update
// belongs here rather than at the call sites. It used to live in grantConsent alone,
// which meant a RETURNING visitor — cookie already 'granted', banner never shown —
// loaded GA while Consent Mode still sat at its denied default, and GA4 counted them
// as a cookieless ping instead of a user. Must run before gtag('config').
export function loadAnalytics(clarityId: string) {
    if (analyticsLoaded) return
    analyticsLoaded = true

    gtag('consent', 'update', { analytics_storage: 'granted' })

    // Google Analytics (GA4)
    const ga = document.createElement('script')
    ga.async = true
    ga.src = `https://www.googletagmanager.com/gtag/js?id=${GA_ID}`
    document.head.appendChild(ga)
    gtag('js', new Date())
    gtag('config', GA_ID)

    // Microsoft Clarity.
    //
    // The hosted tag at /tag/<id> does NOT define window.clarity — it assumes the
    // queueing stub from Microsoft's copy-paste snippet is already there and calls
    // window.clarity(...) on its very first line. Loading the tag on its own throws
    // "Cannot read properties of undefined (reading 'v')" before Clarity ever starts,
    // which is why the dashboard showed no sessions. Define the stub first.
    // Written exactly as Microsoft's snippet does it, queue included — the real
    // clarity.js drains window.clarity.q once it loads.
    if (!window.clarity) {
        window.clarity = function () {
            const fn = window.clarity!
            ;(fn.q = fn.q || []).push(arguments)
        }
    }
    const clarity = document.createElement('script')
    clarity.async = true
    clarity.src = `https://www.clarity.ms/tag/${clarityId}`
    document.head.appendChild(clarity)
}

// Remove the cookies GA and Clarity set, so withdrawal actually clears their state.
function clearAnalyticsCookies() {
    const names = document.cookie.split('; ').map((c) => c.split('=')[0])
    const host = window.location.hostname
    const domains = ['', `; domain=${host}`, `; domain=.${host}`, `; domain=${PARENT_DOMAIN}`]
    for (const name of names) {
        if (!/^(_ga|_gid|_gat|_clck|_clsk)/.test(name)) continue
        for (const domain of domains) {
            document.cookie = `${name}=; path=/${domain}; max-age=0`
        }
    }
}

export function grantConsent(clarityId: string) {
    writeConsent('granted')
    // The Consent Mode update is sent inside loadAnalytics — see the note there.
    loadAnalytics(clarityId)
}

export function revokeConsent() {
    writeConsent('denied')
    gtag('consent', 'update', { analytics_storage: 'denied' })
    clearAnalyticsCookies()
    // A script that has already run cannot be truly unloaded — reload so GA/Clarity
    // are not initialised again on the next page view.
    if (analyticsLoaded) window.location.reload()
}
