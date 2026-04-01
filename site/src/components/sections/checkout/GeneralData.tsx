import { forwardRef, useImperativeHandle, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { countries } from 'countries-list'
import Input from '@/components/ui/Input'
import CountrySelect from '@/components/ui/CountrySelect'
import SimpleSelect from '@/components/ui/SimpleSelect'
import { ALLOWED_COUNTRY_CODES } from '@/data/blockedCountries'

export type PurchaseType = 'individual' | 'company'

export interface PurchaseData {
    type: PurchaseType
    fullName: string
    workEmail: string
    country: string
    countryCode: string
    quantity: number
    jobTitle?: string
    companyName?: string
    taxId?: string
    address?: string
    city?: string
    zipCode?: string
}

export interface GeneralDataHandle {
    validateAndGetData: (quantity: number) => PurchaseData | null
}

const JOB_TITLE_OPTIONS = [
    { value: 'CFO', label: 'CFO' },
    { value: 'VP/Director/Head of Finance', label: 'VP/Director/Head of Finance' },
    { value: 'Head of FP&A', label: 'Head of FP&A' },
    { value: 'Accounting Manager/Lead', label: 'Accounting Manager/Lead' },
    { value: 'Senior Finance Manager/Lead', label: 'Senior Finance Manager/Lead' },
    { value: 'Finance Professional (Senior)', label: 'Finance Professional (Senior)' },
    { value: 'Other C-Suite', label: 'Other C-Suite' },
    { value: 'Other', label: 'Other' },
]

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

const FREE_EMAIL_DOMAINS = new Set([
    'googlemail.com', 'gmail.com', 'mailinator.com',
    'yahoo.com', 'yahoo.co.uk', 'yahoo.co.in', 'ymail.com',
    'hotmail.com', 'hotmail.co.uk', 'hotmail.fr',
    'outlook.com', 'live.com', 'msn.com',
    'aol.com', 'icloud.com', 'me.com', 'mac.com',
    'protonmail.com', 'proton.me',
    'tutanota.com', 'tuta.io',
    'mail.com', 'email.com',
    'zoho.com', 'yandex.com', 'yandex.ru',
    'gmx.com', 'gmx.net',
    'fastmail.com', 'fastmail.fm',
    'hushmail.com', 'inbox.com',
    'rediffmail.com', 'mail.ru',
    'qq.com', '163.com', '126.com',
])

const isWorkEmail = (email: string): boolean => {
    const domain = email.split('@')[1]?.toLowerCase()
    return !!domain && !FREE_EMAIL_DOMAINS.has(domain)
}

const validate = (field: string, value: string, purchaseType: PurchaseType): string => {
    switch (field) {
        case 'fullName':
            return value.trim().length < 2 ? 'Full name must be at least 2 characters' : ''
        case 'workEmail':
            if (!value.trim()) return 'Email is required'
            if (!EMAIL_REGEX.test(value)) return 'Please enter a valid email address'
            return isWorkEmail(value) ? '' : 'Please use your work email address'
        case 'country':
            if (!value) return 'Please select a country'
            return !ALLOWED_COUNTRY_CODES.has(value) ? 'Tickets are not available in your region' : ''
        case 'jobTitle':
            return purchaseType === 'individual' && !value ? 'Job title is required' : ''
        case 'companyName':
            return purchaseType === 'company' && value.trim().length < 2 ? 'Company name is required' : ''
        case 'taxId':
            return purchaseType === 'company' && !value.trim() ? 'Tax ID / VAT number is required' : ''
        case 'address':
            return purchaseType === 'company' && !value.trim() ? 'Address is required' : ''
        case 'city':
            return purchaseType === 'company' && !value.trim() ? 'City is required' : ''
        case 'zipCode':
            return purchaseType === 'company' && !value.trim() ? 'Zip code is required' : ''
        default:
            return ''
    }
}

interface GeneralDataProps {
    locked?: boolean
}

const GeneralData = forwardRef<GeneralDataHandle, GeneralDataProps>(({ locked = false }, ref) => {
    const [purchaseType, setPurchaseType] = useState<PurchaseType>('individual')
    const [fullName, setFullName] = useState('')
    const [workEmail, setWorkEmail] = useState('')
    const [country, setCountry] = useState('')
    const [jobTitle, setJobTitle] = useState('')
    const [companyName, setCompanyName] = useState('')
    const [taxId, setTaxId] = useState('')
    const [address, setAddress] = useState('')
    const [city, setCity] = useState('')
    const [zipCode, setZipCode] = useState('')
    const [touched, setTouched] = useState<Set<string>>(new Set())

    const touch = (field: string) => setTouched(prev => new Set(prev).add(field))
    const err = (field: string, value: string) =>
        touched.has(field) ? validate(field, value, purchaseType) : ''

    const allRequiredFields = purchaseType === 'individual'
        ? ['fullName', 'workEmail', 'country', 'jobTitle']
        : ['fullName', 'workEmail', 'country', 'companyName', 'taxId', 'address', 'city', 'zipCode']

    const fieldValues: Record<string, string> = {
        fullName, workEmail, country, jobTitle, companyName, taxId, address, city, zipCode
    }

    const handleTypeChange = (type: PurchaseType) => {
        setPurchaseType(type)
        setTouched(new Set())
    }

    useImperativeHandle(ref, () => ({
        validateAndGetData: (quantity: number): PurchaseData | null => {
            const allTouched = new Set(allRequiredFields)
            setTouched(allTouched)
            const isValid = allRequiredFields.every(f => !validate(f, fieldValues[f] ?? '', purchaseType))
            if (!isValid) return null
            const countryName = (countries as Record<string, { name: string }>)[country]?.name ?? country
            const base = { fullName, workEmail, country: countryName, countryCode: country, quantity }
            return purchaseType === 'individual'
                ? { type: 'individual', ...base, jobTitle }
                : { type: 'company', ...base, companyName, taxId, address, city, zipCode }
        }
    }))

    return (
        <div className="flex flex-col w-full border-[0.5px] h-min border-stroke-default rounded-2xl relative">
            <div className="flex flex-row w-full items-start border-b-[0.5px] border-stroke-default p-6">
                <h5 className="text-h5 text-content-heading">Your Details</h5>
            </div>

            {locked && (
                <div className="absolute inset-0 top-14.25 z-10 rounded-b-2xl bg-surface-page/80 backdrop-blur-sm flex flex-col items-center justify-center gap-3 p-8 text-center">
                    <div className="size-10 rounded-full bg-sapphire-800/60 border-[0.5px] border-stroke-default flex items-center justify-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="size-5 text-content-heading" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                            <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                        </svg>
                    </div>
                    <p className="text-p-md-semibold text-content-heading">Section locked</p>
                    <p className="text-p-sm text-content-body text-balance">Your details are submitted. Cancel the current payment session to make changes.</p>
                </div>
            )}

            <div className="flex flex-col gap-6 w-full p-6">
                {/* Purchase type toggle */}
                <div className="flex flex-col gap-3">
                    <p className="text-p-md text-content-heading">Purchasing as:</p>
                    <div className="flex flex-row gap-6">
                        {(['individual', 'company'] as PurchaseType[]).map((type) => {
                            const isSelected = purchaseType === type
                            return (
                                <button
                                    key={type}
                                    onClick={() => handleTypeChange(type)}
                                    className={`cursor-pointer flex flex-row items-center gap-3 px-4 py-3 rounded-xl border-[0.5px] transition-colors flex-1 ${isSelected
                                        ? 'border-pink-500 bg-sapphire-800/70'
                                        : 'border-stroke-disabled bg-sapphire-800/20 hover:bg-sapphire-800/40'
                                        }`}
                                >
                                    <div className={`size-4 rounded-full border-[0.5px] shrink-0 flex items-center justify-center ${isSelected ? 'border-content-heading' : 'border-stroke-disabled'
                                        }`}>
                                        {isSelected && <div className="size-2 rounded-full bg-content-heading" />}
                                    </div>
                                    <p className="text-p-md-semibold text-content-heading capitalize">{type}</p>
                                </button>
                            )
                        })}
                    </div>
                </div>

                <p className="text-p-sm text-content-body uppercase tracking-widest">General Data</p>

                <Input
                    label="Full name"
                    placeholder="Enter your full name"
                    value={fullName}
                    onChange={setFullName}
                    onBlur={() => touch('fullName')}
                    error={err('fullName', fullName)}
                />
                <Input
                    label="Work email"
                    placeholder="Enter your work email"
                    value={workEmail}
                    onChange={setWorkEmail}
                    onBlur={() => touch('workEmail')}
                    type="email"
                    error={err('workEmail', workEmail)}
                />

                <AnimatePresence mode="wait">
                    {purchaseType === 'individual' ? (
                        <motion.div
                            key="individual"
                            initial={{ opacity: 0, y: -6 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -6 }}
                            transition={{ duration: 0.2 }}
                            className="flex flex-col gap-6"
                        >
                            <div className="flex flex-col gap-1">
                                <CountrySelect
                                    value={country}
                                    onChange={setCountry}
                                    onBlur={() => touch('country')}
                                    error={err('country', country)}
                                />
                                <p className="text-p-sm text-content-body">Tickets are available in select regions only.</p>
                            </div>
                            <SimpleSelect
                                label="Job title"
                                placeholder="Select your job title"
                                value={jobTitle}
                                onChange={setJobTitle}
                                onBlur={() => touch('jobTitle')}
                                error={err('jobTitle', jobTitle)}
                                options={JOB_TITLE_OPTIONS}
                            />
                        </motion.div>
                    ) : (
                        <motion.div
                            key="company"
                            initial={{ opacity: 0, y: -6 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -6 }}
                            transition={{ duration: 0.2 }}
                            className="flex flex-col gap-6"
                        >
                            <Input
                                label="Company name"
                                placeholder="Enter your company name"
                                value={companyName}
                                onChange={setCompanyName}
                                onBlur={() => touch('companyName')}
                                error={err('companyName', companyName)}
                            />
                            <Input
                                label="Tax ID / VAT number"
                                placeholder="Enter your tax ID or VAT number"
                                value={taxId}
                                onChange={setTaxId}
                                onBlur={() => touch('taxId')}
                                error={err('taxId', taxId)}
                            />
                            <p className="text-p-sm text-content-body uppercase tracking-widest">Address Details</p>
                            <Input
                                label="Company address"
                                placeholder="Enter your company address"
                                value={address}
                                onChange={setAddress}
                                onBlur={() => touch('address')}
                                error={err('address', address)}
                            />
                            <div className="flex flex-col gap-1">
                                <CountrySelect
                                    value={country}
                                    onChange={setCountry}
                                    onBlur={() => touch('country')}
                                    error={err('country', country)}
                                />
                                <p className="text-p-sm text-content-body">Tickets are available in select regions only.</p>
                            </div>
                            <div className="grid grid-cols-2 gap-6">
                                <Input
                                    label="City"
                                    placeholder="Enter city"
                                    value={city}
                                    onChange={setCity}
                                    onBlur={() => touch('city')}
                                    error={err('city', city)}
                                />
                                <Input
                                    label="Zip code"
                                    placeholder="Enter zip code"
                                    value={zipCode}
                                    onChange={setZipCode}
                                    onBlur={() => touch('zipCode')}
                                    error={err('zipCode', zipCode)}
                                />
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    )
})

GeneralData.displayName = 'GeneralData'

export default GeneralData
