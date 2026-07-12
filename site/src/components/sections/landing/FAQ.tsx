import type React from 'react'
import { motion } from 'motion/react'
import { Accordion, AccordionItem } from '@/components/ui/Accordion'
import { useMainContent } from '@/components/layout/MainContentContext'

const FAQS: { value: string; trigger: string; content: React.ReactNode }[] = [
    {
        value: 'faq-1',
        trigger: 'When does the conference take place?',
        content: 'October 20-21, 2026, from 10:00 AM to 4:00 PM EST or 4:00 PM to 10:00 PM CET each day.',
    },
    {
        value: 'faq-2',
        trigger: 'Is this fully virtual?',
        content: 'Yes — 100% virtual, hosted on a dedicated event platform. You\'ll receive your access link 48 hours before the conference starts.',
    },
    {
        value: 'faq-3',
        trigger: 'How do I access the conference?',
        content: 'All registered attendees receive a unique access link with login instructions in the days before the event, plus reminders leading up to the start. Our support team is on standby throughout the event to help with any technical issues — you\'ll never be left without assistance.',
    },
    {
        value: 'faq-4',
        trigger: 'Can my company purchase tickets on behalf of attendees?',
        content: 'Yes. You can register and pay for colleagues using a single payment method (corporate card or invoice).',
    },
    {
        value: 'faq-5',
        trigger: 'Who is this conference for?',
        content: 'Senior finance leaders — CFOs, VPs of Finance, Finance Directors, and Controllers — at mid-market and enterprise companies actively evaluating or implementing AI in finance operations.',
    },
    {
        value: 'faq-6',
        trigger: 'What exactly is included in the ticket?',
        content: (
            <ul className="flex flex-col gap-1 list-disc list-inside">
                <li>Live access to all 35+ speaker sessions in two days</li>
                <li>Access to 7 different stages: FP&A, Accounting, Treasury, Automations, and others</li>
                <li>1:1 meetings with other participants, knowledge partners, and vendors</li>
                <li>Testing different tools on the expo with vendor representatives</li>
                <li>Demo of any product exhibited on the expo stage</li>
                <li>Certificate of attendance if requested</li>
                <li>Claude for Finance — last updated e-book</li>
                <li>And much more</li>
            </ul>
        ),
    },
    {
        value: 'faq-7',
        trigger: 'How is this different from other conferences?',
        content: 'Most AI or Finance events are built for engineers or product teams. This is the only conference designed specifically for finance leaders, covering deployment, governance, audit-readiness, and ROI from the CFO\'s perspective.',
    },
    {
        value: 'faq-8',
        trigger: 'Will I be able to ask questions during sessions?',
        content: 'Yes, most sessions include a live Q&A segment, and we work with all speakers to incorporate one wherever possible. Throughout the event, our team of consultants is active in the live feed answering your questions in real time. Vendor experts organised by category are also available so whatever your question — strategic, technical, or implementation-related — you\'ll get answers from the right people.',
    },
    {
        value: 'faq-9',
        trigger: 'Is my data secure when I register?',
        content: 'Yes. We use Stripe for payment processing (PCI-DSS Level 1 compliant) and never store your card details. Personal data is handled per GDPR requirements.',
    },
    {
        value: 'faq-10',
        trigger: 'Will my information be shared with sponsors?',
        content: 'Sponsors of the event receive an attendee list with company name, role, and work email. You can opt out of sponsor communications at any time.',
    },
    {
        value: 'faq-11',
        trigger: 'Why do you require a work email?',
        content: 'This is a B2B event for finance professionals at companies — your work email confirms you\'re part of the audience this conference is designed for, which keeps the community focused and the discussions relevant. Your registration stays with you even if you change companies; just let us know your new work email and we\'ll update your access. If you\'re an independent consultant without a company email, email us at support@cfoainexus.com and we\'ll review your registration manually.',
    },
    {
        value: 'faq-12',
        trigger: 'How can I contact you?',
        content: 'You can email us at support@cfoainexus.com.',
    },
]

const FAQSection = () => {
    const cms = useMainContent()
    const faqs = cms?.faq?.length
        ? cms.faq.map((item, i) => ({
            value: `faq-${i}`,
            trigger: item.question,
            content: <p className="whitespace-pre-line">{item.answer}</p> as React.ReactNode,
        }))
        : FAQS

    return (
    <section className="py-10 md:py-20 flex flex-col gap-10 items-center w-full justify-center bg-surface-page px-6">
        <motion.h2
            className="text-h2 text-content-heading text-center"
            initial={{ opacity: 0, y: 32 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
        >
            Frequently Asked Questions
        </motion.h2>

        <motion.div
            className="w-full max-w-6xl"
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.6, ease: 'easeOut', delay: 0.15 }}
        >
            <Accordion>
                {faqs.map(({ value, trigger, content }) => (
                    <AccordionItem key={value} value={value} trigger={trigger}>
                        {content}
                    </AccordionItem>
                ))}
            </Accordion>
        </motion.div>
    </section>
    )
}

export default FAQSection