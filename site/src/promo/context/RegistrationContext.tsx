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

export const RegistrationProvider = ({ children }: { children: React.ReactNode }) => {
    const [open, setOpen] = useState(false)
    return (
        <RegistrationContext.Provider value={{ open, openModal: () => setOpen(true), closeModal: () => setOpen(false) }}>
            {children}
        </RegistrationContext.Provider>
    )
}