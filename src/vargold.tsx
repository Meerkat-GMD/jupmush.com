import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { pageLang } from './lib/lang.ts'
import VargoldPage from './VargoldPage.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <VargoldPage lang={pageLang()} />
  </StrictMode>,
)
