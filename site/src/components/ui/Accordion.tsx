import { createContext, useContext, useState } from 'react'
import { ChevronDown } from 'lucide-react'
import { motion, AnimatePresence } from 'motion/react'

const BORDER_GRADIENT = 'linear-gradient(to right, #FC69D2, #8F9DFF)'
const OPEN_GRADIENT = 'linear-gradient(to right, #4C203F, #040820, #1F2566)'
const SURFACE = '#040820'

type AccordionCtx = { open: string | null; toggle: (v: string) => void }
const AccordionContext = createContext<AccordionCtx>({ open: null, toggle: () => { } })

export const Accordion = ({ children }: { children: React.ReactNode }) => {
    const [open, setOpen] = useState<string | null>(null)
    const toggle = (v: string) => setOpen(prev => prev === v ? null : v)
    return (
        <AccordionContext.Provider value={{ open, toggle }}>
            <div className="flex flex-col gap-3 w-full">{children}</div>
        </AccordionContext.Provider>
    )
}

export const AccordionItem = ({ value, trigger, children }: { value: string; trigger: string; children: React.ReactNode }) => {
    const { open, toggle } = useContext(AccordionContext)
    const isOpen = open === value

    return (
        <div className="rounded-lg p-px" style={{ background: BORDER_GRADIENT }}>
            <div className="relative rounded-[calc(0.65rem-1.5px)] overflow-hidden">
                {/* Base background — always dark */}
                <div className="absolute inset-0" style={{ background: SURFACE }} />
                {/* Open gradient overlay — fades in/out via opacity so CSS can animate it */}
                <div
                    className="absolute inset-0 transition-opacity duration-300"
                    style={{ background: OPEN_GRADIENT, opacity: isOpen ? 1 : 0 }}
                />

                {/* Content sits on top */}
                <div className="relative z-10">
                    <button
                        onClick={() => toggle(value)}
                        className="w-full flex items-center justify-between gap-4 px-6 py-5 text-left cursor-pointer"
                    >
                        <span className="text-p-lg-semibold text-content-heading">{trigger}</span>
                        <ChevronDown
                            className="size-5 text-content-body shrink-0 transition-transform duration-300"
                            style={{ transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)' }}
                        />
                    </button>

                    <AnimatePresence initial={false}>
                        {isOpen && (
                            <motion.div
                                key="content"
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: 'auto', opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                transition={{ duration: 0.3, ease: 'easeInOut' }}
                                className="overflow-hidden"
                            >
                                <div className="px-6 pb-5 text-p-md text-content-heading">
                                    {children}
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </div>
    )
}