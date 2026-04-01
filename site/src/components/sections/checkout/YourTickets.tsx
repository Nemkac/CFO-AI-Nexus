const TICKETS = [
    { name: "Super Early Bird Ticket", priceId: "price_1TCeutEPnfyhMV5YNm84H8M0" },
    { name: "Early Bird Ticket", priceId: "price_1TCfEEEPnfyhMV5YJeZYTsd5" },
    { name: "Standard Ticket", priceId: "price_1TCfEbEPnfyhMV5YpLrnkqNC" },
    { name: "Last Minute Ticket", priceId: "price_1TCfFOEPnfyhMV5YcmQXE4pt" },
]

interface YourTicketsProps {
    selectedPriceId: string | null
    onSelect: (priceId: string) => void
}

const YourTickets = ({ selectedPriceId, onSelect }: YourTicketsProps) => {
    return (
        <div className="flex flex-col w-full border-[0.5px] h-min border-stroke-default rounded-2xl">
            <div className="flex flex-row w-full items-start border-b-[0.5px] border-stroke-default p-6">
                <h5 className="text-h5 text-content-heading">Select Your Ticket</h5>
            </div>
            <div className="flex flex-col gap-3 w-full p-6">
                {TICKETS.map((ticket) => {
                    const isSelected = selectedPriceId === ticket.priceId
                    return (
                        <button
                            key={ticket.priceId}
                            onClick={() => onSelect(ticket.priceId)}
                            className={`flex flex-row items-center gap-3 w-full p-4 rounded-xl border-[0.5px] transition-colors text-left ${
                                isSelected
                                    ? 'border-content-heading bg-sapphire-800/70'
                                    : 'border-stroke-disabled bg-sapphire-800/20 hover:bg-sapphire-800/40'
                            }`}
                        >
                            <div className={`size-4 rounded-full border-[0.5px] shrink-0 flex items-center justify-center ${
                                isSelected ? 'border-content-heading' : 'border-stroke-disabled'
                            }`}>
                                {isSelected && <div className="size-2 rounded-full bg-content-heading" />}
                            </div>
                            <div className="flex flex-row items-center gap-2">
                                <img src="./icons/TicketIcon.svg" className="size-5" />
                                <p className="text-p-md-semibold text-content-heading">{ticket.name}</p>
                            </div>
                        </button>
                    )
                })}
            </div>
        </div>
    )
}

export default YourTickets