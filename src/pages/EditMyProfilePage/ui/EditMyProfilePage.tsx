import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import React, { useState, useEffect, useCallback } from 'react';

import {
    Spinner,
    Card,
    useDisclosure,
    Input,
    Button,
    Modal, ModalContent, ModalHeader, ModalBody, ModalFooter,
    Avatar,
    CardBody,
    Divider
} from "@heroui/react";

import type { ChangePasswordPayload, UpdateProfilePayload } from "@entities/user/model/types.ts";
import {
    changePasswordPending,
    changePasswordSuccesss,
    changePasswordFailure,
    clearChangePasswordStatus,
    clearUpdateProfileStatus,
    fetchProfileFailure,
    fetchProfilePending,
    fetchProfileSuccess,
    updateProfileFailure,
    updateProfilePending,
    updateProfileSuccess,
} from "@features/profile/model/profileSlice";
import { changeMyPassword, fetchMyProfile, updateMyProfile } from "@features/profile/api/profileApi";
import { setUserProfileData } from '@features/auth/model/authSlice';

// Предполагается, что RootState определен в другом месте
interface RootState {
    auth: {
        user: { id: string; login: string; name: string; surname?: string; email: string; avatarUrl?: string } | null;
        token: string | null;
        isLoading: boolean;
        error: string | null;
    };
    profile: {
        profile: import("@entities/user/model/types.ts").UserProfile | null;
        isLoading: boolean;
        error: string | null;
        isUpdatingProfile: boolean;
        updateProfileError: string | null;
        isChangingPassword: boolean;
        changePasswordError: string | null;
        changePasswordSuccess: boolean;
    };
}

interface AlertDialogProps {
    isOpen: boolean;
    onOpenChange: (isOpen: boolean) => void;
    title: string;
    message: string;
    type: 'success' | 'error';
}

const AlertDialog: React.FC<AlertDialogProps> = ({ isOpen, onOpenChange, title, message, type }) => (
    <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
            {(onClose) => (
                <>
                    <ModalHeader className={`${type === 'error' ? 'text-red-600' : 'text-green-600'}`}>
                        {title}
                    </ModalHeader>
                    <ModalBody>
                        <p>{message}</p>
                    </ModalBody>
                    <ModalFooter>
                        <Button color={type === 'error' ? 'danger' : 'primary'} onPress={onClose}>
                            Закрыть
                        </Button>
                    </ModalFooter>
                </>
            )}
        </ModalContent>
    </Modal>
);

const EditMyProfilePage: React.FC = () => {
    const dispatch = useDispatch();
    useNavigate();
    const authUser = useSelector((state: RootState) => state.auth.user);

    const {
        profile,
        isLoading,
        error,
        isUpdatingProfile,
        updateProfileError,
        isChangingPassword,
        changePasswordError,
        changePasswordSuccess
    } = useSelector((state: RootState) => state.profile);

    const { isOpen: isAlertOpen, onOpen: openAlert, onOpenChange: onAlertOpenChange } = useDisclosure();
    const [alertTitle, setAlertTitle] = useState('');
    const [alertMessage, setAlertMessage] = useState('');
    const [alertType, setAlertType] = useState<'success' | 'error'>('success');

    const [profileFormData, setProfileFormData] = useState<UpdateProfilePayload>({
        name: '',
        surname: '',
        email: '',
        telegramId: undefined,
    });

    const [passwordFormData, setPasswordFormData] = useState<ChangePasswordPayload & { confirmPassword: string }>({
        oldPassword: '',
        newPassword: '',
        confirmPassword: '',
    });

    const resetPasswordForm = useCallback(() => {
        setPasswordFormData({ oldPassword: '', newPassword: '', confirmPassword: '' });
    }, []);

    useEffect(() => {
        if (authUser?.login && !profile && !isLoading && !error) {
            dispatch(fetchProfilePending());
            fetchMyProfile(authUser.login)
                .then(data => dispatch(fetchProfileSuccess(data)))
                .catch(err => {
                    const msg = err instanceof Error ? err.message : 'Неизвестная ошибка';
                    dispatch(fetchProfileFailure(msg));
                    setAlertTitle('Ошибка загрузки');
                    setAlertMessage(msg);
                    setAlertType('error');
                    openAlert();
                });
        }
    }, [dispatch, authUser, isLoading, error, profile, openAlert]);

    useEffect(() => {
        if (profile) {
            setProfileFormData({
                name: profile.name,
                surname: profile.surname ?? '',
                email: profile.email,
                telegramId: profile.telegramId ?? undefined,
            });
        }
    }, [profile]);

    useEffect(() => {
        if (updateProfileError) {
            setAlertTitle('Ошибка обновления профиля');
            setAlertMessage(updateProfileError);
            setAlertType('error');
            openAlert();
            dispatch(clearUpdateProfileStatus());
        }
    }, [updateProfileError, dispatch, openAlert]);

    useEffect(() => {
        if (changePasswordError) {
            setAlertTitle('Ошибка изменения пароля');
            setAlertMessage(changePasswordError);
            setAlertType('error');
            openAlert();
            dispatch(clearChangePasswordStatus());
        } else if (changePasswordSuccess) {
            setAlertTitle('Успех!');
            setAlertMessage('Пароль успешно изменен.');
            setAlertType('success');
            openAlert();
            resetPasswordForm();
            dispatch(clearChangePasswordStatus());
        }
    }, [changePasswordError, changePasswordSuccess, dispatch, openAlert, resetPasswordForm]);

    const handleProfileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setProfileFormData(prev => ({ ...prev, [name]: value }));
    };

    const handlePasswordInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setPasswordFormData(prev => ({ ...prev, [name]: value }));
    };

    const onProfileFormSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        dispatch(updateProfilePending());
        try {
            await updateMyProfile(profileFormData);
            const fresh = await fetchMyProfile(authUser!.login);
            dispatch(updateProfileSuccess(fresh));
            dispatch(setUserProfileData({ ...fresh }));
            setAlertTitle('Успех!');
            setAlertMessage('Профиль успешно обновлен.');
            setAlertType('success');
            openAlert();
        } catch (err: unknown) {
            const msg = err instanceof Error ? err.message : 'Неизвестная ошибка';
            dispatch(updateProfileFailure(msg));
        }
    };

    const onPasswordFormSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (passwordFormData.newPassword !== passwordFormData.confirmPassword) {
            setAlertTitle('Ошибка валидации');
            setAlertMessage('Новый пароль и подтверждение не совпадают.');
            setAlertType('error');
            openAlert();
            return;
        }
        if (passwordFormData.newPassword.length < 6) {
            setAlertTitle('Ошибка валидации');
            setAlertMessage('Пароль должен быть не менее 6 символов.');
            setAlertType('error');
            openAlert();
            return;
        }
        dispatch(changePasswordPending());
        try {
            await changeMyPassword({ oldPassword: passwordFormData.oldPassword, newPassword: passwordFormData.newPassword });
            dispatch(changePasswordSuccesss());
        } catch (err: unknown) {
            const msg = err instanceof Error ? err.message : 'Неизвестная ошибка';
            dispatch(changePasswordFailure(msg));
        }
    };

    if (isLoading) {
        return <div className="fixed inset-0 flex justify-center items-center"><Spinner /></div>;
    }

    // ... (error and auth checks can remain here) ...

    return (
        <div className="min-h-screen bg-gray-50 p-4 sm:p-8 flex justify-center">
            <div className="w-full max-w-4xl">
                <div className="w-full p-6 bg-white rounded-lg shadow-md flex items-center justify-between mb-8">
                    <div className="flex items-center">
                        <Avatar src={authUser?.avatarUrl || 'https://i.pravatar.cc/150?u=a042581f4e29026704d'} size="lg" />
                        <div className="ml-4">
                            <h2 className="text-xl font-semibold text-gray-800">{profile?.name} {profile?.surname}</h2>
                            <p className="text-sm text-gray-500">{profile?.email}</p>
                        </div>
                    </div>
                </div>

                <Card className="shadow-xl p-6 sm:p-8 w-full">
                    <CardBody>
                        {/* --- Profile Settings Form --- */}
                        <form onSubmit={onProfileFormSubmit}>
                            <h3 className="text-xl font-semibold text-gray-800 mb-6">Основные настройки</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                                <Input
                                    label="Имя"
                                    name="name"
                                    placeholder="Ваше имя"
                                    variant="bordered"
                                    value={profileFormData.name}
                                    onChange={handleProfileInputChange}
                                />
                                <Input
                                    label="Фамилия"
                                    name="surname"
                                    placeholder="Ваша фамилия"
                                    variant="bordered"
                                    value={profileFormData.surname}
                                    onChange={handleProfileInputChange}
                                />
                                <Input
                                    label="Email"
                                    name="email"
                                    type="email"
                                    placeholder="Ваш email"
                                    variant="bordered"
                                    value={profileFormData.email}
                                    onChange={handleProfileInputChange}
                                />
                                <Input
                                    label="Telegram ID"
                                    name="telegramId"
                                    placeholder="@ваш_telegram_id"
                                    variant="bordered"
                                    value={profileFormData.telegramId || ''}
                                    onChange={handleProfileInputChange}
                                />
                            </div>
                            <div className="flex justify-end mt-6">
                                <Button type="submit" color="primary" isLoading={isUpdatingProfile}>
                                    Сохранить изменения
                                </Button>
                            </div>
                        </form>

                        <Divider className="my-8" />

                        {/* --- Change Password Form --- */}
                        <form onSubmit={onPasswordFormSubmit}>
                            <h3 className="text-xl font-semibold text-gray-800 mb-6">Изменить пароль</h3>
                            <div className="grid grid-cols-1 md:grid-cols-1 gap-y-6">
                                <Input
                                    label="Текущий пароль"
                                    name="oldPassword"
                                    type="password"
                                    placeholder="Введите текущий пароль"
                                    variant="bordered"
                                    value={passwordFormData.oldPassword}
                                    onChange={handlePasswordInputChange}
                                />
                                <Input
                                    label="Новый пароль"
                                    name="newPassword"
                                    type="password"
                                    placeholder="Введите новый пароль"
                                    variant="bordered"
                                    value={passwordFormData.newPassword}
                                    onChange={handlePasswordInputChange}
                                />
                                <Input
                                    label="Подтвердите пароль"
                                    name="confirmPassword"
                                    type="password"
                                    placeholder="Повторите новый пароль"
                                    variant="bordered"
                                    value={passwordFormData.confirmPassword}
                                    onChange={handlePasswordInputChange}
                                />
                            </div>
                            <div className="flex justify-end mt-6">
                                <Button type="submit" color="primary" isLoading={isChangingPassword}>
                                    Изменить пароль
                                </Button>
                            </div>
                        </form>
                    </CardBody>
                </Card>
            </div>
            <AlertDialog
                isOpen={isAlertOpen}
                onOpenChange={onAlertOpenChange}
                title={alertTitle}
                message={alertMessage}
                type={alertType}
            />
        </div>
    );
};

export default EditMyProfilePage;