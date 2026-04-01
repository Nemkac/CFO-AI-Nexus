import { createFileRoute } from '@tanstack/react-router'
import { motion } from 'motion/react'

export const Route = createFileRoute('/organizer')({
    component: RouteComponent,
})

const cardShadow = 'inset 0 1px 0 rgba(201, 208, 255, 0.2), inset 0 -1px 0 rgba(77, 93, 255, 0.12), inset 1px 0 0 rgba(201, 208, 255, 0.1), inset -1px 0 0 rgba(77, 93, 255, 0.08), inset 0 0 48px rgba(201, 208, 255, 0.04)'

function RouteComponent() {
    return (
        <div className='bg-linear-to-br from-surface-secondary/30 via-surface-page to-pink-900 py-10 md:py-20 flex items-center w-full justify-center gap-10 md:gap-20 flex-col p-4'>
            <motion.h1
                className='text-h1 text-content-heading'
                initial={{ opacity: 0, y: 32 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-80px' }}
                transition={{ duration: 0.6, ease: 'easeOut' }}
            >
                About the Organizers
            </motion.h1>

            <div className='flex flex-col md:flex-row md:items-stretch items-center justify-center gap-8'>
                <motion.div
                    className="flex flex-col max-w-xl rounded-2xl border border-stroke-default/25 backdrop-blur-sm bg-purple-800/10 p-4 md:p-8 gap-4"
                    style={{ boxShadow: cardShadow }}
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: '-80px' }}
                    transition={{ duration: 0.6, ease: 'easeOut', delay: 0.1 }}
                >
                    <h4 className='text-h4 text-content-heading'>Corporate Finance Hub</h4>
                    <p className='text-p-md text-content-body text-left flex-1'>
                        A premier learning and innovation platform dedicated to the next generation of finance leaders. We specialize in the intersection of finance and Artificial Intelligence, providing professionals with the tools to navigate the digital transformation of the industry (bojanfin.com).
                    </p>
                </motion.div>

                <motion.div
                    className="flex flex-col max-w-xl w-full rounded-2xl border border-stroke-default/25 backdrop-blur-sm bg-purple-800/10 p-4 md:p-8 gap-4"
                    style={{ boxShadow: cardShadow }}
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: '-80px' }}
                    transition={{ duration: 0.6, ease: 'easeOut', delay: 0.25 }}
                >
                    <h4 className='text-h4 text-content-heading'>WTS Tax & Finance</h4>
                    <p className='text-p-md text-content-body text-left flex-1'>
                        A top-tier consulting firm and a proud member of WTS Global. With a presence in more than 100 countries, WTS Global is a leading independent tax and financial network, offering world-class expertise and global reach to multinational clients (wts.com).
                    </p>
                </motion.div>
            </div>

            <div className='flex flex-col md:flex-row items-center justify-center w-full gap-6 md:gap-10'>
                <motion.div
                    className='rounded-full p-1.25'
                    style={{ background: 'linear-gradient(to bottom right, #8F9DFF, #FC69D2)' }}
                    initial={{ opacity: 0, x: -60 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true, margin: '-80px' }}
                    transition={{ duration: 0.7, ease: 'easeOut' }}
                >
                    <img src='./assets/speaker1.webp' className='rounded-full block' />
                </motion.div>

                <motion.div
                    className='flex flex-col gap-4 md:gap-6 items-center md:items-left'
                    initial={{ opacity: 0, x: 60 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true, margin: '-80px' }}
                    transition={{ duration: 0.7, ease: 'easeOut', delay: 0.15 }}
                >
                    <h1 className='text-h1 text-content-heading'>Bojan Radojičić</h1>
                    <p className='text-[16px] md:text-[24px] text-content-heading tracking-wide'>Founder of CFO AI Nexus</p>
                </motion.div>
            </div>
        </div>
    )
}
