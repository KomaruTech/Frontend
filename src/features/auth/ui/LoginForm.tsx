import { Formik } from 'formik';
import { useDispatch } from 'react-redux';
import { loginSuccess } from '../model';
import type { AppDispatch } from '@app/store';
import { login } from '../api/authApi';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Input, Button } from '@heroui/react';
import { EyeFilledIcon, EyeSlashFilledIcon } from '@shared/ui/icons/IconsInput';
import { LoginSchema } from '@shared/lib/utils/validationSchemas';

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
            validateOnChange
            validateOnBlur
            onSubmit={async (values, { setSubmitting }) => {
                setError(null);
                try {
                    const { user, token } = await login(values);
                    console.log('Login successful:', user, token);
                    dispatch(loginSuccess({ user, token }));
                    navigate('/');
                } catch (err: unknown) {
                    const error = err as { response?: { data?: { title?: string } } };
                    console.error('Login error:', err);
                    setError(error.response?.data?.title || '\u041e\u0448\u0438\u0431\u043a\u0430 \u0430\u0432\u0442\u043e\u0440\u0438\u0437\u0430\u0446\u0438\u0438');
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
                            className="mb-[50px]"
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
                            type={isVisible ? 'text' : 'password'}
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
