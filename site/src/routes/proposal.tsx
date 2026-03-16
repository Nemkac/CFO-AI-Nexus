import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/proposal')({
    component: RouteComponent,
})

function RouteComponent() {
    return (
        <div className='bg-surface-page py-10 md:py-20 flex items-center w-full justify-center gap-10 md:gap-20 flex-col p-4'>
            <div className='grid grid-cols-1 md:grid-cols-5 w-full max-w-6xl px-4 items-start justify-center gap-10 md:gap-20'>
                <div className='flex flex-col w-full items-center text-center md:text-left md:items-start md:col-span-2'>
                    <h1 className='text-h1 text-content-heading'>Discover<br />Partnership<br />Opportunities</h1>
                    <p className='text-p-md text-content-body text-balance'>Put your solution in front of 1,000+ high-intent finance decision-makers. Secure your spot and start building your 2027 sales pipeline today.</p>
                </div>
                <div className='md:col-span-3 grid grid-cols-1 md:grid-cols-2 w-full gap-8'>
                    <Input label='Full name' placeholder='Enter your full name' />
                    <Input label='Work email' placeholder='Enter your work email' />
                    <div className='flex w-full md:col-span-2'>
                        <Input label='Company name' placeholder='Enter your company name' />
                    </div>
                    <Input label='Platform category' placeholder='Select platform category' />
                    <Input label='Region' placeholder='Select region' />
                    <Input label='Primary goal' placeholder='Select your primary goal' />
                    <Input label='Estimated event budget' placeholder='Select estimated event budget' />
                    <div className='md:col-span-2 w-full items-center'>
                        <Button variant={'primary'} label='Get Full Proposal' className='w-full md:py-6' />
                    </div>
                </div>
            </div>
        </div>
    )
}
