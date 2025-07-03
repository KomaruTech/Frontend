import api from '@shared/api';
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

export interface NotificationPreferences {
    id: string;
    notifyTelegram: boolean;
    notifyBeforeOneDay: boolean;
    notifyBeforeOneHour: boolean;
}

export const fetchNotificationPreferences = async (): Promise<NotificationPreferences> => {
    try {
        const response = await api.get<NotificationPreferences>('/User/me/notification_preferences');
        console.log('API Call: GET /api/v1/User/me/notification_preferences - Response:', response.data);
        return response.data;
    } catch (error) {
        const msg = handleAxiosError(error, 'Неизвестная ошибка при загрузке настроек уведомлений');
        console.error('API Call: GET /api/v1/User/me/notification_preferences - Error:', error);
        throw new Error(msg);
    }
};

export const updateNotificationPreferences = async (payload: Omit<NotificationPreferences, 'id'>): Promise<NotificationPreferences> => {
    try {
        const response = await api.patch<NotificationPreferences>('/User/me/notification_preferences', payload);
        console.log('API Call: PATCH /api/v1/User/me/notification_preferences - Response:', response.data);
        return response.data;
    } catch (error) {
        const msg = handleAxiosError(error, 'Неизвестная ошибка при обновлении настроек уведомлений');
        console.error('API Call: PATCH /api/v1/User/me/notification_preferences - Error:', error);
        throw new Error(msg);
    }
};