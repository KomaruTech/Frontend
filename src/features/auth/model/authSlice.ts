import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

interface AuthState {
    user: {
        id: string;
        login: string;
        name: string;
        surname?: string; // Добавлено
        email: string;
        telegramId?: string; // Добавлено
        avatarUrl?: string; // Добавлено
    } | null;
    token: string | null;
    isLoading: boolean;
    error: string | null;
}

interface UserAuth {
    id: string;
    login: string;
    name: string;
    surname?: string; // Добавлено
    email: string;
    telegramId?: string; // Добавлено
    avatarUrl?: string; // Добавлено
}

interface LoginResponse {
    user: UserAuth;
    token: string;
}

const getInitialAuthState = (): AuthState => {
    try {
        const storedUser = localStorage.getItem('user');
        const userObject: AuthState['user'] = storedUser ? JSON.parse(storedUser) : null;
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
        setAuthData: (state, action: PayloadAction<{ user: AuthState['user']; token: string | null } | null>) => {
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
        logout: (state) => {
            state.user = null;
            state.token = null;
            state.isLoading = false;
            state.error = null;
            localStorage.removeItem('user');
            localStorage.removeItem('token');
        },
        setUserProfileData: (state, action: PayloadAction<Partial<AuthState['user']>>) => {
            if (state.user) {
                state.user = { ...state.user, ...action.payload };
                localStorage.setItem('user', JSON.stringify(state.user)); // Обновляем localStorage
            }
        },
    },
});

export const { loginSuccess, logout, loginPending, loginFailure, setAuthData, setUserProfileData } = authSlice.actions;
export const authActions = authSlice.actions;
export const authReducer = authSlice.reducer;