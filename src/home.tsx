import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { pageLang } from './lib/lang.ts'
import HomePage from './HomePage.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <HomePage lang={pageLang()} />
  </StrictMode>,
)
