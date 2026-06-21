import React from 'react'
import { BrowserRouter } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext'
import { BusinessProvider } from './contexts/BusinessContext'
import AppRoutes from './routes'
import './index.css'

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <BusinessProvider>
          <div className="min-h-screen bg-gray-50">
            <AppRoutes />
          </div>
        </BusinessProvider>
      </AuthProvider>
    </BrowserRouter>
  )
}

export default App
