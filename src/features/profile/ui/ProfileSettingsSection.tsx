// src/features/profile/ui/ProfileSettingsSection.tsx
import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Input, Button, Divider } from "@heroui/react";
import axios, { AxiosError } from 'axios';

import {
    updateProfilePending,
    updateProfileFailure,
    clearUpdateProfileStatus
} from "@features/profile/model/profileSlice";
import { updateMyProfile } from "@features/profile/api/profileApi";
import { setUserProfileData } from '@features/auth/model/authSlice';
import type { UserProfile, UpdateProfilePayload } from "@entities/user/model/types.ts";
import type { RootState } from '@app/store';
import type { ApiErrorResponse } from '@shared/api/types';

interface ProfileSettingsSectionProps {
    triggerReloadWithAlert: (title: string, message: string, type: 'success' | 'error') => void;
    profile: UserProfile | null;
}

export const ProfileSettingsSection: React.FC<ProfileSettingsSectionProps> = ({ triggerReloadWithAlert, profile }) => {
    const dispatch = useDispatch();
    const authUser = useSelector((state: RootState) => state.auth.user);
    const { isUpdatingProfile, updateProfileError } = useSelector((state: RootState) => state.profile);

    const [profileFormData, setProfileFormData] = useState<UpdateProfilePayload>({ name: '', surname: '', email: '', telegramUsername: undefined });
    useEffect(() => {
        if (profile) {
            setProfileFormData({
                name: profile.name, surname: profile.surname ?? '', email: profile.email,
                telegramUsername: profile.telegramUsername ?? undefined,
            });
        }
    }, [profile]);
    useEffect(() => {
        if (updateProfileError) {
            triggerReloadWithAlert('Ошибка обновления профиля', updateProfileError, 'error');
            dispatch(clearUpdateProfileStatus());
        }
    }, [updateProfileError, dispatch, triggerReloadWithAlert]);

    const handleProfileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        const updatedName = name === 'telegramId' ? 'telegramUsername' : name;
        setProfileFormData(prev => ({ ...prev, [updatedName]: value }));
    };

    const onProfileFormSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        dispatch(updateProfilePending());
        try {
            await updateMyProfile(profileFormData);
            dispatch(setUserProfileData({ ...authUser!, ...profileFormData })); // Обновляем данные authUser сразу
            triggerReloadWithAlert('Успех!', 'Профиль успешно обновлен.', 'success');
            window.location.reload();
        } catch (err: unknown) {
            let msg = 'Неизвестная ошибка обновления профиля';
            if (axios.isAxiosError(err)) {
                const axiosError = err as AxiosError<ApiErrorResponse>;
                if (axiosError.response && axiosError.response.data && axiosError.response.data.error) {
                    msg = axiosError.response.data.error;
                } else if (axiosError.message) {
                    msg = axiosError.message;
                }
            } else if (err instanceof Error) {
                msg = err.message;
            }
            triggerReloadWithAlert('Ошибка обновления профиля', msg, 'error');
            dispatch(updateProfileFailure(msg));
            window.location.reload();
        }
    };

    return (
        <form onSubmit={onProfileFormSubmit}>
            <h3 className="text-xl font-semibold text-gray-800 mb-6">Общие настройки</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                <Input label="Имя" name="name" placeholder="Ваше имя" variant="bordered"
                       value={profileFormData.name} onChange={handleProfileInputChange}/>
                <Input label="Фамилия" name="surname" placeholder="Ваша фамилия" variant="bordered"
                       value={profileFormData.surname} onChange={handleProfileInputChange}/>
                <Input label="Электронная почта" name="email" type="email" placeholder="Ваша электронная почта" variant="bordered"
                       value={profileFormData.email} onChange={handleProfileInputChange}/>
                <Input label="ID Telegram" name="telegramId" placeholder="@ваш_id_telegram"
                       variant="bordered" value={profileFormData.telegramUsername || ''}
                       onChange={handleProfileInputChange}/>
            </div>
            <div className="flex justify-end mt-6">
                <Button type="submit" color="primary" isLoading={isUpdatingProfile}>Сохранить</Button>
            </div>
            <Divider className="my-8"/>
        </form>
    );
};