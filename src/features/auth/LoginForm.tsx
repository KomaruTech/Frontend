import { Formik } from 'formik';
import * as Yup from 'yup';
import { useDispatch } from 'react-redux';
import { loginSuccess } from './authSlice';
import type { AppDispatch } from '../../store';
import { login } from './authApi';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Input, Button } from '@heroui/react';
import { EyeFilledIcon, EyeSlashFilledIcon } from './icons/IconsInput';

// Обновленная схема валидации
const LoginSchema = Yup.object().shape({
  username: Yup.string()
    .required('Введите имя пользователя')
    // Добавляем проверку на русские буквы
    .matches(/^[а-яА-ЯёЁ]+$/, 'Имя должно содержать только русские буквы'),
  password: Yup.string()
    .min(4, 'Минимум 4 символа')
    .required('Введите пароль'),
});

const LoginForm = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const toggleVisibility = () => setIsVisible(!isVisible);

  return (
    <Formik
      initialValues={{ username: '', password: '' }}
      validationSchema={LoginSchema}
      // Явно указываем Formik валидировать при каждом изменении и потере фокуса
      validateOnChange={true}
      validateOnBlur={true}
      onSubmit={async (values, { setSubmitting }) => {
        setError(null);
        try {
          const { user, token } = await login(values);
          dispatch(loginSuccess({ user, token }));
          navigate('/');
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (err: Error | any) {
          setError(err.response?.data?.message || 'Ошибка авторизации');
        } finally {
          setSubmitting(false);
        }
      }}
    >
      {({ values, errors, touched, handleChange, handleBlur, handleSubmit, isSubmitting }) => (
        <form onSubmit={handleSubmit} className="max-w-md mx-auto space-y-6">
          <div>
            <Input
              name="username"
              label="Логин"
              placeholder="Введите логин"
              labelPlacement="outside"
              size="lg"
              value={values.username}
              onChange={handleChange}
              onBlur={handleBlur}
              isRequired
              className='mb-[50px]'
              // Логика отображения ошибок остается прежней и теперь будет работать как надо
              isInvalid={!!(touched.username && errors.username)}
              errorMessage={touched.username && errors.username ? errors.username : undefined}
            />
          </div>

          <div>
            <Input
              name="password"
              label="Пароль"
              labelPlacement="outside"
              endContent={
                <button
                  aria-label="toggle password visibility"
                  className="focus:outline-none"
                  type="button"
                  onClick={toggleVisibility}
                >
                  {isVisible ? (
                    <EyeSlashFilledIcon className="text-2xl text-default-400 pointer-events-none" />
                  ) : (
                    <EyeFilledIcon className="text-2xl text-default-400 pointer-events-none" />
                  )}
                </button>
              }
              placeholder="Введите пароль"
              type={isVisible ? "text" : "password"}
              size="lg"
              value={values.password}
              onChange={handleChange}
              onBlur={handleBlur}
              isRequired
              isInvalid={!!(touched.password && errors.password)}
              errorMessage={touched.password && errors.password ? errors.password : undefined}
            />
          </div>

          {error && <div className="text-red-500 text-center">{error}</div>}

          <Button type="submit" color="primary" isLoading={isSubmitting} fullWidth>
            Войти
          </Button>
        </form>
      )}
    </Formik>
  );
};

export default LoginForm;