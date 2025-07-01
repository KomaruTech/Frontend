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
        if (axiosError.response && axiosError.response.data && axiosError.response.data.error) {
            return axiosError.response.data.error;
        } else if (axiosError.message) {
            return axiosError.message;
        }
    } else if (error instanceof Error) {
        return error.message;
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