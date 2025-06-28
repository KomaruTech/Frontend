// src/app/router/app-router.tsx
import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LoginPage from '../../pages/Login';
import { PrivateRoute } from '../../shared/ui/layout/PrivateRoute';
import { AuthRedirectGuard } from '../../shared/lib/hooks/useAuthRedirectGuard';
import HomePage from "../../pages/Home";

export const AppRouter: React.FC = () => {
    return (
        <BrowserRouter>
            <Routes>
                <Route element={<AuthRedirectGuard />}>
                    <Route path="/login" element={<LoginPage />} />
                </Route>
                <Route element={<PrivateRoute />}>
                    <Route path="/" element={<HomePage />} />
                </Route>
                <Route path="*" element={<div>404 - Страница не найдена</div>} />
            </Routes>
        </BrowserRouter>
    );
};