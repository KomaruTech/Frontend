import LoginForm from '@features/auth/ui/LoginForm';
import { Link } from "@heroui/react";

const LoginPage = () => (
    <section className="flex items-center justify-center min-h-screen bg-gray-100 px-4 py-8">
        <div className="flex flex-col sm:flex-row w-full max-w-[1000px] bg-white shadow-lg rounded-lg overflow-hidden
                    min-h-[auto] sm:min-h-[700px]">
            <div className="sm:w-1/2 w-full flex flex-col justify-center items-start p-6 sm:p-[6%]">
                <div className="flex items-center mb-6">
                    <img
                        src="/images/Logo.svg"
                        alt="Логотип"
                        className="w-10 h-10 mr-4"
                    />
                    <p className="text-[20px] font-semibold">KomaruTech</p>
                </div>
                <h1 className="text-3xl sm:text-[32px] font-semibold mb-8 sm:mb-[35px]">Авторизация</h1>
                <div className="w-full">
                    <LoginForm />
                </div>
                <div className="w-full flex flex-row items-center mt-4 space-x-2">
                    <p className="text-base font-normal">Забыли пароль?</p>
                    <Link href="#" className="text-blue-600 hover:underline">
                        Восстановить
                    </Link>
                </div>
            </div>
            <div className="sm:w-1/2 w-full h-60 sm:h-auto relative overflow-hidden">
                <img
                    src="/images/LoginPage/BG-image.png"
                    alt="Background"
                    className="w-full h-full object-cover object-center"
                />
            </div>
        </div>
    </section>
);

export default LoginPage;