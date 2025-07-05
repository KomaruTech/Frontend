// @features/events/api/eventApi.ts
import api from '@shared/api';
import axios, { AxiosError } from 'axios';
import type { ApiErrorResponse } from '@shared/api/types';

export interface ApiEvent {
    id: string;
    name: string;
    description: string;
    timeStart: string;
    timeEnd: string;
    location?: string;
    type: string;
    status: string;
    createdById: string;
    keywords: string[];
    participantIds: string[];
    teamIds: string[];
}

export interface ApiUser {
    id: string;
    login: string;
    name: string;
    surname: string;
    role: string;
    email: string;
    telegramUsername?: string;
    avatarUrl?: string;
}

const handleAxiosError = (error: unknown, defaultMessage: string): string => {
    if (axios.isAxiosError(error)) {
        const axiosError = error as AxiosError<ApiErrorResponse>;
        return axiosError.response?.data?.error || axiosError.message;
    }
    return defaultMessage;
};

export const fetchEvents = async (options?: { signal?: AbortSignal }): Promise<ApiEvent[]> => {
    try {
        const response = await api.get<ApiEvent[]>('/Event/my_events', { signal: options?.signal });
        console.log('API Call: GET /Event/my_events - Response:', response.data);

        if (Array.isArray(response.data)) {
            return response.data;
        } else if (response.status === 204) {
            console.warn('API Call: GET /Event/my_events - Received 204 No Content, returning empty array.');
            return [];
        }
        else {
            console.warn('API Call: GET /Event/my_events - Received non-array data:', response.data);
            return [];
        }

    } catch (error) {
        if (axios.isCancel(error)) {
            console.log('API Call: GET /Event/my_events - Request was cancelled:', error.message);
            throw error;
        }
        const msg = handleAxiosError(error, 'Неизвестная ошибка при загрузке событий');
        console.error('API Call: GET /Event/my_events - Error:', error);
        throw new Error(msg);
    }
};


export const fetchUserById = async (userId: string, options?: { signal?: AbortSignal }): Promise<ApiUser> => {
    try {
        const response = await api.get<ApiUser>(`/User/${userId}`, { signal: options?.signal });
        console.log(`API Call: GET /User/${userId} - Response:`, response.data);
        return response.data;
    } catch (error) {
        if (axios.isCancel(error)) {
            console.log(`API Call: GET /User/${userId} - Request was cancelled:`, error.message);
            throw error;
        }
        const msg = handleAxiosError(error, `Неизвестная ошибка при загрузке данных пользователя ${userId}`);
        console.error(`API Call: GET /User/${userId} - Error:`, error);
        throw new Error(msg);
    }
};