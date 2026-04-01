import { useState } from 'react'
import { useNavigate } from '@tanstack/react-router'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import SimpleSelect from '@/components/ui/SimpleSelect'
import CountrySelect from '@/components/ui/CountrySelect'
import { countries } from 'countries-list'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/proposal')({
    component: RouteComponent,
})

const PLATFORM_CATEGORIES = [
    { value: 'FP&A', label: 'FP&A' },
    { value: 'ERP & Accounting', label: 'ERP & Accounting' },
    { value: 'Financial Close', label: 'Financial Close' },
    { value: 'Treasury', label: 'Treasury' },
    { value: 'Spend Management', label: 'Spend Management' },
    { value: 'AR/AP Automation', label: 'AR/AP Automation' },
    { value: 'Global Payments', label: 'Global Payments' },
    { value: 'Other', label: 'Other' },
]

const PRIMARY_GOALS = [
    { value: 'Generating Qualified Leads (MQLs/SQLs)', label: 'Generating Qualified Leads (MQLs/SQLs)' },
    { value: '1:1 Product Demos', label: '1:1 Product Demos' },
    { value: 'Direct Networking with CFOs', label: 'Direct Networking with CFOs' },
    { value: 'Brand Visibility', label: 'Brand Visibility' },
    { value: 'Other', label: 'Other' },
]

const BUDGET_OPTIONS = [
    { value: 'Under $10k', label: 'Under $10k' },
    { value: '$10k - $15k', label: '$10k - $15k' },
    { value: '$15k - $20k+', label: '$15k - $20k+' },
    { value: 'Not defined yet', label: 'Not defined yet' },
]

type Status = 'idle' | 'loading' | 'success' | 'error'

function RouteComponent() {
    const [fullName, setFullName] = useState('')
    const [workEmail, setWorkEmail] = useState('')
    const [companyName, setCompanyName] = useState('')
    const [region, setRegion] = useState('')
    const [platformCategory, setPlatformCategory] = useState('')
    const [primaryGoal, setPrimaryGoal] = useState('')
    const [budget, setBudget] = useState('')
    const [touched, setTouched] = useState<Set<string>>(new Set())
    const [status, setStatus] = useState<Status>('idle')
    const navigate = useNavigate()

    const touch = (field: string) => setTouched(prev => new Set(prev).add(field))

    const errors: Record<string, string> = {}
    if (!fullName.trim()) errors.fullName = 'Full name is required'
    if (!workEmail.trim()) errors.workEmail = 'Work email is required'
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(workEmail)) errors.workEmail = 'Enter a valid email'
    if (!companyName.trim()) errors.companyName = 'Company name is required'
    if (!platformCategory) errors.platformCategory = 'Please select a platform category'
    if (!primaryGoal) errors.primaryGoal = 'Please select a primary goal'
    if (!budget) errors.budget = 'Please select an estimated budget'

    const handleSubmit = async () => {
        const allFields = ['fullName', 'workEmail', 'companyName', 'platformCategory', 'primaryGoal', 'budget']
        setTouched(new Set(allFields))

        if (Object.keys(errors).length > 0) return

        setStatus('loading')
        try {
            const res = await fetch('https://api.web3forms.com/submit', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    access_key: import.meta.env.VITE_WEB3FORMS_KEY,
                    subject: `New Partnership Proposal — ${companyName}`,
                    from_name: fullName,
                    'Full Name': fullName,
                    'Work Email': workEmail,
                    'Company Name': companyName,
                    'Platform Category': platformCategory,
                    'Region': region ? (countries as Record<string, { name: string }>)[region]?.name ?? region : 'Not specified',
                    'Primary Goal': primaryGoal,
                    'Estimated Budget': budget,
                }),
            })
            const data = await res.json()
            if (data.success) {
                setStatus('success')
            } else {
                setStatus('error')
            }
        } catch {
            setStatus('error')
        }
    }

    if (status === 'success') {
        return (
            <div className='bg-surface-page py-10 md:py-20 flex items-center w-full justify-center gap-10 flex-col p-4 h-[calc(100vh-128px)]'>
                <div className='flex flex-col items-center text-center gap-4 max-w-md'>
                    <h2 className='text-h2 text-content-heading'>Thank you!</h2>
                    <p className='text-p-md text-content-body'>We've received your proposal request. Our team will get back to you shortly.</p>
                    <Button label='Go to Home' onClick={() => navigate({ to: '/' })} className='mt-4' />
                </div>
            </div>
        )
    }

    return (
        <div className='bg-surface-page py-10 md:py-20 flex items-center w-full justify-center gap-10 md:gap-20 flex-col p-4'>
            <div className='grid grid-cols-1 md:grid-cols-5 w-full max-w-6xl px-4 items-start justify-center gap-10 md:gap-20'>
                <div className='flex flex-col w-full items-center text-center md:text-left md:items-start md:col-span-2'>
                    <h1 className='text-h1 text-content-heading'>Discover<br />Partnership<br />Opportunities</h1>
                    <p className='text-p-md text-content-body text-balance'>Put your solution in front of 1,000+ high-intent finance decision-makers. Secure your spot and start building your 2027 sales pipeline today.</p>
                </div>
                <div className='md:col-span-3 grid grid-cols-1 md:grid-cols-2 w-full gap-8'>
                    <Input
                        label='Full name'
                        placeholder='Enter your full name'
                        value={fullName}
                        onChange={setFullName}
                        onBlur={() => touch('fullName')}
                        error={touched.has('fullName') ? errors.fullName : undefined}
                    />
                    <Input
                        label='Work email'
                        placeholder='Enter your work email'
                        value={workEmail}
                        onChange={setWorkEmail}
                        onBlur={() => touch('workEmail')}
                        error={touched.has('workEmail') ? errors.workEmail : undefined}
                    />
                    <div className='flex w-full md:col-span-2'>
                        <Input
                            label='Company name'
                            placeholder='Enter your company name'
                            value={companyName}
                            onChange={setCompanyName}
                            onBlur={() => touch('companyName')}
                            error={touched.has('companyName') ? errors.companyName : undefined}
                        />
                    </div>
                    <SimpleSelect
                        label='Platform category'
                        placeholder='Select platform category'
                        value={platformCategory}
                        onChange={setPlatformCategory}
                        onBlur={() => touch('platformCategory')}
                        error={touched.has('platformCategory') ? errors.platformCategory : undefined}
                        options={PLATFORM_CATEGORIES}
                    />
                    <CountrySelect
                        label='Region'
                        value={region}
                        onChange={setRegion}
                    />
                    <SimpleSelect
                        label='Primary goal'
                        placeholder='Select your primary goal'
                        value={primaryGoal}
                        onChange={setPrimaryGoal}
                        onBlur={() => touch('primaryGoal')}
                        error={touched.has('primaryGoal') ? errors.primaryGoal : undefined}
                        options={PRIMARY_GOALS}
                    />
                    <SimpleSelect
                        label='Estimated event budget'
                        placeholder='Select estimated budget'
                        value={budget}
                        onChange={setBudget}
                        onBlur={() => touch('budget')}
                        error={touched.has('budget') ? errors.budget : undefined}
                        options={BUDGET_OPTIONS}
                    />
                    {status === 'error' && (
                        <p className='md:col-span-2 text-p-sm text-red-400'>Something went wrong. Please try again.</p>
                    )}
                    <div className='md:col-span-2 w-full items-center'>
                        <Button
                            variant='primary'
                            label={status === 'loading' ? 'Sending...' : 'Get Full Proposal'}
                            className='w-full md:py-6'
                            onClick={handleSubmit}
                            disabled={status === 'loading'}
                        />
                    </div>
                </div>
            </div>
        </div>
    )
}