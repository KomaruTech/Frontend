import { useNavigate, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import React, { useState, useEffect, useCallback } from 'react';

import {
    Spinner,
    Tabs,
    Tab,
    Card,
    useDisclosure,
    Input,
    Button,
    Modal, ModalContent, ModalHeader, ModalBody, ModalFooter,
    Spacer, CardBody
} from "@heroui/react";

import type { ChangePasswordPayload, UpdateProfilePayload } from "@entities/user/types";
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

// Предполагается, что RootState определен в другом месте, например, в src/app/store.ts или src/types/redux.ts
interface RootState {
    auth: {
        user: { id: string; login: string; name: string; surname?: string; email: string; avatarUrl?: string } | null;
        token: string | null;
        isLoading: boolean;
        error: string | null;
    };
    profile: {
        profile: import("@entities/user/types").UserProfile | null;
        isLoading: boolean; // Для начальной загрузки профиля
        error: string | null;
        isUpdatingProfile: boolean; // Для обновления данных профиля
        updateProfileError: string | null;
        isChangingPassword: boolean; // Для смены пароля
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
    const navigate = useNavigate();
    const location = useLocation();

    const currentAuthUserLogin = useSelector((state: RootState) => state.auth.user?.login);

    const {
        profile,
        isLoading, // Спиннер для первоначальной загрузки профиля
        error,
        isUpdatingProfile, // Спиннер для отправки формы профиля
        updateProfileError,
        isChangingPassword, // Спиннер для отправки формы смены пароля
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
        setPasswordFormData({
            oldPassword: '',
            newPassword: '',
            confirmPassword: '',
        });
    }, []);
    useEffect(() => {
        if (currentAuthUserLogin && !profile && !isLoading && !error) {
            dispatch(fetchProfilePending());
            fetchMyProfile(currentAuthUserLogin)
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
    }, [dispatch, currentAuthUserLogin, isLoading, error, profile, location.pathname, openAlert]);
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
            resetPasswordForm(); // Очищаем поля пароля при успехе
            dispatch(clearChangePasswordStatus()); // Очищаем статус успеха после отображения алерта
        }
    }, [changePasswordError, changePasswordSuccess, dispatch, openAlert, resetPasswordForm]);
    const handleProfileInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setProfileFormData(prev => ({ ...prev, [name]: value }));
    };
    const handlePasswordInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setPasswordFormData(prev => ({ ...prev, [name]: value }));
    };
    const handleClearField = (field: keyof UpdateProfilePayload) => {
        setProfileFormData(prev => ({ ...prev, [field]: '' }));
    };
    const onProfileFormSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        dispatch(updateProfilePending());

        try {
            await updateMyProfile(profileFormData);
            const fresh = await fetchMyProfile(currentAuthUserLogin!);
            dispatch(updateProfileSuccess(fresh));
            dispatch(setUserProfileData({
                name: fresh.name,
                surname: fresh.surname,
                email: fresh.email,
                telegramId: fresh.telegramId,
            }));
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

    // Определяем, должен ли отображаться блокирующий спиннер (для начальной загрузки или отправки данных)
    const isPageBlocking = isLoading || isUpdatingProfile || isChangingPassword;

    if (isPageBlocking) {
        return (
            <div className="fixed inset-0 bg-gray-100 bg-opacity-75 flex justify-center items-center z-50">
                <Spinner />
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-100 p-8">
                <Card className="p-6 text-center">
                    <h2 className="text-xl font-semibold text-red-600 mb-4">Ошибка загрузки профиля</h2>
                    <p className="text-gray-700">{error}</p>
                    <Button onPress={() => navigate('/')} className="mt-4">
                        Вернуться на главную
                    </Button>
                </Card>
            </div>
        );
    }

    if (!currentAuthUserLogin) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-100 p-8">
                <Card className="p-6 text-center">
                    <h2 className="text-xl font-semibold text-gray-800 mb-4">Пользователь не авторизован</h2>
                    <p className="text-gray-700">Пожалуйста, войдите в систему.</p>
                    <Button onPress={() => navigate('/login')} className="mt-4">
                        Перейти к входу
                    </Button>
                </Card>
            </div>
        );
    }

    if (!profile) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-100 p-8">
                <Card className="p-6 text-center">
                    <h2 className="text-xl font-semibold text-gray-800 mb-4">Профиль не найден</h2>
                    <p className="text-gray-700">Произошла ошибка при загрузке профиля.</p>
                    <Button onPress={() => navigate('/')} className="mt-4">
                        Вернуться на главную
                    </Button>
                </Card>
            </div>
        );
    }
    return (
        <div className="min-h-screen bg-gray-100 p-4 sm:p-8 flex justify-center items-center">
            <Card className="shadow-xl p-6 sm:p-8 w-full max-w-2xl">
                <h1 className="text-2xl sm:text-3xl font-semibold text-gray-800 mb-6 text-center">
                    Мой Профиль
                </h1>

                <Tabs aria-label="Profile Sections" fullWidth>
                    <Tab title="Основные настройки">
                        <CardBody className="py-6 px-4">
                            <form onSubmit={onProfileFormSubmit}>
                                <Input
                                    isClearable
                                    label="Имя"
                                    name="name"
                                    placeholder="Введите ваше имя"
                                    variant="bordered"
                                    value={profileFormData.name}
                                    onChange={handleProfileInputChange}
                                    className="mb-4"
                                    onClear={() => handleClearField('name')}
                                />
                                <Input
                                    label="Фамилия"
                                    name="surname"
                                    placeholder="Введите вашу фамилию"
                                    isClearable
                                    variant="bordered"
                                    value={profileFormData.surname}
                                    onChange={handleProfileInputChange}
                                    onClear={() => handleClearField('surname')}
                                    className="mb-4"
                                />
                                <Input
                                    label="Email"
                                    name="email"
                                    placeholder="Введите ваш email"
                                    type="email"
                                    isClearable
                                    variant="bordered"
                                    value={profileFormData.email}
                                    onChange={handleProfileInputChange}
                                    onClear={() => handleClearField('email')}
                                    className="mb-4"
                                />
                                <Input
                                    label="Telegram ID"
                                    name="telegramId"
                                    placeholder="@your_telegram_id"
                                    isClearable
                                    variant="bordered"
                                    value={profileFormData.telegramId || ''}
                                    onChange={handleProfileInputChange}
                                    onClear={() => handleClearField('telegramId')}
                                    className="mb-4"
                                />
                                <Spacer y={4} />
                                <div className="flex justify-end gap-4">
                                    <Button
                                        type="submit"
                                        color="primary"
                                    >
                                        Сохранить изменения
                                    </Button>
                                </div>
                            </form>
                        </CardBody>
                    </Tab>
                    <Tab title="Изменить пароль">
                        <CardBody className="py-6 px-4">
                            <form onSubmit={onPasswordFormSubmit}>
                                <Input
                                    label="Текущий пароль"
                                    name="oldPassword"
                                    placeholder="Введите текущий пароль"
                                    type="password"
                                    variant="bordered"
                                    value={passwordFormData.oldPassword}
                                    onChange={handlePasswordInputChange}
                                    className="mb-4"
                                />
                                <Input
                                    label="Новый пароль"
                                    name="newPassword"
                                    placeholder="Введите новый пароль"
                                    type="password"
                                    variant="bordered"
                                    value={passwordFormData.newPassword}
                                    onChange={handlePasswordInputChange}
                                    className="mb-4"
                                />
                                <Input
                                    label="Подтвердите пароль"
                                    name="confirmPassword"
                                    placeholder="Повторите новый пароль"
                                    type="password"
                                    variant="bordered"
                                    value={passwordFormData.confirmPassword}
                                    onChange={handlePasswordInputChange}
                                    className="mb-4"
                                />
                                <Spacer y={4} />
                                <div className="flex justify-end gap-4">
                                    <Button
                                        type="submit"
                                        color="primary"
                                    >
                                        Изменить пароль
                                    </Button>
                                </div>
                            </form>
                        </CardBody>
                    </Tab>
                </Tabs>
            </Card>
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