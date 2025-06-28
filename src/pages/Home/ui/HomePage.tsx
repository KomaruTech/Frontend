// src/pages/home/ui/HomePage.tsx
import React from 'react';
import { WelcomeCard } from './WelcomeCard'; // Компонент, специфичный для этой страницы

const HomePage: React.FC = () => {
    return (
        <div className="flex min-h-screen bg-gray-100">

            {/* Основной контент */}
            <main className="flex-1 p-8 ml-64"> {/* ml-64 для отступа от фиксированного сайдбара, если Sidebar такой ширины */}
                <div className="mb-8 flex justify-between items-center">
                    <h1 className="text-3xl font-semibold text-gray-800">Обзор</h1>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {/* Карточка приветствия */}
                    <WelcomeCard />

                    {/* Дополнительные виджеты/карточки для главной страницы */}
                    {/* Это примеры, вы можете заменить их на реальные виджеты */}
                    <div className="bg-white p-6 rounded-lg shadow-md flex flex-col">
                        <p className="text-4xl font-bold text-gray-800">36</p>
                        <p className="text-gray-600">Мероприятий посещено</p>
                    </div>
                    <div className="bg-white p-6 rounded-lg shadow-md">
                        <h3 className="font-semibold text-lg text-gray-800">Твоя статистика</h3>
                        <p className="text-gray-600">Ваши последние данные.</p>
                        <div className="h-32 bg-gray-50 flex items-center justify-center text-gray-400 border border-dashed rounded-md mt-4">
                            (Здесь мог бы быть график)
                        </div>
                    </div>
                    {/* Здесь можно добавить другие карточки или компоненты */}
                </div>
            </main>
        </div>
    );
};

export default HomePage;