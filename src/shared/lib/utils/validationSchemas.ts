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


export const eventSchema = yup.object().shape({
    title: yup.string()
        .required("Название обязательно")
        .min(4, "Название должно быть от 4 до 64 символов")
        .max(64, "Название должно быть от 4 до 64 символов"),
    description: yup.string()
        .required("Описание обязательно")
        .min(16, "Описание должно быть от 16 до 10000 символов")
        .max(10000, "Описание должно быть от 16 до 10000 символов"),
    type: yup.string()
        .required("Выберите тип мероприятия"),
    startTime: yup.string()
        .required("Укажите время начала")
        .test(
            'is-in-future',
            'Начало должно быть минимум через 2 часа',
            (value) => {
                if (!value) return false;
                const now = new Date();
                const startDate = new Date(`${now.toDateString()} ${value}`);
                return startDate.getTime() > now.getTime() + 2 * 60 * 60 * 1000;
            }
        ),
    endTime: yup.string()
        .test(
            'is-after-start',
            'Окончание должно быть минимум на 10 минут позже начала',
            function(value) {
                const { startTime } = this.parent;
                if (!value || !startTime) return true; // Not required, so valid if empty
                const now = new Date();
                const startDate = new Date(`${now.toDateString()} ${startTime}`);
                const endDate = new Date(`${now.toDateString()} ${value}`);
                return endDate.getTime() > startDate.getTime() + 10 * 60 * 1000;
            }
        ),
    address: yup.string(),
    participants: yup.array().of(yup.object()),
    keywords: yup.array().of(yup.string()),
});
