import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { testGanacheConnection } from './services/ganacheRpc.ts'

// Test Ganache connectivity on startup — check browser console for result
testGanacheConnection();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
