// Kit (ConvertKit) consent recording.
//
// Sponsor-sharing consent is recorded as a Kit tag. Kit stores the date the tag was
// added, and we additionally write the timestamp, the form it came from and the
// wording version into custom fields, so the proof of consent survives even if the
// tag is ever re-applied or exported without its metadata.
//
// The wording is versioned (SPONSOR_CONSENT_VERSION). Every consent record carries
// the version of the text the person actually saw — see SPONSOR_CONSENT_TEXT_* below.
// When the wording changes, bump the version so old and new consents stay
// distinguishable in Kit.
//
// Data-sharing rule: only subscribers carrying the sponsor-consent tag may be
// exported or shared with a sponsor.

const KIT_API_KEY = import.meta.env.VITE_KIT_API_KEY ?? ''
const SPONSOR_CONSENT_TAG_ID = import.meta.env.VITE_KIT_SPONSOR_CONSENT_TAG_ID ?? ''
const NEWSLETTER_TAG_ID = import.meta.env.VITE_KIT_NEWSLETTER_TAG_ID ?? ''

// Bumped from v1 when the generic "Share my details…" wording was replaced by the
// two explicit texts below, which name the data shared and link to the sponsor page.
export const SPONSOR_CONSENT_VERSION = 'v2'

// The public page listing the sponsors a consent applies to. The "here" in both
// consent texts links to it — the wording is only meaningful alongside that list.
export const SPONSORS_PAGE_PATH = '/sponsors-and-exhibitors'

// Checkout: the form collects name, work email, company and job title, so the
// consent names those fields exactly.
export const SPONSOR_CONSENT_TEXT_CHECKOUT =
    'I agree that CFO AI Nexus may share my name, work email, company and job title with the participating sponsors identified here, so they may contact me about their products and services. I can withdraw my consent at any time.'

// Shorter forms (agenda download, lead magnets) collect a varying set of fields, so
// the consent refers to "the contact details provided on this form".
export const SPONSOR_CONSENT_TEXT_FORM =
    'I agree that CFO AI Nexus may share the contact details provided on this form with the participating sponsors identified here, so they may contact me about their products and services. I can withdraw my consent at any time.'

export const NEWSLETTER_CONSENT_TEXT = "I'd like to receive the CFO AI Nexus newsletter"

// Which form the consent was given on — stored with the consent so we can point at
// the exact wording the person agreed to.
export type SponsorConsentSource = 'checkout' | 'agenda-modal'

// Adding a tag also creates the subscriber if they do not exist yet.
// Never throws and never blocks a form submission — consent recording must not be
// able to stop a purchase or a download from completing.
async function addTag(
    tagId: string,
    label: string,
    email: string,
    firstName?: string,
    fields?: Record<string, string>,
): Promise<void> {
    if (!tagId) {
        console.warn(`Kit tag ID for "${label}" is not configured — consent was NOT recorded.`)
        return
    }
    try {
        const res = await fetch(`https://api.convertkit.com/v3/tags/${tagId}/subscribe`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                api_key: KIT_API_KEY,
                email,
                ...(firstName ? { first_name: firstName } : {}),
                ...(fields ? { fields } : {}),
            }),
        })
        if (!res.ok) {
            const data = await res.json().catch(() => ({}))
            console.warn(`Kit tagging failed for "${label}":`, data?.message ?? res.status)
        }
    } catch (err) {
        console.warn(`Kit tagging errored for "${label}":`, err)
    }
}

// The custom fields below must exist in Kit (Subscribers → Custom fields) with these
// exact keys, otherwise Kit silently drops them and only the tag date remains.
export const recordSponsorConsent = (
    email: string,
    firstName: string | undefined,
    source: SponsorConsentSource,
) =>
    addTag(SPONSOR_CONSENT_TAG_ID, 'sponsor-consent', email, firstName, {
        sponsor_consent_at: new Date().toISOString(),
        sponsor_consent_source: source,
        sponsor_consent_version: SPONSOR_CONSENT_VERSION,
    })

export const recordNewsletterOptIn = (email: string, firstName?: string) =>
    addTag(NEWSLETTER_TAG_ID, 'newsletter', email, firstName)