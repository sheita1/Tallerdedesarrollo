import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'

// 🚨 NOTA: Aquí NO ponemos BrowserRouter, porque ya está dentro de App.tsx
ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)