import { createContext, useContext } from 'react'

interface PageLoadContextValue {
  isLoaded: boolean
  signalReady: () => void
}

export const PageLoadContext = createContext<PageLoadContextValue>({
  isLoaded: false,
  signalReady: () => {},
})

export const usePageLoad = () => useContext(PageLoadContext)
