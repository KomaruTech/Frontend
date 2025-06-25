import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { HeroUIProvider, ToastProvider } from '@heroui/react'
import { Provider } from 'react-redux';
import { store } from './store';
import './index.css'
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <HeroUIProvider>
      <ToastProvider />
      <Provider store={store}>
        <App />
      </Provider>
    </HeroUIProvider>
  </StrictMode>,
)
