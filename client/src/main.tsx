import React from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { Home, OAuth, Request, Scope } from './pages'
import './index.css'
import { createTheme, ThemeProvider } from 'flowbite-react'

const customTheme = createTheme({
  button: {
    color: {
      primary:
        'bg-cyan-600 border border-cyan-600 hover:bg-cyan-700 focus:ring-cyan-500',
      secondary:
        'bg-black border border-cyan-600 hover:bg-cyan-700 focus:ring-cyan-500',
      failure:
        'bg-red-600 border border-red-600 hover:bg-red-700 focus:ring-red-500',
    },
  },
})

createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ThemeProvider theme={customTheme}>
      <Router>
        <Routes>
          <Route element={<Home />} path="/" />
          <Route element={<Scope />} path="/scope" />
          <Route element={<OAuth />} path="/oauth" />
          <Route element={<Request />} path="/request" />
        </Routes>
      </Router>
    </ThemeProvider>
  </React.StrictMode>
)
