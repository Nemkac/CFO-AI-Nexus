import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import * as Select from '@radix-ui/react-select'
import ReactCountryFlag from 'react-country-flag'
import { countries } from 'countries-list'
import { ChevronDown, Check } from 'lucide-react'
import { ALLOWED_COUNTRY_CODES } from '@/data/blockedCountries'

const countryList = (Object.entries(countries) as [string, { name: string }][])
    .filter(([code]) => ALLOWED_COUNTRY_CODES.has(code))
    .map(([code, data]) => ({ code, name: data.name }))
    .sort((a, b) => a.name.localeCompare(b.name))

type Props = {
    open: boolean
    onClose: () => void
}

const labelClass = "text-p-md text-black/70 font-medium"

const Field = ({ label, children }: { label: string; children: React.ReactNode }) => (
    <div className="flex flex-col gap-1.5 w-full">
        <label className={labelClass}>{label}</label>
        {children}
    </div>
)

const FilledInput = ({ type, placeholder }: { type: string; placeholder: string }) => {
    const [focused, setFocused] = useState(false)
    const [value, setValue] = useState('')
    return (
        <input
            type={type}
            placeholder={placeholder}
            value={value}
            onChange={e => setValue(e.target.value)}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            className={`rounded-xl border px-4 py-3.5 w-full outline-none bg-white text-p-md text-black placeholder:text-black/35 transition-colors ${focused || value ? 'border-pink-500' : 'border-black/15'}`}
        />
    )
}

const RegistrationModal = ({ open, onClose }: Props) => {
    const [country, setCountry] = useState('')

    useEffect(() => {
        if (open) document.body.style.overflow = 'hidden'
        else document.body.style.overflow = ''
        return () => { document.body.style.overflow = '' }
    }, [open])

    return (
        <AnimatePresence>
            {open && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.25 }}
                        onClick={onClose}
                    />

                    {/* Dialog wrapper — handles click-outside */}
                    <div className="fixed inset-0 z-50 flex items-center justify-center px-4" onClick={onClose}>
                        <motion.div
                            className="bg-white rounded-2xl p-8 w-full max-w-2xl flex flex-col gap-8 shadow-2xl"
                            initial={{ opacity: 0, scale: 0.92, y: 24 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.92, y: 24 }}
                            transition={{ duration: 0.3, ease: 'easeOut' }}
                            onClick={e => e.stopPropagation()}
                        >
                            {/* Header */}
                            <div className="flex flex-col gap-1 items-center">
                                <h2 className="text-h3 text-black font-bold">Reserve Your Free Seat</h2>
                                <p className="text-p-md-semibold text-black">Tuesday, May 19 | 11:00 AM EST (5:00 PM CET)</p>
                            </div>

                            {/* Fields — 2 col on sm+ */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <Field label="Full name">
                                    <FilledInput type="text" placeholder="John Smith" />
                                </Field>
                                <Field label="Work email">
                                    <FilledInput type="email" placeholder="john@company.com" />
                                </Field>
                                <Field label="Company name">
                                    <FilledInput type="text" placeholder="Acme Corp" />
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

                            {/* CTA */}
                            <div className="flex flex-col gap-8">
                                <button className="w-full bg-black text-white rounded-full py-3.5 text-p-md-semibold hover:bg-black/80 transition-colors">
                                    Register Now
                                </button>
                                <p className="text-p-sm text-black text-center text-balance">Seats are limited. Once all seats are filled, access cannot be guaranteed. By registering, you agree to receive newsletters from us and collaborated party. You can subscribe at any time.</p>
                            </div>
                        </motion.div>
                    </div>
                </>
            )}
        </AnimatePresence>
    )
}

export default RegistrationModal
