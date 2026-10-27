// Single source of truth for the sponsor line-up, shared by the landing-page
// Partners section and the /sponsors-and-exhibitors page.
//
// The consent texts in lib/kit.ts refer to "the participating sponsors identified
// here" — that list is this one, rendered on the sponsor page. Adding a sponsor here
// widens the scope of every sponsor-sharing consent, so a new entry only belongs
// here once the sponsorship is signed.

export type SponsorTier = 'Diamond' | 'Platinum' | 'Gold' | 'Exhibitor' | 'Knowledge'

export type Sponsor = {
    name: string
    logo: string
    link: string
    tier: SponsorTier
    // Shown on the sponsor page only; the landing-page cards stay logo-and-name.
    // Optional: a partner with no blurb yet renders as logo-and-name on both pages.
    description?: string
}

export const sponsors: Sponsor[] = [
    {
        name: 'Una AI',
        logo: '/assets/Una%20AI-Logo-2026_Horizontal-Primary.png',
        link: 'https://www.una.ai/',
        tier: 'Diamond',
        description:
            'AI-powered FP&A platform that unifies revenue, operations and finance data, giving CFOs continuous, connected forecasting and execution accountability.',
    },
    {
        name: 'Adaptive from Workday',
        logo: '/assets/Adaptive_wday_logo_primary-RGB.png',
        link: 'https://www.workday.com/en-us/products/adaptive-planning/overview.html',
        tier: 'Platinum',
        description:
            'AI-powered EPM software that helps organizations handle budgeting, forecasting, and financial reporting.',
    },
    {
        name: 'Ramp',
        logo: '/assets/Ramp-Lockup-RGB-Slate-0125.png',
        link: 'https://ramp.com/',
        tier: 'Exhibitor',
        description:
            'All-in-one spend management platform combining corporate cards, expense management, accounts payable and accounting automation.',
    },
    {
        name: 'Simplify',
        logo: '/assets/partners/simplify-logo-dark.png',
        link: 'https://www.simplify.rs/en/',
        tier: 'Knowledge',
    },
    {
        name: 'WTS',
        logo: '/assets/partners/wts-logo-red-150-e1751398784241.png',
        link: 'https://wtsserbia.com/en/home/',
        tier: 'Knowledge',
    },
]

// Ordered as they appear. Tiers with no sponsors — or not listed on the surface
// being rendered — are skipped, and the rest fill a two-column grid in this order.
// Gold is empty today; populating it would push the pairing along by one, so revisit
// this order if that happens.
export const tiers: {
    tier: SponsorTier
    // Section heading, the same on every surface.
    title: string
    // Printed above the logo on the sponsor page.
    badge: string
    // Which surfaces list this tier. The sponsor page is the list the sponsor-sharing
    // consent points at ("the participating sponsors identified here" in lib/kit.ts),
    // so a tier left off that page is outside the scope of that consent.
    showOn: ('landing' | 'page')[]
}[] = [
    { tier: 'Diamond', title: 'Diamond Sponsor', badge: 'Diamond Partner', showOn: ['landing', 'page'] },
    { tier: 'Platinum', title: 'Platinum Sponsor', badge: 'Platinum Partner', showOn: ['landing', 'page'] },
    { tier: 'Gold', title: 'Gold Sponsors', badge: 'Gold Partner', showOn: ['landing', 'page'] },
    { tier: 'Exhibitor', title: 'Exhibitor', badge: 'Exhibitor', showOn: ['landing', 'page'] },
    { tier: 'Knowledge', title: 'Knowledge Partners', badge: 'Knowledge Partner', showOn: ['landing'] },
]
