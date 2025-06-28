// src/shared/lib/utils/validationSchemas.ts
import * as yup from 'yup';

export const LoginSchema = yup.object().shape({
    login: yup
        .string()
        .required('Пожалуйста, введите логин')
        .min(3, 'Логин должен содержать минимум 3 символа')
        .matches(/^[А-Яа-яЁё0-9_-]+$/, 'Логин должен содержать только русские буквы'),
    password: yup
        .string()
        .required('Пожалуйста, введите пароль')
        .min(6, 'Пароль должен содержать минимум 6 символов'),
});
