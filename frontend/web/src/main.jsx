import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import App from './App.jsx'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: { fontFamily: 'Inter, sans-serif' },
          success: { style: { background: '#1e4019', color: '#fff' } },
          error: { style: { background: '#991b1b', color: '#fff' } },
        }}
      />
    </BrowserRouter>
  </React.StrictMode>
)
