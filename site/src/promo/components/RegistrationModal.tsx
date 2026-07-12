import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import * as Select from '@radix-ui/react-select'
import ReactCountryFlag from 'react-country-flag'
import { countries } from 'countries-list'
import { ChevronDown, Check } from 'lucide-react'
import { ALLOWED_COUNTRY_CODES } from '@/data/blockedCountries'
import { formatConferenceTime } from '@/lib/conferenceTime'

const countryList = (Object.entries(countries) as [string, { name: string }][])
    .filter(([code]) => ALLOWED_COUNTRY_CODES.has(code))
    .map(([code, data]) => ({ code, name: data.name }))
    .sort((a, b) => a.name.localeCompare(b.name))

const JOB_TITLE_OPTIONS = [
    'CFO',
    'VP/Director/Head of Finance',
    'Head of FP&A',
    'Accounting Manager/Lead',
    'Senior Finance Manager/Lead',
    'Finance Professional (Senior)',
    'Other C-Suite',
    'Other',
]

type Props = {
    open: boolean
    onClose: () => void
    kitFormId?: string
    kitFormUid?: string
    title?: string
    subtext?: string
    conferenceDatetime?: string
}

const KIT_API_KEY = import.meta.env.VITE_KIT_API_KEY ?? ''

const FALLBACK_DATETIME = '2026-05-19T16:00'

function formatModalDatetime(iso: string) {
    const { displayDateShort, displayTime } = formatConferenceTime(iso)
    return `${displayDateShort} | ${displayTime}`
}

const labelClass = 'text-p-md text-black/70 font-medium'

const Field = ({ label, children }: { label: string; children: React.ReactNode }) => (
    <div className="flex flex-col gap-1.5 w-full">
        <label className={labelClass}>{label}</label>
        {children}
    </div>
)

const FilledInput = ({
    type,
    placeholder,
    value,
    onChange,
}: {
    type: string
    placeholder: string
    value: string
    onChange: (v: string) => void
}) => {
    const [focused, setFocused] = useState(false)
    return (
        <input
            type={type}
            placeholder={placeholder}
            value={value}
            onChange={e => onChange(e.target.value)}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            className={`rounded-xl border px-4 py-3.5 w-full outline-none bg-white text-p-md text-black placeholder:text-black/35 transition-colors ${focused || value ? 'border-pink-500' : 'border-black/15'}`}
        />
    )
}

const StyledSelect = ({
    value,
    onChange,
    placeholder,
    options,
}: {
    value: string
    onChange: (v: string) => void
    placeholder: string
    options: string[]
}) => (
    <Select.Root value={value} onValueChange={onChange}>
        <Select.Trigger
            className={`flex items-center justify-between gap-2 rounded-xl border px-4 py-3.5 w-full outline-none bg-white text-p-md cursor-pointer transition-colors ${value ? 'border-pink-500 text-black' : 'border-black/15 text-black/35'}`}
        >
            <span className="truncate text-left">
                <Select.Value placeholder={placeholder} />
            </span>
            <Select.Icon>
                <ChevronDown className="size-4 text-black/40 shrink-0" />
            </Select.Icon>
        </Select.Trigger>
        <Select.Portal>
            <Select.Content
                position="popper"
                sideOffset={4}
                style={{ width: 'var(--radix-select-trigger-width)' }}
                className="z-60 bg-white border border-black/10 rounded-xl shadow-xl overflow-hidden"
            >
                <Select.Viewport className="max-h-52 overflow-y-auto p-1">
                    {options.map(opt => (
                        <Select.Item
                            key={opt}
                            value={opt}
                            className="flex items-center justify-between gap-3 px-4 py-2.5 rounded-lg cursor-pointer text-p-md text-black outline-none data-highlighted:bg-black/5 data-[state=checked]:bg-black/8"
                        >
                            <Select.ItemText>{opt}</Select.ItemText>
                            <Select.ItemIndicator>
                                <Check className="size-4 text-pink-500" />
                            </Select.ItemIndicator>
                        </Select.Item>
                    ))}
                </Select.Viewport>
            </Select.Content>
        </Select.Portal>
    </Select.Root>
)

const triggerKitFormAndWait = (uid: string, email: string): Promise<void> =>
    new Promise(resolve => {
        const attempt = (retriesLeft: number) => {
            const form = document.querySelector<HTMLFormElement>(`form[data-uid="${uid}"]`)
            if (!form) {
                if (retriesLeft > 0) setTimeout(() => attempt(retriesLeft - 1), 300)
                else resolve()
                return
            }
            const emailInput = form.querySelector<HTMLInputElement>('input[type="email"], input[name="email_address"]')
            if (emailInput) {
                const setter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value')?.set
                setter?.call(emailInput, email)
                emailInput.dispatchEvent(new Event('input', { bubbles: true }))
            }
            const submitBtn = form.querySelector<HTMLButtonElement>('button[type="submit"], input[type="submit"]')
            if (submitBtn) submitBtn.click()
            else form.dispatchEvent(new SubmitEvent('submit', { bubbles: true, cancelable: true }))
            setTimeout(resolve, 1500)
        }
        attempt(10)
    })

const RegistrationModal = ({ open, onClose, kitFormId, kitFormUid, title, subtext, conferenceDatetime }: Props) => {
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [jobTitle, setJobTitle] = useState('')
    const [country, setCountry] = useState('')
    const [loading, setLoading] = useState(false)
    const [submitted, setSubmitted] = useState(false)
    const [error, setError] = useState('')

    useEffect(() => {
        if (open) document.body.style.overflow = 'hidden'
        else document.body.style.overflow = ''
        return () => { document.body.style.overflow = '' }
    }, [open])

    useEffect(() => {
        if (!open) {
            const id = setTimeout(() => {
                setName('')
                setEmail('')
                setJobTitle('')
                setCountry('')
                setError('')
                setSubmitted(false)
            }, 300)
            return () => clearTimeout(id)
        }
    }, [open])

    const handleSubmit = async (e: { preventDefault(): void }) => {
        e.preventDefault()
        if (!name || !email || !jobTitle || !country) {
            setError('Please fill in all fields.')
            return
        }
        if (!kitFormId && !kitFormUid) {
            setError('Registration is not configured yet. Please try again later.')
            return
        }
        setLoading(true)
        setError('')

        const countryName = countryList.find(c => c.code === country)?.name ?? country

        try {
            // Step 1: submit through Kit's own JS so analytics are tracked natively
            if (kitFormUid) await triggerKitFormAndWait(kitFormUid, email)

            // Step 2: upsert subscriber with custom fields via V3 API
            if (kitFormId) {
                const res = await fetch(`https://api.convertkit.com/v3/forms/${kitFormId}/subscribe`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        api_key: KIT_API_KEY,
                        email,
                        first_name: name,
                        fields: { job_title: jobTitle, country: countryName },
                    }),
                })
                const data = await res.json()
                if (!res.ok && !data.subscription) {
                    console.warn('Kit V3 custom fields update failed:', data.message)
                }
            }

            setSubmitted(true)
        } catch {
            setError('Network error. Please check your connection and try again.')
        } finally {
            setLoading(false)
        }
    }

    return (
        <AnimatePresence>
            {open && (
                <>
                    <motion.div
                        className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.25 }}
                        onClick={onClose}
                    />

                    <div className="fixed inset-0 z-50 flex items-center justify-center px-4" onClick={onClose}>
                        <motion.div
                            className="bg-white rounded-2xl p-8 w-full max-w-2xl flex flex-col gap-8 shadow-2xl"
                            initial={{ opacity: 0, scale: 0.92, y: 24 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.92, y: 24 }}
                            transition={{ duration: 0.3, ease: 'easeOut' }}
                            onClick={e => e.stopPropagation()}
                        >
                            {submitted ? (
                                <div className="flex flex-col items-center gap-4 py-8 text-center">
                                    <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center">
                                        <Check className="w-8 h-8 text-green-600" />
                                    </div>
                                    <h2 className="text-h3 text-black font-bold">You're registered!</h2>
                                    <p className="text-p-md text-black/60 text-balance">Check your inbox — we'll send you the masterclass details and joining link.</p>
                                    <button onClick={onClose} className="mt-4 px-8 py-3 bg-black text-white rounded-full text-p-md-semibold hover:bg-black/80 transition-colors">
                                        Close
                                    </button>
                                </div>
                            ) : (
                                <>
                                    <div className="flex flex-col gap-1 items-center">
                                        <h2 className="text-h3 text-black font-bold">{title || 'Reserve Your Free Seat'}</h2>
                                        <p className="text-p-md-semibold text-black">{formatModalDatetime(conferenceDatetime ?? FALLBACK_DATETIME)}</p>
                                    </div>

                                    <form onSubmit={handleSubmit} className="flex flex-col gap-8">
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                            <Field label="Full name">
                                                <FilledInput type="text" placeholder="John Smith" value={name} onChange={setName} />
                                            </Field>
                                            <Field label="Email address">
                                                <FilledInput type="email" placeholder="john@domain.com" value={email} onChange={setEmail} />
                                            </Field>
                                            <Field label="Job title">
                                                <StyledSelect
                                                    value={jobTitle}
                                                    onChange={setJobTitle}
                                                    placeholder="Select your job title"
                                                    options={JOB_TITLE_OPTIONS}
                                                />
                                            </Field>
                                            <Field label="Country">
                                                <Select.Root value={country} onValueChange={setCountry}>
                                                    <Select.Trigger
                                                        className={`flex items-center justify-between gap-2 rounded-xl border px-4 py-3.5 w-full outline-none bg-white text-p-md cursor-pointer transition-colors ${country ? 'border-pink-500 text-black' : 'border-black/15 text-black/35'}`}
                                                    >
                                                        <div className="flex items-center gap-2 flex-1 min-w-0">
                                                            {country && (
                                                                <ReactCountryFlag countryCode={country} svg style={{ width: '1.2rem', height: '1.2rem', flexShrink: 0 }} />
                                                            )}
                                                            <span className="truncate text-left">
                                                                <Select.Value placeholder="Select country" />
                                                            </span>
                                                        </div>
                                                        <Select.Icon>
                                                            <ChevronDown className="size-4 text-black/40 shrink-0" />
                                                        </Select.Icon>
                                                    </Select.Trigger>
                                                    <Select.Portal>
                                                        <Select.Content
                                                            position="popper"
                                                            sideOffset={4}
                                                            style={{ width: 'var(--radix-select-trigger-width)' }}
                                                            className="z-60 bg-white border border-black/10 rounded-xl shadow-xl overflow-hidden"
                                                        >
                                                            <Select.Viewport className="max-h-52 overflow-y-auto p-1">
                                                                {countryList.map(({ code, name }) => (
                                                                    <Select.Item
                                                                        key={code}
                                                                        value={code}
                                                                        className="flex items-center gap-3 px-4 py-2.5 rounded-lg cursor-pointer text-p-md text-black outline-none data-highlighted:bg-black/5 data-[state=checked]:bg-black/8"
                                                                    >
                                                                        <ReactCountryFlag countryCode={code} svg style={{ width: '1.2rem', height: '1.2rem', flexShrink: 0 }} />
                                                                        <Select.ItemText>{name}</Select.ItemText>
                                                                        <Select.ItemIndicator className="ml-auto">
                                                                            <Check className="size-4 text-pink-500" />
                                                                        </Select.ItemIndicator>
                                                                    </Select.Item>
                                                                ))}
                                                            </Select.Viewport>
                                                        </Select.Content>
                                                    </Select.Portal>
                                                </Select.Root>
                                            </Field>
                                        </div>

                                        {error && <p className="text-p-sm text-red-500 text-center">{error}</p>}

                                        <div className="flex flex-col gap-4">
                                            <button
                                                type="submit"
                                                disabled={loading}
                                                className="w-full bg-black text-white rounded-full py-3.5 text-p-md-semibold hover:bg-black/80 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
                                            >
                                                {loading ? 'Registering...' : 'Register Now'}
                                            </button>
                                            <p className="text-p-sm text-black text-center text-balance whitespace-pre-line">{subtext || 'Seats are limited. Once all seats are filled, access cannot be guaranteed. By registering, you agree to receive newsletters from us and collaborated party. You can subscribe at any time.'}</p>
                                        </div>
                                    </form>
                                </>
                            )}
                        </motion.div>
                    </div>
                </>
            )}
        </AnimatePresence>
    )
}

export default RegistrationModal