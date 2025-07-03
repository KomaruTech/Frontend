import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';
import type { RootState } from '@app/store';

interface PrivateRouteProps {
    allowedRoles?: string[];
}
export const PrivateRoute: React.FC<PrivateRouteProps> = ({ allowedRoles }) => {
    const token = useSelector((state: RootState) => state.auth.token);
    const userRole = useSelector((state: RootState) => state.auth.user?.role);
    if (!token) {
        return <Navigate to="/login" replace />;
    }
    if (allowedRoles && !allowedRoles.includes(userRole || "")) {
        return <Navigate to="/" replace />;
    }
    return <Outlet />;
};
