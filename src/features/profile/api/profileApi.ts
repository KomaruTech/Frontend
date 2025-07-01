import api from '@shared/api';
import type { UserProfile, UpdateProfilePayload, ChangePasswordPayload } from '@entities/user/model/types.ts';
import axios, { AxiosError } from 'axios';
import type { ApiErrorResponse } from '@shared/api/types';


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


export const fetchMyProfile = async (userId: string): Promise<UserProfile> => {
    try {
        const response = await api.get<UserProfile>(`/User/${userId}`);
        console.log(`API Call: GET /api/v1/User/${userId} - Response:`, response.data);
        return response.data;
    } catch (error) {
        const msg = handleAxiosError(error, `Неизвестная ошибка при загрузке профиля пользователя ${userId}`);
        console.error(`API Call: GET /api/v1/User/${userId} - Error:`, error);
        throw new Error(msg);
    }
};

export const updateMyProfile = async (payload: UpdateProfilePayload): Promise<UserProfile> => {
    try {
        const response = await api.patch<UserProfile>('/User/me/profile', payload);
        console.log('API Call: PATCH /api/v1/User/me/profile - Response:', response.data);
        return response.data;
    } catch (error) {
        const msg = handleAxiosError(error, 'Неизвестная ошибка обновления профиля');
        console.error('API Call: PATCH /api/v1/User/me/profile - Error:', error);
        throw new Error(msg);
    }
};

export const changeMyPassword = async (payload: ChangePasswordPayload): Promise<void> => {
    try {
        await api.patch<void>('/User/me/password', payload);
        console.log('API Call: PATCH /api/v1/User/me/password - Success');
    } catch (error) {
        const msg = handleAxiosError(error, 'Неизвестная ошибка при смене пароля');
        console.error('API Call: PATCH /api/v1/User/me/password - Error:', error);
        throw new Error(msg);
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
        const msg = handleAxiosError(error, 'Неизвестная ошибка при загрузке аватара');
        console.error('API Call: PATCH /api/v1/User/me/avatar - Error:', error);
        throw new Error(msg);
    }
};

export const deleteMyAvatar = async (): Promise<void> => {
    try {
        await api.delete<void>('/User/me/avatar');
        console.log('API Call: DELETE /api/v1/User/me/avatar - Success');
    } catch (error: unknown) {
        const msg = handleAxiosError(error, 'Неизвестная ошибка при удалении аватара');
        console.error('API Call: DELETE /api/v1/User/me/avatar - Error:', error);
        throw new Error(msg);
    }
};

export const fetchMyAvatar = async (avatarPath: string): Promise<Blob> => {
    try {
        const response = await api.get<Blob>(avatarPath, {
            responseType: 'blob',
        });
        return response.data;
    } catch (error) {
        const msg = handleAxiosError(error, `Неизвестная ошибка при загрузке аватара с пути ${avatarPath}`);
        console.error(`API Call: GET ${avatarPath} (as blob) - Error:`, error);
        throw new Error(msg);
    }
};