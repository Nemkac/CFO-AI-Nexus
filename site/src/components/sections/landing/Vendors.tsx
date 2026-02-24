import Button from "@/components/ui/Button"
import FilterButton from "@/components/ui/FilterButton"
import VendorCard from "@/components/ui/VendorCard"
import { useState } from "react"

const vendorTypes = ['All', 'Accounting & ERP', 'Financial Close', 'FP & A', 'Treasury', 'Spend Management', 'Tax & Compliance', 'AR/AP Automation', 'Fintech']
const vendors = [
    {
        image: '/assets/speaker1.jpg',
        title: "Anaplan",
        description: "AI-connected planning platform unifying FP&A, supply chain, and workforce planning for enterprise-scale scenario modeling and continuous forecasting.",
        types: ['All', 'FP & A', 'Accounting & ERP']
    },
    {
        image: '/assets/speaker1.jpg',
        title: "Pigment",
        description: "Next-generation business planning platform combining real-time data integration with intuitive modeling so FP&A teams can build, share, and iterate faster.",
        types: ['All', 'FP & A']
    },
    {
        image: '/assets/speaker1.jpg',
        title: "Datarails",
        description: "FP&A platform built for Excel users — consolidates data from ERPs, CRMs, and HRIs and layers AI-powered analytics on top without leaving your spreadsheets",
        types: ['All', 'Financial Close', 'FP & A']
    },
    {
        image: '/assets/speaker1.jpg',
        title: "Anaplan",
        description: "AI-connected planning platform unifying FP&A, supply chain, and workforce planning for enterprise-scale scenario modeling and continuous forecasting.",
        types: ['All', 'Treasury', 'AR/AP Automation']
    },
    {
        image: '/assets/speaker1.jpg',
        title: "Datarails",
        description: "FP&A platform built for Excel users — consolidates data from ERPs, CRMs, and HRIs and layers AI-powered analytics on top without leaving your spreadsheets",
        types: ['All', 'AR/AP Automation']
    },
]

const VendorsSection = () => {
    const [activeType, setActiveType] = useState<string>('All');

    return (
        <div className="[background:radial-gradient(50%_80%_at_center,#4C203F,#040820)] md:[background:radial-gradient(40%_80%_at_top,#4C203F,#040820)] py-10 md:py-20 flex items-center w-full justify-center">
            <div className='flex flex-col items-center justify-center max-w-6xl w-full p-4 gap-14'>
                <div className="flex flex-col items-center flex-wrap gap-8">
                    <h2 className="text-h2 text-content-heading">Meet the Vendors</h2>
                    <div className="flex flex-row gap-4 flex-wrap justify-center max-w-4xl ">
                        {vendorTypes.map(type => (
                            <FilterButton key={type} label={type} variant={activeType === type ? 'active' : 'inactive'} onClick={() => setActiveType(type)} />
                        ))}
                    </div>
                </div>
                <div className="flex flex-row flex-wrap items-center gap-6 justify-center">
                    {vendors.filter(vendor => vendor.types.some(type => type === activeType)).map((vendor, i) => (
                        <VendorCard key={i} title={vendor.title} description={vendor.description} />
                    ))}
                </div>
                <div className="flex flex-col items-center w-full gap-4">
                    <Button label="Access expo" />
                    <p className="text-p-xsm text-content-heading">Super Early Bird Offer Ends Soon</p>
                </div>
            </div>
        </div>
    )
}

export default VendorsSection
