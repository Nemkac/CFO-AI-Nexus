import Button from "@/components/ui/Button"
import Input from "@/components/ui/Input"

const Payment = () => {
    return (
        <div className="flex flex-col w-full border-[0.5px] h-min border-stroke-default rounded-2xl">
            <div className="flex flex-row w-full items-start border-b-[0.5px] border-stroke-default p-6 md:justify-between gap-4">
                <h5 className="text-h5 text-content-heading">Payment</h5>
                <img src="./icons/PaymentCards.svg" />
            </div>
            <div className="flex flex-col gap-6 w-full p-6">
                <Input label="Card number" placeholder="Enter your 16-digit card number" />
                <div className="grid grid-cols-1 md:grid-cols-2 w-full gap-8 items-end">
                    <Input placeholder="Expiration date" label="MM / YY" />
                    <Input placeholder="3-digit code" label="CVV" />
                </div>
                <Input label="Name on the card" placeholder="Enter the name on the card" />
                <div className="flex flex-row w-full gap-4">
                    <input type="checkbox" />
                    <p className="text-p-md text-content-heading text-balance">By placing this order I agree to the <span className="underline hover:cursor-pointer hover:text-pink-500">Organizer Terms</span> and <span className="underline hover:cursor-pointer hover:text-pink-500">Privacy Policy</span></p>
                </div>
                <Button className="w-full md:col-span-2" label="Purchase" />
            </div>
        </div>
    )
}

export default Payment
