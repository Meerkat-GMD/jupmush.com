import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import PlayDataPage from './PlayDataPage.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <PlayDataPage />
  </StrictMode>,
)
