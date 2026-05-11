import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './styles.css'
import PromoApp from './promo/App'

createRoot(document.getElementById('promo-root')!).render(
    <StrictMode>
        <PromoApp />
    </StrictMode>
)
