import { motion } from 'motion/react'
import Button from '@/components/ui/Button'
import { useRegistration } from '@/promo/context/RegistrationContext'

const cards = [
    { number: '85%', label: 'Attendees', description: 'MIT research shows the vast majority deliver no measurable ROI. Most teams pilot tools nobody adopts — and CFOs sign the bill.' },
    { number: '12mo', label: 'Expert Speakers', description: 'Webinars. Whitepapers. Vendor demos. Most finance leaders spend a year "exploring" — and ship nothing. Meanwhile, peers go AI-native.' },
    { number: '19%', label: 'Live Sessions', description: 'You can’t start building without a secure foundation. Now, the priority has shifted from "can we use AI" to "how do we ensure data privacy and governance.' },
    { number: '95%', label: 'Satisfaction Rate', description: 'Joined by 10,000+ finance leaders. Seats are limited.' },
]

const Numbers = () => {
    const { openModal } = useRegistration()
    return (
        <section className="bg-[#06091a] py-20 px-6 flex flex-col items-center">
            <div className="flex flex-col items-center gap-3 mb-14 max-w-6xl w-full text-center">
                <motion.h2
                    className="text-h2 text-content-heading"
                    initial={{ opacity: 0, y: 16 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: 0.1 }}
                >
                    The AI hype is loud. The actual roadmap is missing.
                </motion.h2>
                <motion.p
                    className="text-p-md text-content-body text-balance"
                    initial={{ opacity: 0, y: 16 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                >
                    Every CFO knows AI is coming. Few know what to do on Monday morning. Vendors promise the world. The board wants answers. Your team is waiting for direction. And the cost of getting it wrong keeps climbing.
                </motion.p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 w-full max-w-6xl">
                {cards.map((card, i) => (
                    <motion.div
                        key={i}
                        className="flex flex-col p-8 gap-6 rounded-2xl items-center text-center border-purple-100 border-[0.5px] bg-linear-to-r from-purple-800 to-sapphire-800"
                        initial={{ opacity: 0, y: 24 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: i * 0.1 }}
                    >
                        {i === cards.length - 1 ? (
                            <div className='flex flex-col w-full items-center justify-center h-full gap-6'>
                                <Button variant="sky" label="Reserve Your Seat" onClick={openModal} />
                                <p className="text-p-md text-content-heading text-balance">{card.description}</p>
                            </div>
                        ) : (
                            <>
                                <div className='flex flex-col gap-2 items-center w-full'>
                                    <span className="text-h2 text-content-heading font-bold leading-none">{card.number}</span>
                                    <span className="text-h5 text-content-heading">{card.label}</span>
                                </div>
                                <p className="text-p-md text-content-heading text-balance">{card.description}</p>
                            </>
                        )}
                    </motion.div>
                ))}
            </div>
        </section>
    )
}

export default Numbers