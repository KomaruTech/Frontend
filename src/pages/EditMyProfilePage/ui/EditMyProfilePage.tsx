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

import type { ChangePasswordPayload, UpdateProfilePayload, UserProfile } from "@entities/user/model/types.ts";
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
    uploadAvatarPending,
    uploadAvatarSuccess,
    uploadAvatarFailure,
    deleteAvatarPending,
    deleteAvatarSuccess,
    deleteAvatarFailure,
    clearAvatarStatus
} from "@features/profile/model/profileSlice";
import {
    changeMyPassword,
    fetchMyProfile,
    updateMyProfile,
    uploadMyAvatar,
    deleteMyAvatar,
    fetchMyAvatar // <-- ИМПОРТИРУЕМ НОВУЮ ФУНКЦИЮ
} from "@features/profile/api/profileApi";
import { setUserProfileData } from '@features/auth/model/authSlice';

// Определяем RootState для useSelector
interface RootState {
    auth: {
        user: { id: string; login: string; name: string; surname?: string; email: string; avatarUrl?: string } | null;
        token: string | null;
        isLoading: boolean;
        error: string | null;
    };
    profile: {
        profile: UserProfile | null;
        isLoading: boolean;
        error: string | null;
        isUpdatingProfile: boolean;
        updateProfileError: string | null;
        isChangingPassword: boolean;
        changePasswordError: string | null;
        changePasswordSuccess: boolean;
        isUploadingAvatar: boolean;
        uploadAvatarError: string | null;
        isDeletingAvatar: boolean;
        deleteAvatarError: string | null;
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
                    <ModalBody><p>{message}</p></ModalBody>
                    <ModalFooter>
                        <Button color={type === 'error' ? 'danger' : 'primary'} onPress={onClose}>Закрыть</Button>
                    </ModalFooter>
                </>
            )}
        </ModalContent>
    </Modal>
);

const EditMyProfilePage: React.FC = () => {
    const dispatch = useDispatch();
    const authUser = useSelector((state: RootState) => state.auth.user);

    const {
        profile, isLoading, error, isUpdatingProfile, updateProfileError,
        isChangingPassword, changePasswordError, changePasswordSuccess,
        isUploadingAvatar, uploadAvatarError, isDeletingAvatar, deleteAvatarError
    } = useSelector((state: RootState) => state.profile);

    const { isOpen: isAlertOpen, onOpen: openAlert, onOpenChange: onAlertOpenChange } = useDisclosure();
    const [alertTitle, setAlertTitle] = useState('');
    const [alertMessage, setAlertMessage] = useState('');
    const [alertType, setAlertType] = useState<'success' | 'error'>('success');

    const [profileFormData, setProfileFormData] = useState<UpdateProfilePayload>({ name: '', surname: '', email: '', telegramUsername: undefined });
    const [passwordFormData, setPasswordFormData] = useState({ oldPassword: '', newPassword: '', confirmPassword: '' });
    const [selectedAvatarFile, setSelectedAvatarFile] = useState<File | null>(null);

    // --- НОВОЕ СОСТОЯНИЕ ДЛЯ ЛОКАЛЬНОГО URL АВАТАРА ---
    const [avatarObjectUrl, setAvatarObjectUrl] = useState<string | null>(null);

    const resetPasswordForm = useCallback(() => {
        setPasswordFormData({ oldPassword: '', newPassword: '', confirmPassword: '' });
    }, []);

    // --- НОВЫЙ useEffect ДЛЯ ЗАГРУЗКИ АВАТАРА С ТОКЕНОМ ---
    useEffect(() => {
        let objectUrl: string | null = null;

        const loadAvatar = async () => {
            if (authUser?.avatarUrl) {
                try {
                    const blob = await fetchMyAvatar(authUser.avatarUrl);
                    objectUrl = URL.createObjectURL(blob);
                    setAvatarObjectUrl(objectUrl);
                } catch (error) {
                    console.error("Не удалось загрузить аватар:", error);
                    setAvatarObjectUrl(null); // Сброс в случае ошибки
                }
            } else {
                setAvatarObjectUrl(null); // Если URL аватара нет, сбрасываем состояние
            }
        };

        loadAvatar();

        // Функция очистки для предотвращения утечек памяти
        return () => {
            if (objectUrl) {
                URL.revokeObjectURL(objectUrl);
            }
        };
    }, [authUser?.avatarUrl]); // Перезапускаем эффект, когда URL аватара в Redux меняется

    useEffect(() => {
        if (authUser?.id && !profile && !isLoading && !error) {
            dispatch(fetchProfilePending());
            fetchMyProfile(authUser.id)
                .then(data => dispatch(fetchProfileSuccess(data)))
                .catch(err => {
                    const msg = err instanceof Error ? err.message : 'Неизвестная ошибка загрузки профиля';
                    dispatch(fetchProfileFailure(msg));
                    setAlertTitle('Ошибка загрузки'); setAlertMessage(msg); setAlertType('error'); openAlert();
                });
        }
    }, [dispatch, authUser, isLoading, error, profile, openAlert]);

    useEffect(() => {
        if (profile) {
            setProfileFormData({
                name: profile.name, surname: profile.surname ?? '', email: profile.email,
                telegramUsername: profile.telegramUsername ?? undefined,
            });
        }
    }, [profile]);

    // Effect для ошибок обновления профиля
    useEffect(() => {
        if (updateProfileError) {
            setAlertTitle('Ошибка обновления профиля'); setAlertMessage(updateProfileError);
            setAlertType('error'); openAlert(); dispatch(clearUpdateProfileStatus());
        }
    }, [updateProfileError, dispatch, openAlert]);

    // Effect для смены пароля
    useEffect(() => {
        if (changePasswordError) {
            setAlertTitle('Ошибка изменения пароля'); setAlertMessage(changePasswordError);
            setAlertType('error'); openAlert(); dispatch(clearChangePasswordStatus());
        } else if (changePasswordSuccess) {
            setAlertTitle('Успех!'); setAlertMessage('Пароль успешно изменен.');
            setAlertType('success'); openAlert(); resetPasswordForm(); dispatch(clearChangePasswordStatus());
        }
    }, [changePasswordError, changePasswordSuccess, dispatch, openAlert, resetPasswordForm]);

    // Effect для ошибок с аватаром
    useEffect(() => {
        const error = uploadAvatarError || deleteAvatarError;
        if (error) {
            setAlertTitle(uploadAvatarError ? 'Ошибка загрузки аватара' : 'Ошибка удаления аватара');
            setAlertMessage(error); setAlertType('error'); openAlert(); dispatch(clearAvatarStatus());
        }
    }, [uploadAvatarError, deleteAvatarError, dispatch, openAlert]);

    const handleProfileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        const updatedName = name === 'telegramId' ? 'telegramUsername' : name;
        setProfileFormData(prev => ({ ...prev, [updatedName]: value }));
    };

    const handlePasswordInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setPasswordFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleAvatarFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setSelectedAvatarFile(e.target.files[0]);
        } else {
            setSelectedAvatarFile(null);
        }
    };

    const onProfileFormSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        dispatch(updateProfilePending());
        try {
            await updateMyProfile(profileFormData);
            const fresh = await fetchMyProfile(authUser!.id);
            dispatch(updateProfileSuccess(fresh));
            dispatch(setUserProfileData({ ...fresh }));
            setAlertTitle('Успех!'); setAlertMessage('Профиль успешно обновлен.'); setAlertType('success'); openAlert();
        } catch (err: unknown) {
            const msg = err instanceof Error ? err.message : 'Неизвестная ошибка обновления профиля';
            dispatch(updateProfileFailure(msg));
        }
    };

    const onPasswordFormSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (passwordFormData.newPassword !== passwordFormData.confirmPassword) {
            setAlertTitle('Ошибка валидации'); setAlertMessage('Новый пароль и подтверждение не совпадают.');
            setAlertType('error'); openAlert(); return;
        }
        if (passwordFormData.newPassword.length < 6) {
            setAlertTitle('Ошибка валидации'); setAlertMessage('Пароль должен быть не менее 6 символов.');
            setAlertType('error'); openAlert(); return;
        }
        dispatch(changePasswordPending());
        try {
            await changeMyPassword({ oldPassword: passwordFormData.oldPassword, newPassword: passwordFormData.newPassword });
            dispatch(changePasswordSuccesss());
        } catch (err: unknown) {
            const msg = err instanceof Error ? err.message : 'Неизвестная ошибка изменения пароля';
            dispatch(changePasswordFailure(msg));
        }
    };

    const handleAvatarUpload = async () => {
        if (!selectedAvatarFile) {
            setAlertTitle('Ошибка'); setAlertMessage('Пожалуйста, выберите файл аватара.');
            setAlertType('error'); openAlert(); return;
        }
        dispatch(uploadAvatarPending());
        try {
            const formData = new FormData();
            formData.append('Avatar', selectedAvatarFile);
            const data = await uploadMyAvatar(formData);
            dispatch(uploadAvatarSuccess(data.avatarUrl));
            dispatch(setUserProfileData({ ...authUser!, avatarUrl: data.avatarUrl }));
            setAlertTitle('Успех!'); setAlertMessage('Аватар успешно загружен.'); setAlertType('success'); openAlert();
            setSelectedAvatarFile(null);
        } catch (err: unknown) {
            const msg = err instanceof Error ? err.message : 'Неизвестная ошибка загрузки аватара';
            dispatch(uploadAvatarFailure(msg));
        }
    };

    const handleAvatarDelete = async () => {
        dispatch(deleteAvatarPending());
        try {
            await deleteMyAvatar();
            dispatch(deleteAvatarSuccess());
            dispatch(setUserProfileData({ ...authUser!, avatarUrl: undefined }));
            setAlertTitle('Успех!'); setAlertMessage('Аватар успешно удален.'); setAlertType('success'); openAlert();
        } catch (err: unknown) {
            const msg = err instanceof Error ? err.message : 'Неизвестная ошибка удаления аватара';
            dispatch(deleteAvatarFailure(msg));
        }
    };

    if (isLoading) {
        return <div className="fixed inset-0 flex justify-center items-center"><Spinner /></div>;
    }

    return (
        <div className="min-h-screen bg-gray-50 p-4 sm:p-8 flex justify-center">
            <div className="w-full max-w-4xl">
                <div className="w-full p-6 bg-white rounded-lg shadow-md flex items-center justify-between mb-8">
                    <div className="flex items-center">
                        <Avatar
                            // Используем локальный blob URL. Если его нет, можно показать дефолтный аватар
                            src={avatarObjectUrl || undefined} // `undefined` заставит Avatar показать fallback/инициалы
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
                        <h3 className="text-xl font-semibold text-gray-800 mb-6">Управление Аватаром</h3>
                        <div className="flex flex-col sm:flex-row items-center gap-4 mb-6">
                            <Input type="file" accept="image/*" label="Выберите аватар" variant="bordered"
                                   onChange={handleAvatarFileChange} className="flex-grow"/>
                            <Button color="primary" onPress={handleAvatarUpload} isLoading={isUploadingAvatar}
                                    isDisabled={!selectedAvatarFile}>
                                Загрузить Аватар
                            </Button>
                            {authUser?.avatarUrl && (
                                <Button color="danger" variant="flat" onPress={handleAvatarDelete}
                                        isLoading={isDeletingAvatar}>
                                    Удалить Аватар
                                </Button>
                            )}
                        </div>

                        <Divider className="my-8"/>

                        <form onSubmit={onProfileFormSubmit}>
                            <h3 className="text-xl font-semibold text-gray-800 mb-6">Основные настройки</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                                <Input label="Имя" name="name" placeholder="Ваше имя" variant="bordered"
                                       value={profileFormData.name} onChange={handleProfileInputChange}/>
                                <Input label="Фамилия" name="surname" placeholder="Ваша фамилия" variant="bordered"
                                       value={profileFormData.surname} onChange={handleProfileInputChange}/>
                                <Input label="Email" name="email" type="email" placeholder="Ваш email" variant="bordered"
                                       value={profileFormData.email} onChange={handleProfileInputChange}/>
                                <Input label="Telegram ID" name="telegramId" placeholder="@ваш_telegram_id"
                                       variant="bordered" value={profileFormData.telegramUsername || ''}
                                       onChange={handleProfileInputChange}/>
                            </div>
                            <div className="flex justify-end mt-6">
                                <Button type="submit" color="primary" isLoading={isUpdatingProfile}>Сохранить</Button>
                            </div>
                        </form>

                        <Divider className="my-8"/>

                        <form onSubmit={onPasswordFormSubmit}>
                            <h3 className="text-xl font-semibold text-gray-800 mb-6">Изменить пароль</h3>
                            <div className="grid grid-cols-1 md:grid-cols-1 gap-y-6">
                                <Input label="Текущий пароль" name="oldPassword" type="password" variant="bordered"
                                       value={passwordFormData.oldPassword} onChange={handlePasswordInputChange}/>
                                <Input label="Новый пароль" name="newPassword" type="password" variant="bordered"
                                       value={passwordFormData.newPassword} onChange={handlePasswordInputChange}/>
                                <Input label="Подтвердите пароль" name="confirmPassword" type="password" variant="bordered"
                                       value={passwordFormData.confirmPassword} onChange={handlePasswordInputChange}/>
                            </div>
                            <div className="flex justify-end mt-6">
                                <Button type="submit" color="primary" isLoading={isChangingPassword}>Изменить пароль</Button>
                            </div>
                        </form>
                    </CardBody>
                </Card>
            </div>
            <AlertDialog isOpen={isAlertOpen} onOpenChange={onAlertOpenChange} title={alertTitle} message={alertMessage}
                         type={alertType}/>
        </div>
    );
};

export default EditMyProfilePage;