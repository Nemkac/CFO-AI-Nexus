const WP_BASE = import.meta.env.VITE_WP_API_URL ?? 'http://cfo-ai-nexus.local/wp-json/wp/v2'

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