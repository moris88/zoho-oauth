import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { Home, OAuth, Request } from './pages'
import './index.css'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/oauth" element={<OAuth />} />
        <Route path="/request" element={<Request />} />
      </Routes>
    </Router>
  </StrictMode>,
)
