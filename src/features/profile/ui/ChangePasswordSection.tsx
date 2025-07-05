// src/features/profile/ui/ChangePasswordSection.tsx
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Input, Button } from "@heroui/react";
import { Formik } from 'formik';
import axios, { AxiosError } from 'axios';

import {ChangePasswordSchema} from "@shared/lib/utils/validationSchemas.ts";
import {
    changePasswordPending,
    changePasswordSuccesss,
    changePasswordFailure,
    clearChangePasswordStatus
} from "@features/profile/model/profileSlice";
import { changeMyPassword } from "@features/profile/api/profileApi";
import type { ChangePasswordPayload } from "@entities/user/model/types.ts";
import type { RootState } from '@app/store';
import type { ApiErrorResponse } from '@shared/api/types';

interface ChangePasswordSectionProps {
    openAlertDialog: (title: string, message: string, type: 'success' | 'error') => void;
}

export const ChangePasswordSection: React.FC<ChangePasswordSectionProps> = ({ openAlertDialog }) => {
    const dispatch = useDispatch();
    const { isChangingPassword, changePasswordError, changePasswordSuccess } = useSelector((state: RootState) => state.profile);
    useEffect(() => {
        if (changePasswordError) {
            openAlertDialog('Ошибка смены пароля', changePasswordError, 'error');
            dispatch(clearChangePasswordStatus());
        } else if (changePasswordSuccess) {
            openAlertDialog('Успех!', 'Пароль успешно изменен.', 'success');
            dispatch(clearChangePasswordStatus());
        }
    }, [changePasswordError, changePasswordSuccess, dispatch, openAlertDialog]);
    return (
        <Formik
            initialValues={{ oldPassword: '', newPassword: '', confirmPassword: '' }}
            validationSchema={ChangePasswordSchema}
            validateOnChange
            validateOnBlur
            onSubmit={async (values, { resetForm }) => {
                dispatch(changePasswordPending());
                try {
                    const payload: ChangePasswordPayload = {
                        oldPassword: values.oldPassword,
                        newPassword: values.newPassword
                    };
                    await changeMyPassword(payload);
                    dispatch(changePasswordSuccesss());
                    resetForm();
                } catch (err: unknown) {
                    let msg = 'Неизвестная ошибка смены пароля';
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
                    dispatch(changePasswordFailure(msg));
                }
            }}
        >
            {({ values, errors, touched, handleChange, handleBlur, handleSubmit }) => (
                <form onSubmit={handleSubmit}>
                    <h3 className="text-xl font-semibold text-gray-800 mb-6">Сменить пароль</h3>
                    <div className="grid grid-cols-1 md:grid-cols-1 gap-y-6">
                        <Input
                            label="Текущий пароль"
                            name="oldPassword"
                            type="password"
                            variant="bordered"
                            value={values.oldPassword}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            isInvalid={!!(touched.oldPassword && errors.oldPassword)}
                            errorMessage={touched.oldPassword && errors.oldPassword ? errors.oldPassword : undefined}
                        />
                        <Input
                            label="Новый пароль"
                            name="newPassword"
                            type="password"
                            variant="bordered"
                            value={values.newPassword}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            isInvalid={!!(touched.newPassword && errors.newPassword)}
                            errorMessage={touched.newPassword && errors.newPassword ? errors.newPassword : undefined}
                        />
                        <Input
                            label="Подтвердите новый пароль"
                            name="confirmPassword"
                            type="password"
                            variant="bordered"
                            value={values.confirmPassword}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            isInvalid={!!(touched.confirmPassword && errors.confirmPassword)}
                            errorMessage={touched.confirmPassword && errors.confirmPassword ? errors.confirmPassword : undefined}
                        />
                    </div>
                    <div className="flex justify-end mt-6">
                        <Button type="submit" color="primary" isLoading={isChangingPassword}>
                            Сменить пароль
                        </Button>
                    </div>
                </form>
            )}
        </Formik>
    );
};