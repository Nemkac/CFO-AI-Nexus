import Input from "@/components/ui/Input"
import { useState } from "react"

const YourTickets = () => {
    const [total] = useState<number>(1000)
    const [ticketCount] = useState<number>(1);
    return (
        <div className="flex flex-col w-full border-[0.5px] h-min border-stroke-default rounded-2xl">
            <div className="flex flex-row w-full items-start border-b-[0.5px] border-stroke-default p-6 md:justify-between gap-4">
                <h5 className="text-h5 text-content-heading">Your Tickets</h5>
                <h5 className="text-h5 text-content-heading">Total: ${total}</h5>
            </div>
            <div className="flex flex-col gap-6 w-full p-6">
                <div className="flex flex-row items-center gap-2">
                    <img src="./icons/TicketIcon.svg" />
                    <p className="text-p-lg-semibold text-content-heading">Standard Ticket x{ticketCount}</p>
                </div>
                <div className="flex flex-row items-center md:justify-between gap-4">
                    <p className="text-p-lg text-content-heading">Total</p>
                    <p className="text-p-lg-semibold text-content-heading">${total}</p>
                </div>
                <Input label="Number of tickets" placeholder={ticketCount.toString()} />
                <div className="flex flex-col gap-2 w-full">
                    <p className="text-p-md text-content-heading">Promo code</p>
                    <div className="grid grid-cols-1 md:grid-cols-3 w-full gap-4 items-end">
                        <div className="flex flex-row w-full md:col-span-2">
                            <Input placeholder="Enter your promo code" />
                        </div>
                        <button className="w-full rounded-md bg-content-heading items-center justify-center h-full flex flex-row hover:bg-content-body text-p-md text-content-on-action transition-[0.5s]">
                            Apply
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default YourTickets
