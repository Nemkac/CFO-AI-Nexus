// Optional consent checkbox. Always unchecked by default and never required —
// the surrounding form must submit whether or not it is ticked.

import { useEffect, useRef } from 'react'

type Props = {
    id: string
    checked: boolean
    onChange: (checked: boolean) => void
    children: React.ReactNode
    className?: string
}

const ConsentCheckbox = ({ id, checked, onChange, children, className = '' }: Props) => {
    const ref = useRef<HTMLInputElement>(null)

    // On a reload the browser restores the previous checked state into the DOM, and
    // React's hydration does not overwrite it — the box would come back ticked while
    // our state says false. autoComplete="off" asks the browser not to, and this
    // forces the DOM back in line for the browsers that ignore it.
    useEffect(() => {
        if (ref.current && ref.current.checked !== checked) ref.current.checked = checked
    }, [checked])

    return (
        <div className="flex flex-row gap-4 items-start">
            <input
                ref={ref}
                type="checkbox"
                id={id}
                checked={checked}
                autoComplete="off"
                onChange={(e) => onChange(e.target.checked)}
                className="mt-1 cursor-pointer shrink-0"
            />
            <label htmlFor={id} className={`text-p-md text-content-heading text-pretty cursor-pointer ${className}`}>
                {children}
            </label>
        </div>
    )
}

export default ConsentCheckbox
