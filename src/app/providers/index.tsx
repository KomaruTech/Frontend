// src/app/providers/index.ts
import React from 'react';
import { StoreProvider } from './store-provider';

interface ProvidersProps {
    children: React.ReactNode;
}

export const Providers: React.FC<ProvidersProps> = ({ children }) => {
    return (
        <StoreProvider>
            {children}
        </StoreProvider>
    )
};