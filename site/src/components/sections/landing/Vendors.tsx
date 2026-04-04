import { useState } from "react"
import { motion, AnimatePresence } from "motion/react"
import Button from "@/components/ui/Button"
import FilterButton from "@/components/ui/FilterButton"
import VendorCard from "@/components/ui/VendorCard"
import { Link } from "@tanstack/react-router"

const vendorTypes = ['Accounting & ERP', 'Financial Close', 'FP&A', 'Spend Management', 'AR/AP Automation', 'Global Payments', 'Treasury']
const vendors = [
    {
        image: '/assets/partners/anaplan 1.svg',
        title: "Anaplan",
        description: "AI-connected planning platform unifying FP&A, supply chain, and workforce planning for enterprise-scale scenario modeling and continuous forecasting.",
        types: ['FP&A'],
        link: 'https://www.anaplan.com/'
    },
    {
        image: '/assets/partners/prophix 1.svg',
        title: "ProPhix",
        description: "The next generation of financial performance, using AI to automate budgeting, forecasting, and reporting for more confident and strategic decision-making.",
        types: ['FP&A'],
        link: 'https://www.prophix.com/'
    },
    {
        image: '/assets/partners/workday 1.svg',
        title: "Workday Adaptive Planning",
        description: "Powerful, fast, and easy-to-use business planning software that helps teams collaborate and forecast with agility in a rapidly changing world.",
        types: ['FP&A'],
        link: 'https://www.workday.com/en-us/products/adaptive-planning/overview.html'
    },
    {
        image: '/assets/partners/sage_intacct.svg',
        title: "Sage Intacct",
        description: "A powerful financial system focused on providing AI-powered accounting like scanning transactions in real-time to catch duplicate entries or anomalies.",
        types: ['Accounting & ERP'],
        link: 'https://www.sage.com/en-us/sage-business-cloud/intacct/'
    },
    {
        image: '/assets/partners/maxima.webp',
        title: "Maxima",
        description: "AI-powered financial intelligence that automates complex data analysis, providing CFOs with predictive insights to drive faster business growth.",
        types: ['Accounting & ERP'],
        link: 'https://www.maxima.ai/ '
    },
    {
        image: '/assets/partners/rillet.svg',
        title: "Rillet",
        description: "The modern ERP for SaaS companies that automates revenue recognition and expense tracking by connecting directly to your CRM and payment stack.",
        types: ['Accounting & ERP'],
        link: 'https://www.rillet.com/ '
    },
    {
        image: '/assets/partners/floqast 1.svg',
        title: "FloQast",
        description: "Enables automation of the financial close process, enhancing accuracy and collaboration through an intuitive, AI-enhanced workflow.",
        types: ['Financial Close'],
        link: 'https://www.floqast.com/ '
    },
    {
        image: '/assets/partners/consark.webp',
        title: "Consark.ai",
        description: "From first entry to final report. AI-powered financial close automation executed by agents and expert-reviewed, delivering a 50% faster close.",
        types: ['Financial Close'],
        link: 'https://consark.ai/'
    },
    {
        image: '/assets/partners/iris_carbon.svg',
        title: "IRIS Carbon",
        description: "Simplifying complex disclosure. A single platform for ESEF, iXBRL, and regulatory reporting that ensures 100% compliance with maximum accuracy.",
        types: ['Financial Close'],
        link: 'https://iriscarbon.com/ '
    },
    {
        image: '/assets/partners/brex 1.svg',
        title: "Brex",
        description: "Corporate cards and spend management in one. Automate global expenses and reconciliations with real-time visibility and built-in AI compliance.",
        types: ['Spend Management'],
        link: 'https://www.brex.com/'
    },
    {
        image: '/assets/partners/expensify 1.svg',
        title: "Expensify",
        description: "Payments and expenses made easy. Automate everything from receipt tracking to bill pay and corporate cards in one app designed for speed.",
        types: ['Spend Management'],
        link: 'https://www.expensify.com/'
    },
    {
        image: '/assets/partners/navan 1.svg',
        title: "Navan",
        description: "Travel and expense, reinvented. An all-in-one platform using AI to automate reporting, eliminate manual expense claims, and drive massive corporate savings.",
        types: ['Spend Management'],
        link: 'https://navan.com/'
    },
    {
        image: '/assets/partners/bill_com 1.svg',
        title: "Bill",
        description: "Automated finance operations for SMBs. Simplify accounts payable and receivable through a smart platform that gives you total control over cash flow.",
        types: ['AR/AP Automation'],
        link: 'https://www.bill.com/'
    },
    {
        image: '/assets/partners/Sequence.webp',
        title: "Sequence",
        description: "The billing infrastructure for scale. Automate complex B2B pricing models, quote-to-cash workflows, and revenue collection with one integrated data-driven system.",
        types: ['AR/AP Automation'],
        link: 'https://www.sequencehq.com/'
    },
    {
        image: '/assets/partners/hyperbots.webp',
        title: "Hyperbots",
        description: "AI-native robots for finance. Handle accounts payable, receivable, and expenses with human-like intelligence, delivering 10x speed and zero manual errors.",
        types: ['AR/AP Automation'],
        link: 'https://www.hyperbots.com/ '
    },
    {
        image: '/assets/partners/airwallex.svg',
        title: "Airwallex",
        description: "Global financial infrastructure for modern business. Scale across borders with automated international payments, treasury management.",
        types: ['Global Payments'],
        link: 'https://www.airwallex.com/'
    },
    {
        image: '/assets/partners/paddle.svg',
        title: "Paddle",
        description: "The all-in-one SaaS growth engine. A Merchant of Record that automates global payments, tax compliance, and subscriptions so you can scale anywhere.",
        types: ['Global Payments'],
        link: 'https://www.paddle.com/'
    },
    {
        image: '/assets/partners/lu.webp',
        title: "Lumanu",
        description: "Automate talent payments, contract management, and budget tracking to streamline your entire external workforce operations.",
        types: ['Global Payments'],
        link: 'https://www.lumanu.com/'
    },
    {
        image: '/assets/partners/nilus.svg',
        title: "Nilus",
        description: "An AI platform that automates payment reconciliation and ledger management, ensuring your banks and internal systems always match perfectly.",
        types: ['Treasury'],
        link: 'https://www.nilus.com/'
    },
    {
        image: '/assets/partners/kyriba 1.svg',
        title: "Kyriba",
        description: "Liquidity performance without limits. AI-driven treasury intelligence to optimize cash visibility, manage risk, and move capital with total global control.",
        types: ['Treasury'],
        link: 'https://www.kyriba.com/ '
    },
    {
        image: '/assets/partners/highradius 1.svg',
        title: "Highradius",
        description: "AI-powered software that automates Order-to-Cash and Treasury, reducing DSO and optimizing working capital for the world's largest enterprises.",
        types: ['Treasury'],
        link: 'https://www.highradius.com/'
    },
]


const VendorsSection = () => {
    const [activeType, setActiveType] = useState<string>('Accounting & ERP')

    return (
        <div className="[background:radial-gradient(50%_80%_at_center,#4C203F,#040820)] md:[background:radial-gradient(40%_80%_at_top,#4C203F,#040820)] py-10 md:py-20 flex items-center w-full justify-center">
            <div className='flex flex-col items-center justify-center max-w-6xl w-full p-4 gap-14'>
                <div className="flex flex-col items-center flex-wrap gap-8">
                    <div className="flex flex-col items-center gap-4 max-w-xl">
                        <motion.h2
                            className="text-h2 text-content-heading"
                            initial={{ opacity: 0, y: 32 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: "-80px" }}
                            transition={{ duration: 0.6, ease: "easeOut" }}
                        >
                            Solutions We’re Watching
                        </motion.h2>
                        <motion.p
                            className="text-p-md text-pink-200 text-center text-balance max-w-3xl"
                            initial={{ opacity: 0, y: 32 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: "-80px" }}
                            transition={{ duration: 0.6, ease: "easeOut", delay: 0.3 }}
                        >
                            Explore the next generation of financial technologies. This is a dynamic watchlist of industry pioneers, subject to change as we finalize our official partnership and exhibitor roster.
                        </motion.p>
                    </div>
                    <motion.div
                        className="flex flex-row gap-4 flex-wrap justify-center max-w-4xl"
                        initial={{ opacity: 0, y: 24 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-80px" }}
                        transition={{ duration: 0.6, ease: "easeOut", delay: 0.2 }}
                    >
                        {vendorTypes.map(type => (
                            <FilterButton key={type} label={type} variant={activeType === type ? 'active' : 'inactive'} onClick={() => setActiveType(type)} />
                        ))}
                    </motion.div>
                </div>

                <AnimatePresence mode="wait">
                    <motion.div
                        key={activeType}
                        className="flex flex-row flex-wrap items-stretch gap-6 justify-center"
                        exit={{ opacity: 0, y: -12, transition: { duration: 0.2, ease: "easeIn" } }}
                    >
                        {vendors.filter(vendor => vendor.types.some(t => t === activeType)).map((vendor, i) => (
                            <motion.div
                                key={i}
                                className="flex"
                                initial={{ opacity: 0, y: 24 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true, margin: "-40px" }}
                                transition={{ duration: 0.4, ease: "easeOut", delay: i * 0.08 }}
                            >
                                <VendorCard imageUrl={vendor.image} title={vendor.title} description={vendor.description} />
                            </motion.div>
                        ))}
                    </motion.div>
                </AnimatePresence>

                <motion.div
                    className="flex flex-col items-center w-full gap-4"
                    initial={{ opacity: 0, y: 24 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-80px" }}
                    transition={{ duration: 0.6, ease: "easeOut" }}
                >
                    <Link to="/checkout">
                        <Button label="Access Expo" />
                    </Link>
                    <p className="text-p-xsm text-content-heading">Super Early Bird Offer Ends Soon</p>
                </motion.div>
            </div>
        </div>
    )
}

export default VendorsSection