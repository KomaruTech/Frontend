import api from '@shared/api';
import type { ApiErrorResponse } from '@shared/api/types';
import axios, { AxiosError } from 'axios';

export type EventType = "general" | "personal" | "group";

export interface ApiEvent {
    id: string;
    name: string;
    description: string;
    timeStart: string;
    timeEnd: string;
    location: string;
    createdById: string;
    type: EventType;
    keywords: string[];
    status: string;
}

const handleAxiosError = (error: unknown, defaultMessage: string): string => {
    if (axios.isAxiosError(error)) {
        const axiosError = error as AxiosError<ApiErrorResponse>;
        return axiosError.response?.data?.error || axiosError.message || defaultMessage;
    } else if (error instanceof Error) {
        return error.message;
    }
    return defaultMessage;
};

export const fetchEvents = async (options?: { signal?: AbortSignal }): Promise<ApiEvent[]> => {
    try {
        const response = await api.post<ApiEvent[]>('/Event/search', {}, { signal: options?.signal });
        console.log('API Call: POST /Event/search - Response:', response.data);

        if (Array.isArray(response.data)) {
            return response.data.filter(event => event.status === 'confirmed');
        } else if (response.status === 204) {
            console.warn('API Call: POST /Event/search - Received 204 No Content, returning empty array.');
            return [];
        } else {
            console.warn('API Call: POST /Event/search - Received non-array data:', response.data);
            return [];
        }
    } catch (error) {
        if (axios.isCancel(error)) {
            console.log('API Call: POST /Event/search - Request was cancelled:', error.message);
            throw error;
        }
        const msg = handleAxiosError(error, 'Неизвестная ошибка при загрузке событий');
        console.error('API Call: GET /Event/my_events - Error:', error);
        throw new Error(msg);
    }
};