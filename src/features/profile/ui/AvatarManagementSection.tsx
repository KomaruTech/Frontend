// src/features/profile/ui/AvatarManagementSection.tsx
import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Button, Divider } from "@heroui/react";
import axios, { AxiosError } from 'axios';

import {
    uploadAvatarPending,
    uploadAvatarFailure,
    deleteAvatarPending,
    deleteAvatarFailure,
    clearAvatarStatus
} from "@features/profile/model/profileSlice";
import { uploadMyAvatar, deleteMyAvatar } from "@features/profile/api/profileApi";
import { setUserProfileData } from '@features/auth/model/authSlice';
import type { RootState } from '@app/store';
import type { ApiErrorResponse } from '@shared/api/types';

interface AvatarManagementSectionProps {
    triggerReloadWithAlert: (title: string, message: string, type: 'success' | 'error') => void;
}

export const AvatarManagementSection: React.FC<AvatarManagementSectionProps> = ({ triggerReloadWithAlert }) => {
    const dispatch = useDispatch();
    const authUser = useSelector((state: RootState) => state.auth.user);
    const { isUploadingAvatar, uploadAvatarError, isDeletingAvatar, deleteAvatarError } = useSelector((state: RootState) => state.profile);

    const [selectedAvatarFile, setSelectedAvatarFile] = useState<File | null>(null);
    useEffect(() => {
        const errorMsg = uploadAvatarError || deleteAvatarError;
        if (errorMsg) {
            triggerReloadWithAlert(uploadAvatarError ? 'Ошибка загрузки аватара' : 'Ошибка удаления аватара', errorMsg, 'error');
            dispatch(clearAvatarStatus());
        }
    }, [uploadAvatarError, deleteAvatarError, dispatch, triggerReloadWithAlert]);

    const handleAvatarFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setSelectedAvatarFile(file);
        } else {
            setSelectedAvatarFile(null);
        }
    };

    const handleAvatarUpload = async () => {
        if (!selectedAvatarFile) {
            triggerReloadWithAlert('Ошибка', 'Пожалуйста, выберите файл аватара.', 'error');
            return;
        }
        dispatch(uploadAvatarPending());
        try {
            const formData = new FormData();
            formData.append('Avatar', selectedAvatarFile);
            const data = await uploadMyAvatar(formData);
            dispatch(setUserProfileData({ ...authUser!, avatarUrl: data.avatarUrl }));
            triggerReloadWithAlert('Успех!', 'Аватар успешно загружен.', 'success');
        } catch (err: unknown) {
            let msg = 'Неизвестная ошибка загрузки аватара';
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
            triggerReloadWithAlert('Ошибка загрузки аватара', msg, 'error');
            dispatch(uploadAvatarFailure(msg));
            window.location.reload();
        }
    };

    const handleAvatarDelete = async () => {
        dispatch(deleteAvatarPending());
        try {
            await deleteMyAvatar();
            dispatch(setUserProfileData({ ...authUser!, avatarUrl: undefined }));
            triggerReloadWithAlert('Успех!', 'Аватар успешно удален.', 'success');
            window.location.reload();
        } catch (err: unknown) {
            let msg = 'Неизвестная ошибка удаления аватара';
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
            triggerReloadWithAlert('Ошибка удаления аватара', msg, 'error');
            dispatch(deleteAvatarFailure(msg));
            window.location.reload();
        }
    };

    return (
        <>
            <h3 className="text-xl font-semibold text-gray-800 mb-6">Управление аватаром</h3>
            <div className="flex flex-col sm:flex-row items-center gap-4 mb-6">
                <label className="block w-full cursor-pointer bg-blue-50 hover:bg-blue-100 text-blue-800 font-semibold py-3 px-4 rounded-lg border border-blue-200 transition-colors duration-200">
                    <input type="file" accept="image/*" className="hidden" onChange={handleAvatarFileChange}/>
                    Выбрать файл аватара
                </label>
                <Button color="primary" onPress={handleAvatarUpload} isLoading={isUploadingAvatar}
                        isDisabled={!selectedAvatarFile}>
                    Загрузить аватар
                </Button>
                {authUser?.avatarUrl && (
                    <Button color="danger" variant="flat" onPress={handleAvatarDelete}
                            isLoading={isDeletingAvatar}>
                        Удалить аватар
                    </Button>
                )}
            </div>
            <Divider className="my-8"/>
        </>
    );
};