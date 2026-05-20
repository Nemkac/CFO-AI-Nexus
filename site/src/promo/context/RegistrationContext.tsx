import { createContext, useContext, useState } from 'react'

type RegistrationContextType = {
    open: boolean
    openModal: () => void
    closeModal: () => void
}

const RegistrationContext = createContext<RegistrationContextType>({
    open: false,
    openModal: () => {},
    closeModal: () => {},
})

export const useRegistration = () => useContext(RegistrationContext)

declare function gtag(...args: unknown[]): void

export const RegistrationProvider = ({ children }: { children: React.ReactNode }) => {
    const [open, setOpen] = useState(false)
    const openModal = () => {
        setOpen(true)
        if (typeof gtag !== 'undefined') gtag('event', 'registration_modal_open')
    }
    return (
        <RegistrationContext.Provider value={{ open, openModal, closeModal: () => setOpen(false) }}>
            {children}
        </RegistrationContext.Provider>
    )
}