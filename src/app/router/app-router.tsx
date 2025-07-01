// src/app/router/app-router.tsx
import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LoginPage from '@pages/Login';
import { PrivateRoute } from '@app/router/components/PrivateRoute.tsx';
import { AuthRedirectGuard } from '@app/router/components/useAuthRedirectGuard.tsx';
import HomePage from "@pages/Home";
import EditMyProfilePage from "@pages/EditMyProfilePage/ui/EditMyProfilePage.tsx";
import EventsPage from "@pages/EventsPage/ui/EventsPage.tsx"

export const AppRouter: React.FC = () => {
    return (
        <BrowserRouter>
            <Routes>
                <Route element={<AuthRedirectGuard />}>
                    <Route path="/login" element={<LoginPage />} />
                </Route>
                <Route element={<PrivateRoute />}>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/profile/me/edit" element={<EditMyProfilePage />} />
                    <Route path="/events" element={<EventsPage />}/>
                </Route>
                <Route path="*" element={<div>404 - Страница не найдена</div>} />
            </Routes>
        </BrowserRouter>
    );
};