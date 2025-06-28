// src/features/auth/api/authApi.ts
import api from '@shared/api';
import type { LoginPayload, LoginResponse} from '@entities/auth';

export const login = async (payload: LoginPayload): Promise<LoginResponse> => {
    try {
        const response = await api.post<LoginResponse>('/auth/login', payload);
        return response.data;
    } catch (error) {
        console.error('Ошибка при входе через API:', error);
        throw error;
    }
};