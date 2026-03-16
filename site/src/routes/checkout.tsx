import GeneralData from '@/components/sections/checkout/GeneralData'
import Payment from '@/components/sections/checkout/Payment'
import YourTickets from '@/components/sections/checkout/YourTickets'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/checkout')({ component: CheckoutPage })

function CheckoutPage() {
  return (
    <div className='bg-surface-page py-10 md:py-20 flex items-center w-full justify-center gap-10 md:gap-20 flex-col p-4'>
      <div className='grid grid-cols-1 md:grid-cols-5 w-full gap-12 max-w-6xl'>
        <div className='flex w-full md:col-span-3'>
          <GeneralData />
        </div>
        <div className='flex flex-col gap-12 w-full md:col-span-2'>
          <YourTickets />
          <Payment />
        </div>
      </div>
    </div>
  )
}
