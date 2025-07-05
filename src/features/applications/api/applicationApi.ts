import api from '@shared/api';
import axios, { AxiosError } from 'axios';
import type { ApiErrorResponse } from '@shared/api/types';
import type { ApiEvent } from '@features/events/api/eventApi';

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

export const confirmEvent = async (eventId: string): Promise<void> => {
    try {
        await api.post(`/Event/${eventId}/confirm_event`);
    } catch (error) {
        const msg = handleAxiosError(error, 'Ошибка при подтверждении мероприятия');
        throw new Error(msg);
    }
};

export const rejectEvent = async (eventId: string): Promise<void> => {
    try {
        await api.post(`/Event/${eventId}/reject_event`);
    } catch (error) {
        const msg = handleAxiosError(error, 'Ошибка при отклонении мероприятия');
        throw new Error(msg);
    }
};

export const fetchEventsModeration = async (): Promise<ApiEvent[]> => {
    try {
        const response = await api.get<ApiEvent[]>('/Event/suggested');
        if (Array.isArray(response.data)) {
            return response.data;
        } else if (response.status === 204) {
            return [];
        } else {
            return [];
        }
    } catch (error) {
        const msg = handleAxiosError(error, 'Не удалось загрузить предложенные мероприятия');
        console.error('API Call: GET /Event/suggested - Error:', msg);
        throw new Error(msg);
    }
};

export const getUserById = async (userId: string): Promise<ApiUser> => {
    try {
        const response = await api.get<ApiUser>(`/User/${userId}`);
        return response.data;
    } catch (error) {
        const msg = handleAxiosError(error, 'Ошибка при получении информации о пользователе');
        throw new Error(msg);
    }
};
