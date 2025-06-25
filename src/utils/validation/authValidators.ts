// src/validation/authValidators.ts

export interface AuthFormValues {
  username: string;
  password: string;
}

export function validateAuthForm(values: AuthFormValues) {
  const errors: Partial<Record<keyof AuthFormValues, string>> = {};

  // Логин: обязателен + только латиница
  if (!values.username) {
    errors.username = 'Введите имя';
  } else if (!/^[A-Za-z]+$/.test(values.username)) {
    errors.username = 'Только английские буквы';
  }

  // Пароль: обязателен + минимум 4 символа
  if (!values.password) {
    errors.password = 'Введите пароль';
  } else if (values.password.length < 4) {
    errors.password = 'Мин. 4 символа';
  }

  return errors;
}
