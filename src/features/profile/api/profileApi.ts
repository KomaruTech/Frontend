// src/features/profile/api/profileApi.ts
import api from '@shared/api';
import type { UserProfile, UpdateProfilePayload, ChangePasswordPayload } from '@entities/user/model/types.ts';

export const fetchMyProfile = async (userId: string): Promise<UserProfile> => {
    try {
        const response = await api.get<UserProfile>(`/User/${userId}`);
        console.log(`API Call: GET /api/v1/User/${userId} - Response:`, response.data);
        return response.data;
    } catch (error) {
        console.error(`API Call: GET /api/v1/User/${userId} - Error:`, error);
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
        return response.data;
    } catch (error) {
        console.error('API Call: PATCH /api/v1/User/me/password - Error:', error);
        throw error;
    }
};

export const uploadMyAvatar = async (formData: FormData): Promise<{ avatarUrl: string }> => {
    try {
        const response = await api.patch<{ avatarUrl: string }>('/User/me/avatar', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        console.log('API Call: PATCH /api/v1/User/me/avatar - Response:', response.data);
        return response.data;
    } catch (error: unknown) {
        console.error('API Call: PATCH /api/v1/User/me/avatar - Error:', error);
        if (error instanceof Error) {
            throw error;
        }
        throw new Error('Неизвестная ошибка при загрузке аватара');
    }
};

export const deleteMyAvatar = async (): Promise<void> => {
    try {
        await api.delete<void>('/User/me/avatar');
        console.log('API Call: DELETE /api/v1/User/me/avatar - Success');
    } catch (error: unknown) {
        console.error('API Call: DELETE /api/v1/User/me/avatar - Error:', error);
        if (error instanceof Error) {
            throw error;
        }
        throw new Error('Неизвестная ошибка при удалении аватара');
    }
};


export const fetchMyAvatar = async (avatarPath: string): Promise<Blob> => {
    try {
        // Мы используем относительный путь, который приходит от API (например, /User/id/avatar)
        const response = await api.get<Blob>(avatarPath, {
            responseType: 'blob', // Очень важная опция!
        });
        return response.data;
    } catch (error) {
        console.error(`API Call: GET ${avatarPath} (as blob) - Error:`, error);
        throw error;
    }
};