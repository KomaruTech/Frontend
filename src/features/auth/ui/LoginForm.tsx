import { Formik } from 'formik';
import { useDispatch } from 'react-redux';
import { loginSuccess } from '../model';
import type { AppDispatch } from '../../../app/store'; // Correct path to AppDispatch
import { login } from '../api/authApi';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Input, Button } from '@heroui/react';
import { EyeFilledIcon, EyeSlashFilledIcon } from '../../../shared/ui/components/IconsInput';
import { LoginSchema } from '../../../shared/lib/utils/validationSchemas';

const LoginForm = () => {
    const dispatch = useDispatch<AppDispatch>();
    const navigate = useNavigate();
    const [error, setError] = useState<string | null>(null);
    const [isVisible, setIsVisible] = useState(false);
    const toggleVisibility = () => setIsVisible(!isVisible);

    return (
        <Formik
            initialValues={{ login: '', password: '' }}
            validationSchema={LoginSchema}
            validateOnChange={true}
            validateOnBlur={true}
            onSubmit={async (values, { setSubmitting }) => {
                setError(null);
                try {
                    // 'values' теперь содержит 'login' и 'password', что соответствует LoginPayload
                    const { user, token } = await login(values);
                    console.log('Login successful:', user, token);
                    dispatch(loginSuccess({ user, token }));
                    navigate('/');
                } catch (err: any) {
                    console.error('Login error:', err);
                    setError(err.response?.data?.message || err.message || 'Ошибка авторизации');
                } finally {
                    setSubmitting(false);
                }
            }}
        >
            {({ values, errors, touched, handleChange, handleBlur, handleSubmit, isSubmitting }) => (
                <form onSubmit={handleSubmit} className="max-w-md mx-auto space-y-6">
                    <div>
                        <Input
                            name="login"
                            label="Логин"
                            placeholder="Введите логин"
                            labelPlacement="outside"
                            size="lg"
                            value={values.login}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            isRequired
                            className='mb-[50px]'
                            isInvalid={!!(touched.login && errors.login)}
                            errorMessage={touched.login && errors.login ? errors.login : undefined}
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