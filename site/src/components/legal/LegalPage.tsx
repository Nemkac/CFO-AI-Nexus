import { useEffect, useMemo } from 'react'
import { usePageLoad } from '@/components/layout/PageLoadContext'

// The legal texts are plain text, one heading/paragraph/bullet per line. We parse that
// structure into blocks so the pages render with real typography instead of a wall of text.
//
//   "1. DEFINITIONS"      -> section heading
//   "2.1 Registration"    -> sub-heading
//   "•  Something"        -> bullet (consecutive bullets group into one list)
//   "IF YOU DO NOT ..."   -> all-caps legal emphasis, rendered as a callout
//   anything else         -> paragraph

const PUBLISH_DATE = 'July 13, 2026'

type Block =
    | { kind: 'h2'; text: string }
    | { kind: 'h3'; text: string }
    | { kind: 'callout'; text: string }
    | { kind: 'bullets'; items: string[] }
    | { kind: 'p'; text: string }

function isAllCaps(line: string): boolean {
    const letters = line.replace(/[^A-Za-z]/g, '')
    return letters.length > 20 && letters === letters.toUpperCase()
}

function parseLegalText(raw: string) {
    const lines = raw
        .replaceAll('[INSERT PUBLISH DATE]', PUBLISH_DATE)
        .split('\n')
        .map((l) => l.trim())
        .filter(Boolean)

    const title = lines[0] ?? ''
    const meta: string[] = []
    const blocks: Block[] = []

    let i = 1
    while (i < lines.length && /^(last updated|effective date)\s*:/i.test(lines[i])) {
        meta.push(lines[i])
        i++
    }

    for (; i < lines.length; i++) {
        const line = lines[i]

        if (/^\d+\.\d+\s+/.test(line)) {
            blocks.push({ kind: 'h3', text: line })
        } else if (/^\d+\.\s+/.test(line)) {
            blocks.push({ kind: 'h2', text: line })
        } else if (/^•/.test(line)) {
            const items: string[] = []
            while (i < lines.length && /^•/.test(lines[i])) {
                items.push(lines[i].replace(/^•\s*/, ''))
                i++
            }
            i-- // step back; the for-loop will advance past the last bullet
            blocks.push({ kind: 'bullets', items })
        } else if (isAllCaps(line)) {
            blocks.push({ kind: 'callout', text: line })
        } else {
            blocks.push({ kind: 'p', text: line })
        }
    }

    return { title, meta, blocks }
}

// Turn bare email addresses into mailto links.
function withEmailLinks(text: string) {
    const parts = text.split(/([\w.+-]+@[\w-]+\.[\w.]+)/g)
    return parts.map((part, i) =>
        /^[\w.+-]+@[\w-]+\.[\w.]+$/.test(part) ? (
            <a key={i} href={`mailto:${part}`} className="text-pink-400 underline hover:text-pink-300">
                {part}
            </a>
        ) : (
            part
        )
    )
}

const LegalPage = ({ raw }: { raw: string }) => {
    const { signalReady } = usePageLoad()
    const { title, meta, blocks } = useMemo(() => parseLegalText(raw), [raw])

    useEffect(() => {
        signalReady()
    }, [])

    return (
        <div className="w-full bg-surface-page px-6 py-16">
            <article className="mx-auto flex max-w-3xl flex-col">
                <h1 className="text-h2 text-content-heading text-balance">{title}</h1>

                {meta.length > 0 && (
                    <div className="mt-3 flex flex-col gap-0.5 border-b border-white/10 pb-6">
                        {meta.map((line) => (
                            <p key={line} className="text-p-sm text-content-secondary">
                                {line}
                            </p>
                        ))}
                    </div>
                )}

                <div className="mt-8 flex flex-col">
                    {blocks.map((block, i) => {
                        switch (block.kind) {
                            case 'h2':
                                return (
                                    <h2
                                        key={i}
                                        className="text-h4 text-content-heading mt-10 mb-3 first:mt-0 scroll-mt-40"
                                    >
                                        {block.text}
                                    </h2>
                                )
                            case 'h3':
                                return (
                                    <h3 key={i} className="text-p-lg-semibold text-content-heading mt-6 mb-2">
                                        {block.text}
                                    </h3>
                                )
                            case 'callout':
                                return (
                                    <p
                                        key={i}
                                        className="text-p-sm-semibold text-content-heading my-5 rounded-r-lg border-l-4 border-pink-500 bg-white/5 px-5 py-4"
                                    >
                                        {block.text}
                                    </p>
                                )
                            case 'bullets':
                                return (
                                    <ul key={i} className="my-3 flex flex-col gap-2 pl-1">
                                        {block.items.map((item, j) => (
                                            <li key={j} className="text-p-md text-content-body flex gap-3">
                                                <span aria-hidden className="mt-2 size-1.5 shrink-0 rounded-full bg-pink-500" />
                                                <span>{withEmailLinks(item)}</span>
                                            </li>
                                        ))}
                                    </ul>
                                )
                            default:
                                return (
                                    <p key={i} className="text-p-md text-content-body mb-4 leading-relaxed">
                                        {withEmailLinks(block.text)}
                                    </p>
                                )
                        }
                    })}
                </div>
            </article>
        </div>
    )
}

export default LegalPage
