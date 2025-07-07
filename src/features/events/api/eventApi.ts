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
    avatarUrl?: string ;
}

// Interface for partial event update
export interface ApiUpdateEvent {
    id: string;
    name?: string;
    description?: string;
    timeStart?: string;
    timeEnd?: string;
    type?: string;
    location?: string;
    keywords?: string[];
    participants?: string[];
}


const handleAxiosError = (error: unknown, defaultMessage: string): string => {
    if (axios.isAxiosError(error)) {
        const axiosError = error as AxiosError<ApiErrorResponse>;
        return axiosError.response?.data?.error || axiosError.message;
    }
    return defaultMessage;
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

export const fetchInvitedEvents = async (options?: { signal?: AbortSignal }): Promise<ApiEvent[]> => {
    try {
        const response = await api.get<ApiEvent[]>('/Event/invited', {
            signal: options?.signal,
        });

        console.log('API Call: GET /Event/invited - Response:', response.data);

        if (Array.isArray(response.data)) {
            return response.data;
        } else if (response.status === 204) {
            console.warn('API Call: GET /Event/invited - Received 204 No Content, returning empty array.');
            return [];
        } else {
            console.warn('API Call: GET /Event/invited - Received non-array data:', response.data);
            return [];
        }

    } catch (error) {
        if (axios.isCancel(error)) {
            console.log('API Call: GET /Event/invited - Request was cancelled:', error.message);
            throw error;
        }

        const msg = handleAxiosError(error, 'Не удалось загрузить приглашённые мероприятия');
        console.error('API Call: GET /Event/invited - Error:', error);
        throw new Error(msg);
    }
};


export const respondToInvitation = async (
    eventId: string,
    status: 'approved' | 'rejected',
    options?: { signal?: AbortSignal }
): Promise<void> => {
    try {
        const response = await api.post(
            `/Event/${eventId}/respond_invitation`,
            {},
            {
                params: { status },
                signal: options?.signal,
            }
        );

        console.log(`API Call: POST /Event/${eventId}/respond_invitation?status=${status} - Response:`, response.data);
    } catch (error) {
        if (axios.isCancel(error)) {
            console.log(`API Call: POST /Event/${eventId}/respond_invitation - Request was cancelled:`, error.message);
            throw error;
        }

        const msg = handleAxiosError(error, 'Ошибка при отправке ответа на приглашение');
        console.error(`API Call: POST /Event/${eventId}/respond_invitation - Error:`, error);
        throw new Error(msg);
    }
};

export const updateEvent = async (
    eventId: string,
    eventData: ApiUpdateEvent,
    options?: { signal?: AbortSignal }
): Promise<ApiEvent> => {
    try {
        const response = await api.patch<ApiEvent>(
            `/Event/${eventId}`,
            eventData,
            { signal: options?.signal }
        );
        console.log(`API Call: PATCH /Event/${eventId} - Response:`, response.data);
        return response.data;
    } catch (error) {
        if (axios.isCancel(error)) {
            console.log(`API Call: PATCH /Event/${eventId} - Request was cancelled:`, error.message);
            throw error;
        }
        const msg = handleAxiosError(error, `Ошибка при обновлении мероприятия ${eventId}`);
        console.error(`API Call: PATCH /Event/${eventId} - Error:`, error);
        throw new Error(msg);
    }
};

export const deleteEvent = async (
    eventId: string,
    options?: { signal?: AbortSignal }
): Promise<void> => {
    try {
        const response = await api.delete(
            `/Event/${eventId}`,
            { signal: options?.signal }
        );
        console.log(`API Call: DELETE /Event/${eventId} - Response:`, response.status);
    } catch (error) {
        if (axios.isCancel(error)) {
            console.log(`API Call: DELETE /Event/${eventId} - Request was cancelled:`, error.message);
            throw error;
        }
        const msg = handleAxiosError(error, `Ошибка при удалении мероприятия ${eventId}`);
        console.error(`API Call: DELETE /Event/${eventId} - Error:`, error);
        throw new Error(msg);
    }
};