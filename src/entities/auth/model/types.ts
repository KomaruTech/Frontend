// src/entities/auth/model/types.ts

// Интерфейс для пользователя, как он приходит с сервера
export interface User {
    id: string;
    login: string;
    name: string;
    surname: string;
    role: string;
    email: string;
    telegramId: string | null;
    notificationPreferencesId: string;
    avatar: string | null;
}

// Интерфейс для данных, отправляемых при входе
export interface LoginPayload {
    login: string;
    password: string;
}

// Интерфейс для ответа сервера при успешном входе
export interface LoginResponse {
    user: User;
    token: string;
}

// Интерфейс для состояния Redux-слайса аутентификации
export interface AuthState {
    user: User | null;
    token: string | null;
    isLoading: boolean;
    error: string | null;
}