// src/features/auth/model/authSlice.ts
import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { AuthState, User, LoginResponse } from '../../../entities/auth'; // Импортируем типы

const getInitialAuthState = (): AuthState => {
    try {
        const storedUser = localStorage.getItem('user');
        const userObject: User | null = storedUser ? JSON.parse(storedUser) : null;
        const token = localStorage.getItem('token');
        return {
            user: userObject,
            token: token,
            isLoading: false,
            error: null,
        };
    } catch (e) {
        console.error("Ошибка при чтении или парсинге пользователя из localStorage:", e);
        localStorage.removeItem('user');
        localStorage.removeItem('token');
        return {
            user: null,
            token: null,
            isLoading: false,
            error: null,
        };
    }
};

const initialState: AuthState = getInitialAuthState();

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        setAuthData: (state, action: PayloadAction<{ user: User | null; token: string | null } | null>) => {
            if (action.payload === null) {
                state.user = null;
                state.token = null;
                localStorage.removeItem('user');
                localStorage.removeItem('token');
            } else {
                state.user = action.payload.user;
                state.token = action.payload.token;
                if (action.payload.user) localStorage.setItem('user', JSON.stringify(action.payload.user));
                if (action.payload.token) localStorage.setItem('token', action.payload.token);
            }
            state.error = null;
            state.isLoading = false;
        },
        loginPending: (state) => {
            state.isLoading = true;
            state.error = null;
        },
        loginSuccess: (state, action: PayloadAction<LoginResponse>) => {
            state.isLoading = false;
            state.user = action.payload.user;
            state.token = action.payload.token;
            localStorage.setItem('user', JSON.stringify(action.payload.user));
            localStorage.setItem('token', action.payload.token);
        },
        loginFailure: (state, action: PayloadAction<string | null>) => {
            state.isLoading = false;
            state.error = action.payload;
            state.user = null;
            state.token = null;
            localStorage.removeItem('user');
            localStorage.removeItem('token');
        },
        // Добавляем отдельный logout редьюсер для использования в LogoutButton
        logout: (state) => {
            state.user = null;
            state.token = null;
            state.isLoading = false;
            state.error = null;
            localStorage.removeItem('user');
            localStorage.removeItem('token');
        }
    },
});

export const { loginSuccess, logout, loginPending, loginFailure, setAuthData } = authSlice.actions;
export const authActions = authSlice.actions; // Объект со всеми экшенами
export const authReducer = authSlice.reducer; // Экспорт редьюсера по умолчанию