const WP_BASE = import.meta.env.VITE_WP_API_URL ?? 'http://cfo-ai-nexus.local/wp-json/wp/v2'
const WP_BASE_RAW = WP_BASE.endsWith('/wp/v2') ? WP_BASE.slice(0, -6) : WP_BASE

export type WPSpeaker = {
    image: string
    speaker: string
    role: string
    title: string
    stage: string[]
    link?: string
}

export type WPVendor = {
    image: string
    title: string
    description: string
    types: string[]
    link: string
}

export async function fetchSpeakers(): Promise<WPSpeaker[]> {
    const res = await fetch(`${WP_BASE}/speakers?per_page=100&orderby=menu_order&order=asc`)
    if (!res.ok) throw new Error('Failed to fetch speakers')
    const data = await res.json()
    return data.map((item: any): WPSpeaker => ({
        image:   item.featured_image_url    ?? '',
        speaker: item.speaker_name          ?? item.meta?.speaker_name   ?? '',
        role:    item.speaker_role          ?? item.meta?.speaker_role   ?? '',
        title:   item.title.rendered        ?? '',
        stage:   item.speaker_stages        ?? item.meta?.speaker_stages ?? [],
        link:    item.speaker_link          ?? item.meta?.speaker_link   ?? undefined,
    }))
}

export type PromoNumberCard = { number: string; label: string; description: string }
export type PromoSessionCard = { icon: string; title: string; description: string }

export type PromoData = {
    hero: {
        conference_datetime: string
        banner_text: string
        badge: string
        jumbo: string
        subtitle: string
        description: string
        button_text: string
        image: string
        image_caption: string
    }
    numbers: {
        title: string
        subtitle: string
        cards: PromoNumberCard[]
    }
    inside: {
        title: string
        cards: PromoSessionCard[]
    }
    carousel: {
        title: string
        subtitle: string
        images: string[]
    }
    costs: {
        title: string
        subtitle: string
        without_title: string
        without_points: string[]
        with_title: string
        with_points: string[]
    }
    footer: {
        title: string
        subtitle: string
        button_text: string
        button_subtext: string
        copyright: string
        tagline: string
    }
    registration: {
        kit_form_id: string
        kit_form_uid?: string
    }
}

export async function fetchPromoContent(): Promise<PromoData> {
    const res = await fetch(`${WP_BASE_RAW}/cfo/v1/promo`, { cache: 'no-store' })
    if (!res.ok) throw new Error('Failed to fetch promo content')
    return res.json()
}

export async function fetchVendors(): Promise<WPVendor[]> {
    const res = await fetch(`${WP_BASE}/vendors?per_page=100&orderby=menu_order&order=asc`)
    if (!res.ok) throw new Error('Failed to fetch vendors')
    const data = await res.json()
    return data.map((item: any): WPVendor => ({
        image:       item.featured_image_url      ?? '',
        title:       item.title.rendered           ?? '',
        description: item.vendor_description       ?? item.meta?.vendor_description ?? '',
        types:       item.vendor_types             ?? item.meta?.vendor_types       ?? [],
        link:        item.vendor_link              ?? item.meta?.vendor_link         ?? '',
    }))
}