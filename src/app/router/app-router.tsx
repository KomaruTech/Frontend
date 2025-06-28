// src/app/router/app-router.tsx
import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LoginPage from '../../pages/Login';
import { PrivateRoute } from '../../shared/ui/layout/PrivateRoute';
import { AuthRedirectGuard } from '../../shared/lib/hooks/useAuthRedirectGuard';

export const AppRouter: React.FC = () => {
    return (
        <BrowserRouter>
            <Routes>
                <Route element={<AuthRedirectGuard />}>
                    <Route path="/login" element={<LoginPage />} />
                </Route>
                <Route element={<PrivateRoute />}>
                    <Route path="/" element={<div>Home</div>} />
                </Route>
                <Route path="*" element={<div>404 - Страница не найдена</div>} />
            </Routes>
        </BrowserRouter>
    );
};