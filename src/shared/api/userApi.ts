// src/shared/api/userApi.ts
import api from '@shared/api';
import axios, { AxiosError } from 'axios';
import type { ApiErrorResponse } from '@shared/api/types';

export interface ApiUser {
    id: string;
    login: string;
    name: string;
    surname: string;
    role: string;
    email: string;
    telegramUsername: string | null;
    avatarUrl: string | null;
}

const handleAxiosError = (error: unknown, defaultMessage: string): string => {
    if (axios.isAxiosError(error)) {
        const axiosError = error as AxiosError<ApiErrorResponse>;
        return axiosError.response?.data?.error || axiosError.message;
    }
    return defaultMessage;
};

export const fetchUserById = async (userId: string): Promise<ApiUser> => {
    try {
        const response = await api.get<ApiUser>(`/User/${userId}`);
        return response.data;
    } catch (error) {
        throw new Error(handleAxiosError(error, `Ошибка при получении информации о пользователе ${userId}`));
    }
};