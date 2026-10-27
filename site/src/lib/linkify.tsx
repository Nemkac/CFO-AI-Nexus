import type { ReactNode } from 'react'

// Turn bare email addresses and http(s) URLs in plain text into links. Emails open
// the mail app; URLs to other sites open in a new tab.
const EMAIL = /[\w.+-]+@[\w-]+\.[\w.-]*\w/
const URL = /https?:\/\/[^\s)]*[^\s).,;:!?'"]/
const TOKEN = new RegExp(`(${URL.source}|${EMAIL.source})`, 'g')

const OWN_HOST = 'cfoainexus.com'

export function linkify(text: string, className = 'text-pink-400 underline hover:text-pink-300'): ReactNode[] {
    return text.split(TOKEN).map((part, i) => {
        if (i % 2 === 0) return part

        if (/^https?:\/\//.test(part)) {
            const external = new globalThis.URL(part).hostname !== OWN_HOST
            return (
                <a
                    key={i}
                    href={part}
                    className={`${className} break-all`}
                    {...(external && { target: '_blank', rel: 'noopener noreferrer' })}
                >
                    {part}
                </a>
            )
        }

        return (
            <a key={i} href={`mailto:${part}`} className={className}>
                {part}
            </a>
        )
    })
}
