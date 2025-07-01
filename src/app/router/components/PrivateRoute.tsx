// src/shared/ui/layout/PrivateRoute.tsx
import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';
import type { RootState } from '@app/store';

export const PrivateRoute: React.FC = () => {
    const token = useSelector((state: RootState) => state.auth.token);
    if (!token) {
        return <Navigate to="/login" replace />;
    }
    return <Outlet />;
};