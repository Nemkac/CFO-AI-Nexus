import { createContext, useContext } from 'react'

// The agenda modal lives in the root layout so any part of the page — the header CTA,
// the footer "Program Agenda" link — can open the same instance.
type AgendaModalContextValue = {
    openAgenda: () => void
}

export const AgendaModalContext = createContext<AgendaModalContextValue>({
    openAgenda: () => {},
})

export const useAgendaModal = () => useContext(AgendaModalContext)
