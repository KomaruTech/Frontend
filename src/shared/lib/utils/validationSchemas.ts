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

export const ChangePasswordSchema = yup.object().shape({
    oldPassword: yup
        .string()
        .required('Пожалуйста, введите текущий пароль'),
    newPassword: yup
        .string()
        .required('Пожалуйста, введите новый пароль')
        .min(6, 'Новый пароль должен содержать минимум 6 символов')
        .notOneOf([yup.ref('oldPassword')], 'Новый пароль не может совпадать со старым'),
    confirmPassword: yup
        .string()
        .required('Пожалуйста, подтвердите новый пароль')
        .oneOf([yup.ref('newPassword')], 'Пароли не совпадают'),
});

export const UpdateProfileSchema = yup.object().shape({
    name: yup
        .string()
        .required('Имя обязательно')
        .min(2, 'Имя должно быть не менее 2 символов')
        .matches(/^[А-Яа-яЁё\s-]+$/, 'Имя должно содержать только русские буквы, пробелы или дефисы'),
    surname: yup
        .string()
        .required('Фамилия обязательна')
        .min(2, 'Фамилия должна быть не менее 2 символов')
        .matches(/^[А-Яа-яЁё\s-]+$/, 'Фамилия должна содержать только русские буквы, пробелы или дефисы'),
    email: yup
        .string()
        .email('Введите корректный Email')
        .required('Email обязателен'),
    telegramId: yup
        .string()
        .nullable()
        .notRequired()
        .matches(
            /^@?(\w{5,32})$/,
            'Неверный формат Telegram ID (начинается с @, 5-32 символа, только буквы/цифры/подчеркивания)'
        )
        .transform(value => (value === '' ? null : value))
});