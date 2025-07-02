// @features/events/api/eventApi.ts
import api from '@shared/api';
import axios, { AxiosError } from 'axios';
import type { ApiErrorResponse } from '@shared/api/types';

export interface ApiEvent {
    id: number;
    title: string;
    subtitle: string;
    description: string;
    date: string;
    time: string;
    type?: string;
    address?: string;
    creator?: string;
    keywords?: string[];
}

const handleAxiosError = (error: unknown, defaultMessage: string): string => {
    if (axios.isAxiosError(error)) {
        const axiosError = error as AxiosError<ApiErrorResponse>;
        return axiosError.response?.data?.error || axiosError.message;
    }
    return defaultMessage;
};

export const fetchEvents = async (): Promise<ApiEvent[]> => {
    try {
        const response = await api.post<ApiEvent[]>('/Event/search', {});
        console.log('API Call: POST /Event/search - Response:', response.data);
        return response.data;
    } catch (error) {
        const msg = handleAxiosError(error, 'Неизвестная ошибка при загрузке событий');
        console.error('API Call: POST /Event/search - Error:', error);
        throw new Error(msg);
    }
};
