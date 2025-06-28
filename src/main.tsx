import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { HeroUIProvider, ToastProvider } from '@heroui/react'
import './shared/assets/styles/index.css';
import {Application} from './app'

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <HeroUIProvider>
            <ToastProvider />
            <Application />
        </HeroUIProvider>
    </StrictMode>,
)
