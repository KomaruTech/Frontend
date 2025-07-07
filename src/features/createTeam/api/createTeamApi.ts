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

export interface ApiTeam {
    id: string;
    name: string;
    description: string;
    ownerId: string;
    users: ApiUser[];
}

export interface CreateTeamRequest {
    name: string;
    description: string;
    userIds: string[];
}

const handleAxiosError = (error: unknown, defaultMessage: string): string => {
    if (axios.isAxiosError(error)) {
        const axiosError = error as AxiosError<ApiErrorResponse>;
        // Prioritize specific error messages from the API response
        return axiosError.response?.data?.error || axiosError.message;
    }
    return defaultMessage;
};

export const createTeam = async (data: CreateTeamRequest): Promise<ApiTeam> => {
    try {
        const response = await api.post<ApiTeam>('/teams/create', data);
        return response.data;
    } catch (error) {
        throw new Error(handleAxiosError(error, 'Ошибка при создании команды'));
    }
};

export const fetchTeamById = async (teamId: string): Promise<ApiTeam> => {
    try {
        const response = await api.get<ApiTeam>(`/teams/${teamId}`);
        return response.data;
    } catch (error) {
        throw new Error(handleAxiosError(error, 'Ошибка при загрузке информации о команде'));
    }
};

export const deleteTeam = async (teamId: string): Promise<void> => {
    try {
        await api.delete(`/teams/${teamId}`);
    } catch (error) {
        throw new Error(handleAxiosError(error, 'Ошибка при удалении команды'));
    }
};

export const searchTeams = async (name = ''): Promise<ApiTeam[]> => {
    try {
        const response = await api.post<ApiTeam[]>('/teams/search', { name });
        return response.data ?? [];
    } catch (error) {
        throw new Error(handleAxiosError(error, 'Ошибка при поиске команд'));
    }
};

export const searchMyTeams = async (name = ''): Promise<ApiTeam[]> => {
    try {
        const response = await api.post<ApiTeam[]>('/teams/search_my_teams', { name });
        return response.data ?? [];
    } catch (error) {
        throw new Error(handleAxiosError(error, 'Ошибка при поиске команд'));
    }
};

export const removeTeamMember = async (teamId: string, userId: string): Promise<ApiTeam> => {
    try {
        const response = await api.delete<ApiTeam>(`/teams/${teamId}/member/${userId}?teamId=${teamId}`);
        return response.data;
    } catch (error) {
        throw new Error(handleAxiosError(error, 'Ошибка при удалении участника из команды'));
    }
};

export const addTeamMember = async (teamId: string, userId: string): Promise<ApiTeam> => {
    try {
        const response = await api.post<ApiTeam>(`/teams/${teamId}/member/${userId}?teamId=${teamId}`);
        return response.data;
    } catch (error) {
        throw new Error(handleAxiosError(error, 'Ошибка при добавлении участника в команду'));
    }
};