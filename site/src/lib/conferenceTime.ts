// Conference time handling.
//
// The WordPress date/time picker stores a naive "YYYY-MM-DDTHH:mm" string with no
// timezone. We interpret that wall-clock time as **Central European** time
// (CET in winter / CEST in summer) — the anchor timezone the team enters in.
// From that we derive the absolute instant (used by the countdown) and the
// display strings, so the countdown always reaches zero at the moment shown and
// stays correct across daylight-saving changes.

const CE_TZ = 'Europe/Belgrade' // Central Europe — CET / CEST
const ET_TZ = 'America/New_York' // US Eastern — EST / EDT

// Offset (zone − UTC) in minutes at a given absolute instant.
function tzOffsetMinutes(timeZone: string, date: Date): number {
    const dtf = new Intl.DateTimeFormat('en-US', {
        timeZone, hour12: false,
        year: 'numeric', month: '2-digit', day: '2-digit',
        hour: '2-digit', minute: '2-digit', second: '2-digit',
    })
    const p: Record<string, string> = {}
    for (const part of dtf.formatToParts(date)) p[part.type] = part.value
    const asUTC = Date.UTC(+p.year, +p.month - 1, +p.day, +p.hour % 24, +p.minute, +p.second)
    return (asUTC - date.getTime()) / 60000
}

// Interpret a naive "YYYY-MM-DDTHH:mm" string as Central-European wall time and
// return the corresponding absolute instant (DST-aware).
export function ceWallTimeToUtc(naiveIso: string): Date {
    const clean = naiveIso.replace('Z', '')
    const withSeconds = /T\d{2}:\d{2}$/.test(clean) ? `${clean}:00` : clean
    const guess = new Date(`${withSeconds}Z`) // pretend the wall time is UTC
    const offset = tzOffsetMinutes(CE_TZ, guess) // CE offset around that instant
    return new Date(guess.getTime() - offset * 60000) // shift to the true UTC instant
}

function partsInZone(date: Date, timeZone: string) {
    const dtf = new Intl.DateTimeFormat('en-US', {
        timeZone, hour12: false, weekday: 'long',
        year: 'numeric', month: 'long', day: 'numeric',
        hour: '2-digit', minute: '2-digit',
    })
    const p: Record<string, string> = {}
    for (const part of dtf.formatToParts(date)) p[part.type] = part.value
    return p // weekday, month (name), day, year, hour (00–23), minute
}

function to12(hour: string, minute: string, label: string): string {
    const h = +hour % 24
    const ampm = h >= 12 ? 'PM' : 'AM'
    const h12 = h % 12 === 0 ? 12 : h % 12
    return `${h12}:${minute} ${ampm} ${label}`
}

export type ConferenceTime = {
    instant: Date          // absolute moment — feed this to the countdown
    displayDateLong: string  // "Wednesday, July 15, 2026"
    displayDateShort: string // "Wednesday, July 15"
    displayTime: string      // "11:00 AM EST (5:00 PM CET)"
}

// Format a naive Central-European datetime into the instant + display strings.
export function formatConferenceTime(naiveIso: string): ConferenceTime {
    const instant = ceWallTimeToUtc(naiveIso)
    const ce = partsInZone(instant, CE_TZ)
    const et = partsInZone(instant, ET_TZ)
    return {
        instant,
        displayDateLong: `${ce.weekday}, ${ce.month} ${ce.day}, ${ce.year}`,
        displayDateShort: `${ce.weekday}, ${ce.month} ${ce.day}`,
        displayTime: `${to12(et.hour, et.minute, 'EST')} (${to12(ce.hour, ce.minute, 'CET')})`,
    }
}
