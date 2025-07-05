import api from '@shared/api';
import { AxiosError } from 'axios';
import type { ApiErrorResponse } from '@shared/api/types.ts';

export interface PostEventDto {
    name: string;
    description: string;
    timeStart: string;
    timeEnd: string;
    type: 'general' | 'group' | 'personal';
    location: string;
    keywords: string[];
    participants: string[];
    teams: string[];
}

export interface UserSearchPayload {
    query: string;
    role: string;
}

export interface UserSearchResponse {
    id: string;
    login: string;
    name: string;
    surname: string;
    role: string;
    email: string;
    telegramUsername: string;
    avatarUrl: string;
}

export interface TeamSearchPayload {
    name: string;
}

export interface TeamSearchResponse {
    id: string;
    name: string;
}

// Отправка предложения мероприятия
export const postEventSuggestion = async (payload: PostEventDto): Promise<void> => {
    try {
        await api.post('/Event/suggest', payload);
    } catch (error) {
        const err = error as AxiosError<ApiErrorResponse>;
        const message = err.response?.data?.error || err.message || 'Ошибка при отправке предложения';
        throw new Error(message);
    }
};

// Поиск пользователей по запросу
export const searchUsers = async (query: string): Promise<UserSearchResponse[]> => {
    try {
        const response = await api.post<UserSearchResponse[]>('/User/search', { query, role: 'member' });
        return response.data;
    } catch (error) {
        const err = error as AxiosError<ApiErrorResponse>;
        const message = err.response?.data?.error || err.message || 'Ошибка при поиске пользователей';
        console.error('Error searching users:', error);
        throw new Error(message);
    }
};

// Поиск команд по названию
export const searchTeams = async (name: string): Promise<TeamSearchResponse[]> => {
    try {
        const response = await api.post<TeamSearchResponse[]>('/teams/search', { name });
        return response.data;
    } catch (error) {
        const err = error as AxiosError<ApiErrorResponse>;
        const message = err.response?.data?.error || err.message || 'Ошибка при поиске команд';
        console.error('Error searching teams:', error);
        throw new Error(message);
    }
};
