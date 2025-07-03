// src/features/profile/ui/AvatarManagementSection.tsx

import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Button, Divider } from "@heroui/react";
import axios, { AxiosError } from 'axios';

import {
    uploadAvatarPending,
    uploadAvatarSuccess,
    uploadAvatarFailure,
    deleteAvatarPending,
    deleteAvatarSuccess,
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
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);

    useEffect(() => {
        const errorMsg = uploadAvatarError || deleteAvatarError;
        if (errorMsg) {
            triggerReloadWithAlert(
                uploadAvatarError ? 'Ошибка загрузки аватара' : 'Ошибка удаления аватара',
                errorMsg,
                'error'
            );
            dispatch(clearAvatarStatus());
        }
    }, [uploadAvatarError, deleteAvatarError, dispatch, triggerReloadWithAlert]);

    // generate preview URL when file changes
    useEffect(() => {
        if (selectedAvatarFile) {
            const url = URL.createObjectURL(selectedAvatarFile);
            setPreviewUrl(url);
            return () => URL.revokeObjectURL(url);
        }
        setPreviewUrl(null);
    }, [selectedAvatarFile]);

    const handleAvatarFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSelectedAvatarFile(e.target.files?.[0] ?? null);
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
            dispatch(uploadAvatarSuccess(data.avatarUrl));
            triggerReloadWithAlert('Успех!', 'Аватар успешно загружен.', 'success');
        } catch (err: unknown) {
            let msg = 'Неизвестная ошибка загрузки аватара';
            if (axios.isAxiosError(err)) {
                const axiosError = err as AxiosError<ApiErrorResponse>;
                msg = axiosError.response?.data?.error ?? axiosError.message;
            } else if (err instanceof Error) {
                msg = err.message;
            }
            dispatch(uploadAvatarFailure(msg));
            triggerReloadWithAlert('Ошибка загрузки аватара', msg, 'error');
        }
    };

    const handleAvatarDelete = async () => {
        dispatch(deleteAvatarPending());
        try {
            await deleteMyAvatar();
            dispatch(setUserProfileData({ ...authUser!, avatarUrl: undefined }));
            dispatch(deleteAvatarSuccess());
            triggerReloadWithAlert('Успех!', 'Аватар успешно удален.', 'success');
        } catch (err: unknown) {
            let msg = 'Неизвестная ошибка удаления аватара';
            if (axios.isAxiosError(err)) {
                const axiosError = err as AxiosError<ApiErrorResponse>;
                msg = axiosError.response?.data?.error ?? axiosError.message;
            } else if (err instanceof Error) {
                msg = err.message;
            }
            dispatch(deleteAvatarFailure(msg));
            triggerReloadWithAlert('Ошибка удаления аватара', msg, 'error');
        }
    };

    return (
        <>
            <h3 className="text-xl font-semibold text-gray-800 mb-6">Управление аватаром</h3>
            <div className="flex flex-col sm:flex-row items-center gap-4 mb-6">
                <label className="flex items-center w-full cursor-pointer bg-blue-50 hover:bg-blue-100 text-blue-800 font-semibold py-3 px-4 rounded-lg border border-blue-200 transition-colors duration-200">
                    <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleAvatarFileChange}
                    />
                    {selectedAvatarFile && previewUrl ? (
                        <div className="flex items-center gap-3 w-full">
                            <img
                                src={previewUrl}
                                alt="Превью аватара"
                                className="w-10 h-10 object-cover rounded-full flex-shrink-0"
                            />
                            <span className="break-words flex-grow">
                {selectedAvatarFile.name}
              </span>
                        </div>
                    ) : (
                        <span>Выбрать файл аватара</span>
                    )}
                </label>

                <Button
                    color="primary"
                    onPress={handleAvatarUpload}
                    isLoading={isUploadingAvatar}
                    isDisabled={!selectedAvatarFile}
                >
                    Загрузить аватар
                </Button>

                {authUser?.avatarUrl && (
                    <Button
                        color="danger"
                        variant="flat"
                        onPress={handleAvatarDelete}
                        isLoading={isDeletingAvatar}
                    >
                        Удалить аватар
                    </Button>
                )}
            </div>
            <Divider className="my-8" />
        </>
    );
};
