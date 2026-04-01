import { createFileRoute, Link } from '@tanstack/react-router'

export const Route = createFileRoute('/order-confirmed')({ component: OrderConfirmedPage })

function OrderConfirmedPage() {
    return (
        <div className='bg-surface-page min-h-screen flex items-center justify-center p-4'>
            <div className='flex flex-col items-center gap-8 max-w-lg text-center'>
                <div className='flex items-center justify-center size-20 rounded-full bg-sapphire-800/50 border-[0.5px] border-stroke-default'>
                    <svg className='size-10 text-content-heading' fill='none' viewBox='0 0 24 24' stroke='currentColor' strokeWidth={1.5}>
                        <path strokeLinecap='round' strokeLinejoin='round' d='M4.5 12.75l6 6 9-13.5' />
                    </svg>
                </div>
                <div className='flex flex-col gap-3'>
                    <h2 className='text-h2 text-content-heading'>You're In!</h2>
                    <p className='text-p-lg text-content-body'>
                        Your ticket has been confirmed. Check your email for the receipt and event details.
                    </p>
                </div>
                <Link to='/'>
                    <button className='px-8 py-3 rounded-full bg-linear-to-r from-pink-500 to-sapphire-500 text-content-heading text-p-md-semibold'>
                        Back to Home
                    </button>
                </Link>
            </div>
        </div>
    )
}