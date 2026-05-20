import { motion } from 'motion/react'
import type { PromoData } from '@/lib/wordpress'
import { useRegistration } from '../context/RegistrationContext'

const FALLBACK_RED_POINTS = [
    'Months of research with no clear direction',
    'Vendor demos that promise everything, deliver nothing',
    'AI pilots that cost budget and produce zero ROI',
    'Data governance gaps that expose your organisation',
    'Falling behind while competitors go AI-native',
]

const FALLBACK_GREEN_POINTS = [
    'A proven framework for evaluating AI tools in finance',
    'Real implementation playbooks from CFOs who shipped',
    'A secure data strategy you can present to the board',
    'Clear ROI metrics to get initiatives funded and scaled',
    'Confidence to lead your team into AI-native operations',
]

const XIcon = () => (
    <span className="flex items-center justify-center w-6 h-6 rounded-full bg-red-700 shrink-0">
        <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 12 12" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" d="M2 2l8 8M10 2l-8 8" />
        </svg>
    </span>
)

const CheckIcon = () => (
    <span className="flex items-center justify-center w-6 h-6 rounded-full bg-green-600 shrink-0">
        <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 12 12" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M2 6l3 3 5-5" />
        </svg>
    </span>
)

const Costs = ({ cmsData }: { cmsData?: PromoData['costs'] }) => {
    const { openModal } = useRegistration()
    const title = cmsData?.title ?? 'The cost of doing nothing'
    const subtitle = cmsData?.subtitle ?? 'Every month without a clear AI strategy is a month your competitors pull ahead. Here\'s what\'s at stake.'
    const redTitle = cmsData?.without_title ?? 'Without CFO AI Nexus'
    const greenTitle = cmsData?.with_title ?? 'With CFO AI Nexus'
    const redPoints = cmsData?.without_points?.length ? cmsData.without_points : FALLBACK_RED_POINTS
    const greenPoints = cmsData?.with_points?.length ? cmsData.with_points : FALLBACK_GREEN_POINTS

    return (
        <section className="min-h-screen flex flex-col items-center justify-center bg-linear-to-b from-sapphire-800 to-surface-page py-20 px-6 gap-12">

            {/* Title + subtitle */}
            <div className="flex flex-col items-center gap-3 text-center max-w-2xl w-full">
                <motion.h2
                    className="text-h2 text-content-heading font-bold"
                    initial={{ opacity: 0, y: 16 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5 }}
                >
                    {title}
                </motion.h2>
                <motion.p
                    className="text-p-md text-content-body text-balance whitespace-pre-line"
                    initial={{ opacity: 0, y: 16 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: 0.1 }}
                >
                    {subtitle}
                </motion.p>
            </div>

            {/* Two cards */}
            <div className="flex flex-col sm:flex-row gap-6 w-full max-w-6xl">

                {/* Red card — Without */}
                <motion.div
                    className="flex-1 rounded-2xl p-8 flex flex-col gap-6 border-[#DA2C38] border"
                    style={{ background: 'linear-gradient(to top, rgba(116,23,30,0.5), rgba(218,44,56,0.5))' }}
                    initial={{ opacity: 0, y: 24 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5 }}
                >
                    <h3 className="text-h4 text-content-heading font-bold">{redTitle}</h3>
                    <ul className="flex flex-col gap-4">
                        {redPoints.map((point, i) => (
                            <li key={i} className={`flex items-start gap-4 py-2 ${i < redPoints.length - 1 ? 'border-b border-[#A3465A]' : ''}`}>
                                <XIcon />
                                <span className="text-p-md text-content-heading">{point}</span>
                            </li>
                        ))}
                    </ul>
                </motion.div>

                {/* Green card — With */}
                <motion.div
                    className="flex-1 rounded-2xl p-8 flex flex-col gap-6 border-[#0EAD69] border"
                    style={{ background: 'linear-gradient(to top, rgba(6,71,43,0.5), rgba(14,173,105,0.5))' }}
                    initial={{ opacity: 0, y: 24 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: 0.15 }}
                >
                    <h3 className="text-h4 text-content-heading font-bold">{greenTitle}</h3>
                    <ul className="flex flex-col gap-4">
                        {greenPoints.map((point, i) => (
                            <li key={i} className={`flex items-start gap-4 py-2 ${i < greenPoints.length - 1 ? 'border-b border-[#307865]' : ''}`}>
                                <CheckIcon />
                                <span className="text-p-md text-content-heading">{point}</span>
                            </li>
                        ))}
                    </ul>
                </motion.div>

            </div>
            <motion.div
                className="flex flex-col items-center gap-3"
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
            >
                <button
                    onClick={openModal}
                    className="px-8 py-4 bg-[#A3E7FC] text-[#040820] rounded-full text-p-md-semibold hover:brightness-95 transition-all"
                >
                    Join Free Masterclass
                </button>
                <p className="text-p-sm text-content-body text-center">30,000+ finance leaders trust this masterclass<br />Seats are limited.</p>
            </motion.div>
        </section>
    )
}

export default Costs