import React from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { Home, OAuth, Request, Scope } from './pages'
import './index.css'

createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Router>
      <Routes>
        <Route element={<Home />} path="/" />
        <Route element={<Scope />} path="/scope" />
        <Route element={<OAuth />} path="/oauth" />
        <Route element={<Request />} path="/request" />
      </Routes>
    </Router>
  </React.StrictMode>
)
