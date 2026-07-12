import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'
import { fetchMainContent, type MainData } from '@/lib/wordpress'

const MainContentContext = createContext<MainData | null>(null)

export const useMainContent = () => useContext(MainContentContext)

export const MainContentProvider = ({ children }: { children: ReactNode }) => {
    const [data, setData] = useState<MainData | null>(null)

    useEffect(() => {
        fetchMainContent().then(setData).catch(console.error)
    }, [])

    return <MainContentContext.Provider value={data}>{children}</MainContentContext.Provider>
}