import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import BalancePage from './BalancePage.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BalancePage />
  </StrictMode>,
)
