// src/pages/profile/ui/EditMyProfilePage.tsx
import React, { useState, useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Spinner, Card, useDisclosure, Avatar, CardBody } from "@heroui/react";
import { useNavigate, useSearchParams } from 'react-router-dom';

import {
    fetchProfileFailure,
    fetchProfilePending,
    fetchProfileSuccess,
} from "@features/profile/model/profileSlice";
import { fetchMyProfile, fetchMyAvatar } from "@features/profile/api/profileApi";
import { setUserProfileData } from '@features/auth/model/authSlice';
import type { RootState } from '@app/store';

import { AvatarManagementSection } from "@features/profile/ui/AvatarManagementSection";
import { ProfileSettingsSection } from "@features/profile/ui/ProfileSettingsSection";
import { ChangePasswordSection } from "@features/profile/ui/ChangePasswordSection";
import { AlertDialog } from "@shared/ui/AlertDialog";

const EditMyProfilePage: React.FC = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate(); // Для изменения URL-параметров
    const [searchParams, setSearchParams] = useSearchParams(); // Для работы с URL-параметрами

    const authUser = useSelector((state: RootState) => state.auth.user);
    const { profile, isLoading, error } = useSelector((state: RootState) => state.profile);

    const { isOpen: isAlertOpen, onOpen: openAlert, onOpenChange: onAlertOpenChange } = useDisclosure();
    const [alertTitle, setAlertTitle] = useState('');
    const [alertMessage, setAlertMessage] = useState('');
    const [alertType, setAlertType] = useState<'success' | 'error'>('success');

    const [currentProfileAvatarUrl, setCurrentProfileAvatarUrl] = useState<string | null>(null);
    const handleOpenAlertDialog = useCallback((title: string, message: string, type: 'success' | 'error') => {
        setAlertTitle(title);
        setAlertMessage(message);
        setAlertType(type);
        openAlert();
    }, [openAlert]);

    const triggerReloadWithAlert = useCallback((title: string, message: string, type: 'success' | 'error') => {
        const newParams = new URLSearchParams();
        newParams.set('alertTitle', encodeURIComponent(title));
        newParams.set('alertMessage', encodeURIComponent(message));
        newParams.set('alertType', type);
        navigate(`?${newParams.toString()}`, { replace: true });
    }, [navigate]);
    useEffect(() => {
        let objectUrl: string | null = null;
        const loadAvatar = async () => {
            if (authUser?.avatarUrl) {
                try {
                    const blob = await fetchMyAvatar(authUser.avatarUrl);
                    objectUrl = URL.createObjectURL(blob);
                    setCurrentProfileAvatarUrl(objectUrl);
                } catch (error) {
                    console.error("Не удалось загрузить аватар для заголовка профиля:", error);
                    setCurrentProfileAvatarUrl(null);
                }
            } else {
                setCurrentProfileAvatarUrl(null);
            }
        };
        loadAvatar();
        return () => {
            if (objectUrl) {
                URL.revokeObjectURL(objectUrl);
            }
        };
    }, [authUser?.avatarUrl]);
    useEffect(() => {
        if (authUser?.id && !profile && !isLoading && !error) {
            dispatch(fetchProfilePending());
            fetchMyProfile(authUser.id)
                .then(data => {
                    dispatch(fetchProfileSuccess(data));
                    dispatch(setUserProfileData({ ...authUser, ...data }));
                })
                .catch(err => {
                    const msg = err instanceof Error ? err.message : 'Неизвестная ошибка при загрузке профиля';
                    dispatch(fetchProfileFailure(msg));
                    handleOpenAlertDialog('Ошибка загрузки', msg, 'error');
                });
        }
    }, [dispatch, authUser, isLoading, error, profile, handleOpenAlertDialog]);

    useEffect(() => {
        const title = searchParams.get('alertTitle');
        const message = searchParams.get('alertMessage');
        const type = searchParams.get('alertType');

        if (title && message && type) {
            handleOpenAlertDialog(
                decodeURIComponent(title),
                decodeURIComponent(message),
                type as 'success' | 'error'
            );
            setSearchParams({}, { replace: true });
        }
    }, [searchParams, handleOpenAlertDialog, setSearchParams]);


    if (isLoading) {
        return <div className="fixed inset-0 flex justify-center items-center"><Spinner /></div>;
    }

    return (
        <div className="min-h-screen bg-gray-50 p-4 sm:p-8 flex justify-center">
            <div className="w-full max-w-4xl">
                <div className="w-full p-6 bg-white rounded-lg shadow-md flex items-center justify-between mb-8">
                    <div className="flex items-center">
                        <Avatar
                            src={currentProfileAvatarUrl || undefined}
                            size="lg"
                        />
                        <div className="ml-4">
                            <h2 className="text-xl font-semibold text-gray-800">{profile?.name} {profile?.surname}</h2>
                            <p className="text-sm text-gray-500">{profile?.email}</p>
                        </div>
                    </div>
                </div>

                <Card className="shadow-xl p-6 sm:p-8 w-full">
                    <CardBody>
                        <AvatarManagementSection triggerReloadWithAlert={triggerReloadWithAlert} />
                        <ProfileSettingsSection triggerReloadWithAlert={triggerReloadWithAlert} profile={profile} />
                        <ChangePasswordSection openAlertDialog={triggerReloadWithAlert} />
                    </CardBody>
                </Card>
            </div>
            <AlertDialog isOpen={isAlertOpen} onOpenChange={onAlertOpenChange} title={alertTitle} message={alertMessage}
                         type={alertType}/>
        </div>
    );
};

export default EditMyProfilePage;