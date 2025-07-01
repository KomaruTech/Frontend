// src/shared/lib/hooks/useAuthRedirectGuard.ts
import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';
import type { RootState } from '@app/store'; // Путь к RootState из app/store

export const AuthRedirectGuard: React.FC = () => {
    const token = useSelector((state: RootState) => state.auth.token);
    if (token) {
        return <Navigate to="/" replace />;
    }
    return <Outlet />;
};