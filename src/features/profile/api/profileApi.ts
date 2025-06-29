import api from '@shared/api'; // Импортируем ваш актуальный API-клиент
import type { UserProfile, UpdateProfilePayload, ChangePasswordPayload } from '@entities/user/model/types.ts';

export const fetchMyProfile = async (userLogin: string): Promise<UserProfile> => {
    try {
        // Исправлено: Используем правильный метод GET и маршрут с {login}
        const response = await api.get<UserProfile>(`/User/${userLogin}`);
        console.log(`API Call: GET /api/v1/User/${userLogin} - Response:`, response.data);
        return response.data;
    } catch (error) {
        console.error(`API Call: GET /api/v1/User/${userLogin} - Error:`, error);
        throw error;
    }
};

export const updateMyProfile = async (payload: UpdateProfilePayload): Promise<UserProfile> => {
    try {
        const response = await api.patch<UserProfile>('/User/me/profile', payload);
        console.log('API Call: PATCH /api/v1/User/me/profile - Response:', response.data);
        return response.data;
    } catch (error) {
        console.error('API Call: PATCH /api/v1/User/me/profile - Error:', error);
        throw error;
    }
};


export const changeMyPassword = async (payload: ChangePasswordPayload): Promise<void> => {
    try {
        const response = await api.patch<void>('/User/me/password', payload);
        console.log('API Call: PATCH /api/v1/User/me/password - Success');
        return response.data; // Ответ может быть пустым для void
    } catch (error) {
        console.error('API Call: PATCH /api/v1/User/me/password - Error:', error);
        throw error;
    }
};