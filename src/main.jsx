import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import '@fontsource-variable/oswald'
import './styles/tokens-index.css'
import './styles/base.css'
import './styles/app.css'
import './styles/home.css'
import './styles/ficha.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
