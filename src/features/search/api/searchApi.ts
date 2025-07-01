// src/features/search/api/searchApi.ts
import api from '@shared/api';
import axios, { AxiosError } from 'axios';
import type { ApiErrorResponse } from '@shared/api/types';

export type SearchEventRequest = {
    name?: string;
    keywords?: string[];
    startSearchTime?: string;
    endSearchTime?: string;
    status?: string;
};

export interface Event {
    id: string;
    name: string;
    description?: string;
    timeStart: string;
    timeEnd: string;
    type: "general" | "meeting" | "webinar" | "conference";
    location?: string;
    createdById: string;
    keywords?: string[];
    status: "pending" | "confirmed" | "cancelled";
}

const handleAxiosError = (error: unknown, defaultMessage: string): string => {
    if (axios.isAxiosError(error)) {
        const axiosError = error as AxiosError<ApiErrorResponse>;
        if (axiosError.response?.data?.error) {
            return axiosError.response.data.error;
        } else if (axiosError.message) {
            return axiosError.message;
        }
    } else if (error instanceof Error) {
        return error.message;
    }
    return defaultMessage;
};

export const searchEvents = async (payload: SearchEventRequest): Promise<Event[]> => {
    try {
        const response = await api.post<Event[]>('/Event/search', payload);
        if (process.env.NODE_ENV === 'development') {
            console.log('API Call: POST /api/v1/Event/search - Response:', response.data);
        }
        return response.data;
    } catch (error) {
        const msg = handleAxiosError(error, 'Неизвестная ошибка при поиске мероприятий');
        console.error('API Call: POST /api/v1/Event/search - Error:', error);
        throw new Error(msg);
    }
};