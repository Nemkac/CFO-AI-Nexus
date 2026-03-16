import Input from "@/components/ui/Input"

const GeneralData = () => {
    return (
        <div className="flex flex-col w-full border-[0.5px] h-min border-stroke-default rounded-2xl">
            <div className="flex flex-row w-full items-start border-b-[0.5px] border-stroke-default p-6">
                <h5 className="text-h5 text-content-heading">General Data</h5>
            </div>
            <div className="flex flex-col gap-6 w-full p-6">
                <p className="text-p-md text-content-heading">Purchasing as:</p>
                <div className="flex flex-row w-full items-center gap-10">
                    <div className="flex flex-row items-center gap-4">
                        <input type="radio" />
                        <p className="text-p-md text-content-heading">Individual</p>
                    </div>
                    <div className="flex flex-row items-center gap-4">
                        <input type="radio" />
                        <p className="text-p-md text-content-heading">Company</p>
                    </div>
                </div>
                <Input label="Full name" placeholder="Enter your full name" />
                <Input label="Work email" placeholder="Enter your work email" />
                <Input label="Country" placeholder="Select country" />
                <Input label="Job title" placeholder="Select job title" />
            </div>
        </div>
    )
}

export default GeneralData
